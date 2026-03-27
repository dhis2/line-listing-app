import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    acSetUiDetailsPanelOpen,
    acToggleUiExpandedCard,
    acSetUiExpandedCards,
    acToggleUiSidebarHidden,
} from '../../actions/ui.js'
import {
    ACCESSORY_PANEL_TAB_YOUR,
    ACCESSORY_PANEL_TAB_MAIN_DIMENSIONS,
} from '../../modules/accessoryPanelConstants.js'
import { sGetUiSidebarHidden, sGetUiExpandedCards } from '../../reducers/ui.js'
import { CardSection } from './CardSection/index.js'
import {
    DataSourceCard,
    getDataSourceCardId,
    getEnrollmentCardId,
    getProgramDataCardId,
    getPersonCardId,
    getProgramIndicatorsCardId,
    getTrackedEntityCardId,
    getDataSourceStageCardId,
} from './DataSourceCard.jsx'
import { MainDimensions } from './MainDimensions.jsx'
import styles from './MainSidebar.module.css'
import {
    SelectedDimensionsProvider,
    useSelectedDimensions,
} from './SelectedDimensionsContext.jsx'
import { UnifiedSearch } from './UnifiedSearch.jsx'
import { useDataSources } from './useDataSources.js'
import { useResizableMainSidebar } from './useResizableMainSidebar.js'
import { YourDimensionsPanel } from './YourDimensionsPanel/index.js'

const MainSidebar = ({ position = 'left', onPositionChange }) => {
    const dispatch = useDispatch()
    const expandedCards = useSelector(sGetUiExpandedCards) || []
    const { width, handleMouseDown, handleDoubleClick } =
        useResizableMainSidebar()
    const [isDragging, setIsDragging] = useState(false)
    const sidebarRef = React.useRef(null)
    const [unifiedSearchTerm, setUnifiedSearchTerm] = useState('')
    const [mainDimensionsEmpty, setMainDimensionsEmpty] = useState(false)
    const [yourDimensionsEmpty, setYourDimensionsEmpty] = useState(false)
    const [typeFilter, setTypeFilter] = useState(null)
    const [isScrolled, setIsScrolled] = useState(false)
    const cardsContainerRef = React.useRef(null)

    // Fetch all data sources
    const {
        programs,
        trackedEntityTypes,
        loading: dataSourcesLoading,
    } = useDataSources()

    // Combine all data sources for rendering
    const allDataSources = useMemo(() => {
        return [...programs, ...trackedEntityTypes]
    }, [programs, trackedEntityTypes])

    const isHidden = useSelector(sGetUiSidebarHidden)
    const closeDetailsPanel = () => dispatch(acSetUiDetailsPanelOpen(false))
    const toggleSidebar = useCallback(() => {
        dispatch(acToggleUiSidebarHidden())
    }, [dispatch])
    const onCardClick = useCallback(
        (id) => {
            dispatch(acToggleUiExpandedCard(id))
            closeDetailsPanel()
        },
        [dispatch]
    )

    // Get all available card IDs for collapse/expand all
    const getAllCardIds = useCallback(() => {
        const cardIds = []

        // Add card IDs for each data source
        allDataSources.forEach((dataSource) => {
            const {
                id,
                dataSourceType,
                isProgramWithRegistration,
                programStages,
            } = dataSource

            // Data source top-level card
            cardIds.push(getDataSourceCardId(id))

            if (dataSourceType === 'PROGRAM') {
                if (isProgramWithRegistration) {
                    // Nested cards for programs with registration
                    cardIds.push(getEnrollmentCardId(id))
                    cardIds.push(getProgramDataCardId(id))
                    cardIds.push(getPersonCardId(id))
                    cardIds.push(getProgramIndicatorsCardId(id))
                    // Stage cards
                    if (programStages) {
                        programStages.forEach((stage) => {
                            cardIds.push(getDataSourceStageCardId(id, stage.id))
                        })
                    }
                }
            } else if (dataSourceType === 'TRACKED_ENTITY_TYPE') {
                cardIds.push(getTrackedEntityCardId(id))
            }
        })

        // Always available cards
        cardIds.push(ACCESSORY_PANEL_TAB_MAIN_DIMENSIONS)
        cardIds.push(ACCESSORY_PANEL_TAB_YOUR)

        return cardIds
    }, [allDataSources])

    const onCollapseAllCards = useCallback(() => {
        const availableCardIds = getAllCardIds()

        // Check if any cards are currently expanded
        const hasExpandedCards = expandedCards.length > 0

        if (hasExpandedCards) {
            // If any cards are expanded, collapse all
            dispatch(acSetUiExpandedCards([]))
        } else {
            // If all are collapsed, expand all available cards
            dispatch(acSetUiExpandedCards(availableCardIds))
        }

        closeDetailsPanel()
    }, [dispatch, expandedCards, getAllCardIds])

    const { counts } = useSelectedDimensions()

    // Drag handle for sidebar repositioning
    const handleDragStart = useCallback(
        (e) => {
            e.preventDefault()
            setIsDragging(true)

            const handleDragMove = (moveEvent) => {
                const currentX = moveEvent.clientX
                const viewportCenter = window.innerWidth / 2

                // Determine if we should switch sides based on cursor position
                if (position === 'left' && currentX > viewportCenter) {
                    onPositionChange?.('right')
                } else if (position === 'right' && currentX < viewportCenter) {
                    onPositionChange?.('left')
                }
            }

            const handleDragEnd = () => {
                setIsDragging(false)
                document.removeEventListener('mousemove', handleDragMove)
                document.removeEventListener('mouseup', handleDragEnd)
            }

            document.addEventListener('mousemove', handleDragMove)
            document.addEventListener('mouseup', handleDragEnd)
        },
        [position, onPositionChange]
    )

    // Handle scroll detection for UnifiedSearch shadow
    useEffect(() => {
        const container = cardsContainerRef.current
        if (!container) return

        const handleScroll = () => {
            setIsScrolled(container.scrollTop > 0)
        }

        container.addEventListener('scroll', handleScroll)
        return () => container.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div
            ref={sidebarRef}
            className={cx(styles.container, {
                [styles.hidden]: isHidden,
                [styles.positionRight]: position === 'right',
                [styles.dragging]: isDragging,
            })}
        >
            <div
                className={styles.main}
                data-test="main-sidebar"
                style={{ width: `${width}px` }}
            >
                {/* UnifiedSearch - always shown */}
                <UnifiedSearch
                    onSearchChange={setUnifiedSearchTerm}
                    onCollapseAll={onCollapseAllCards}
                    hasExpandedCards={expandedCards.length > 0}
                    typeFilter={typeFilter}
                    onTypeFilterChange={setTypeFilter}
                    showModeToggle={false}
                    showTypeFilter={false}
                    isScrolled={isScrolled}
                />

                <div ref={cardsContainerRef} className={styles.cardsContainer}>
                    {/* Loading state */}
                    {dataSourcesLoading && (
                        <div className={styles.loadingPlaceholder}>
                            {i18n.t('Loading data sources...')}
                        </div>
                    )}

                    {/* Render a card for each data source */}
                    {!dataSourcesLoading &&
                        allDataSources.map((dataSource) => (
                            <DataSourceCard
                                key={dataSource.id}
                                dataSource={dataSource}
                                searchTerm={unifiedSearchTerm}
                                typeFilter={typeFilter}
                            />
                        ))}

                    {/* Metadata Card - hoisted to top level, shown once */}
                    {!dataSourcesLoading && allDataSources.length > 0 && (
                        <CardSection
                            label={i18n.t('Metadata')}
                            onClick={() =>
                                onCardClick(ACCESSORY_PANEL_TAB_MAIN_DIMENSIONS)
                            }
                            expanded={expandedCards.includes(
                                ACCESSORY_PANEL_TAB_MAIN_DIMENSIONS
                            )}
                            count={counts.metadata}
                            dataTest="main-dimensions-card"
                            isEmpty={mainDimensionsEmpty}
                        >
                            <MainDimensions
                                searchTerm={unifiedSearchTerm}
                                typeFilter={typeFilter}
                                onEmptyStateChange={setMainDimensionsEmpty}
                            />
                        </CardSection>
                    )}

                    {/* Other Card - hoisted to top level, shown once */}
                    {!dataSourcesLoading && allDataSources.length > 0 && (
                        <CardSection
                            label={i18n.t('Other')}
                            onClick={() =>
                                onCardClick(ACCESSORY_PANEL_TAB_YOUR)
                            }
                            expanded={expandedCards.includes(
                                ACCESSORY_PANEL_TAB_YOUR
                            )}
                            count={counts.your}
                            dataTest="your-dimensions-card"
                            isEmpty={yourDimensionsEmpty}
                        >
                            <YourDimensionsPanel
                                visible={true}
                                searchTerm={unifiedSearchTerm}
                                typeFilter={typeFilter}
                                onEmptyStateChange={setYourDimensionsEmpty}
                            />
                        </CardSection>
                    )}
                </div>
                <div
                    className={cx(styles.resizeHandle, {
                        [styles.resizeHandleLeft]: position === 'right',
                    })}
                    onMouseDown={handleMouseDown}
                    onDoubleClick={handleDoubleClick}
                    data-test="main-sidebar-resize-handle"
                />
                {/* Drag handle for repositioning sidebar - at bottom */}
                <div
                    className={cx(styles.dragHandle, {
                        [styles.dragHandleRight]: position === 'right',
                    })}
                    onMouseDown={handleDragStart}
                    title={
                        position === 'left'
                            ? i18n.t('Drag to move sidebar to the right')
                            : i18n.t('Drag to move sidebar to the left')
                    }
                    data-test="sidebar-drag-handle"
                >
                    <div className={styles.dragHandleGrip} />
                </div>
            </div>
        </div>
    )
}

const MainSidebarWithSelectedDimensionsProvider = ({
    position,
    onPositionChange,
}) => (
    <SelectedDimensionsProvider>
        <MainSidebar position={position} onPositionChange={onPositionChange} />
    </SelectedDimensionsProvider>
)

export { MainSidebarWithSelectedDimensionsProvider as MainSidebar }
