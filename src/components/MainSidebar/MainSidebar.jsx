import { DIMENSION_TYPE_PROGRAM_INDICATOR } from '@dhis2/analytics'
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
    ACCESSORY_PANEL_TAB_TRACKED_ENTITY,
    ACCESSORY_PANEL_TAB_YOUR,
    ACCESSORY_PANEL_TAB_MAIN_DIMENSIONS,
    ACCESSORY_PANEL_TAB_ORG_UNITS,
    ACCESSORY_PANEL_TAB_PERIODS,
    ACCESSORY_PANEL_TAB_STATUSES,
    ACCESSORY_PANEL_TAB_DATA,
    ACCESSORY_PANEL_TAB_ENROLLMENT,
    ACCESSORY_PANEL_TAB_PROGRAM_INDICATORS,
    ACCESSORY_PANEL_TAB_PROGRAMS_USING_TYPE,
    getStageCardId,
} from '../../modules/accessoryPanelConstants.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../../modules/programTypes.js'
import { useDebounce } from '../../modules/utils.js'
import { OUTPUT_TYPE_ENROLLMENT } from '../../modules/visualization.js'
import { sGetMetadataById } from '../../reducers/metadata.js'
import {
    sGetUiSidebarHidden,
    sGetUiExpandedCards,
    sGetUiEntityTypeId,
    sGetUiDataSourceType,
    sGetUiDataSourceId,
} from '../../reducers/ui.js'
import { CardSection } from './CardSection/index.js'
import { InputPanel } from './InputPanel/index.js'
import { MainDimensions } from './MainDimensions.jsx'
import styles from './MainSidebar.module.css'
import {
    OrganizationUnitsPanel,
    PeriodsPanel,
    StatusesPanel,
    DataPanel,
} from './DataTypeGrouping/index.js'
import { EnrollmentDimensionsPanel } from './ProgramDimensionsPanel/EnrollmentDimensionsPanel.jsx'
import { StageDimensionsPanel } from './ProgramDimensionsPanel/StageDimensionsPanel.jsx'
import { ProgramIndicatorsPanel } from './ProgramDimensionsPanel/ProgramIndicatorsPanel.jsx'
import { useProgramDataDimensions } from './ProgramDimensionsPanel/useProgramDataDimensions.js'
import {
    SelectedDimensionsProvider,
    useSelectedDimensions,
} from './SelectedDimensionsContext.jsx'
import { TrackedEntityDimensionsPanel } from './TrackedEntityDimensionsPanel/index.js'
import { ProgramsUsingTypePanel } from './ProgramsUsingTypePanel/index.js'
import { UnifiedSearch } from './UnifiedSearch.jsx'
import { useResizableMainSidebar } from './useResizableMainSidebar.js'
import { YourDimensionsPanel } from './YourDimensionsPanel/index.js'

const VIEW_MODE_BY_TYPE = 'BY_TYPE'
const VIEW_MODE_PROGRAM_CONFIG = 'PROGRAM_CONFIG'

// Type filter constants for Program config mode
const TYPE_FILTER_ALL = 'ALL'
const TYPE_FILTER_ORG_UNITS = 'ORG_UNITS'
const TYPE_FILTER_PERIODS = 'PERIODS'
const TYPE_FILTER_STATUSES = 'STATUSES'
const TYPE_FILTER_DATA_ELEMENTS = 'DATA_ELEMENTS'
const TYPE_FILTER_PROGRAM_ATTRIBUTES = 'PROGRAM_ATTRIBUTES'
const TYPE_FILTER_PROGRAM_INDICATORS = 'PROGRAM_INDICATORS'
const TYPE_FILTER_CATEGORIES = 'CATEGORIES'
const TYPE_FILTER_CATEGORY_OPTION_GROUP_SETS = 'CATEGORY_OPTION_GROUP_SETS'

const MainSidebar = () => {
    const dispatch = useDispatch()
    const expandedCards = useSelector(sGetUiExpandedCards) || []
    const { width, handleMouseDown, handleDoubleClick } =
        useResizableMainSidebar()
    const [unifiedSearchTerm, setUnifiedSearchTerm] = useState('')
    const [mainDimensionsEmpty, setMainDimensionsEmpty] = useState(false)
    const [trackedEntityDimensionsEmpty, setTrackedEntityDimensionsEmpty] =
        useState(false)
    const [yourDimensionsEmpty, setYourDimensionsEmpty] = useState(false)
    const [viewMode, setViewMode] = useState(VIEW_MODE_BY_TYPE)
    const [typeFilter, setTypeFilter] = useState(TYPE_FILTER_ALL)
    const [isScrolled, setIsScrolled] = useState(false)
    const cardsContainerRef = React.useRef(null)

    // Data source state
    const dataSourceType = useSelector(sGetUiDataSourceType)
    const dataSourceId = useSelector(sGetUiDataSourceId)
    const selectedEntityTypeId = useSelector(sGetUiEntityTypeId)

    // Get metadata based on data source
    const dataSource = useSelector((state) =>
        sGetMetadataById(state, dataSourceId)
    )

    // Entity type metadata
    const entityType = useSelector((state) =>
        sGetMetadataById(state, selectedEntityTypeId)
    )

    // Check if data source is selected
    const hasDataSource = Boolean(dataSourceId)

    // Check if this is a program with registration (for program config view)
    const isProgramWithRegistration =
        dataSource?.programType === PROGRAM_TYPE_WITH_REGISTRATION &&
        dataSource?.programStages &&
        dataSource.programStages.length > 0

    // Get program indicators to check if we should show the card (for program config view)
    const debouncedSearchTerm = useDebounce(unifiedSearchTerm || '')
    const { dimensions: programIndicators, loading: programIndicatorsLoading } =
        useProgramDataDimensions({
            inputType: OUTPUT_TYPE_ENROLLMENT,
            program: dataSource,
            searchTerm: debouncedSearchTerm,
            dimensionType: DIMENSION_TYPE_PROGRAM_INDICATOR,
        })

    // Check if there are any program indicators
    const hasProgramIndicators = useMemo(() => {
        if (!isProgramWithRegistration || !dataSource?.id) return false
        if (programIndicatorsLoading) return true // Show card while loading
        return programIndicators && programIndicators.length > 0
    }, [
        isProgramWithRegistration,
        dataSource?.id,
        programIndicatorsLoading,
        programIndicators,
    ])

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
    const onCollapseAllCards = useCallback(() => {
        // Get all available card IDs based on current state and view mode
        const availableCardIds = []

        if (hasDataSource) {
            if (dataSourceType !== 'TRACKED_ENTITY_TYPE') {
                // Program cards based on view mode
                if (viewMode === VIEW_MODE_BY_TYPE) {
                    // Data type grouping cards
                    availableCardIds.push(ACCESSORY_PANEL_TAB_ORG_UNITS)
                    availableCardIds.push(ACCESSORY_PANEL_TAB_PERIODS)
                    availableCardIds.push(ACCESSORY_PANEL_TAB_STATUSES)
                    availableCardIds.push(ACCESSORY_PANEL_TAB_DATA)
                } else {
                    // Program config view (enrollment/stages)
                    if (isProgramWithRegistration) {
                        availableCardIds.push(ACCESSORY_PANEL_TAB_ENROLLMENT)
                        dataSource.programStages.forEach((stage) => {
                            availableCardIds.push(getStageCardId(stage.id))
                        })
                        if (hasProgramIndicators) {
                            availableCardIds.push(
                                ACCESSORY_PANEL_TAB_PROGRAM_INDICATORS
                            )
                        }
                    }
                }
            } else {
                // Tracked entity card
                if (entityType?.name) {
                    availableCardIds.push(ACCESSORY_PANEL_TAB_TRACKED_ENTITY)
                    availableCardIds.push(
                        ACCESSORY_PANEL_TAB_PROGRAMS_USING_TYPE
                    )
                }
            }

            // Always available cards (when data source is selected)
            availableCardIds.push(ACCESSORY_PANEL_TAB_MAIN_DIMENSIONS)
            availableCardIds.push(ACCESSORY_PANEL_TAB_YOUR)
        }

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
    }, [
        dispatch,
        expandedCards,
        entityType,
        hasDataSource,
        dataSourceType,
        viewMode,
        isProgramWithRegistration,
        dataSource,
        hasProgramIndicators,
    ])
    const { counts } = useSelectedDimensions()

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

    // Auto-expand cards when data source is selected or view mode changes
    useEffect(() => {
        if (dataSourceId) {
            const cardsToExpand = []

            if (dataSourceType !== 'TRACKED_ENTITY_TYPE') {
                // Expand cards based on view mode
                if (viewMode === VIEW_MODE_BY_TYPE) {
                    // Data type grouping cards
                    if (
                        !expandedCards.includes(ACCESSORY_PANEL_TAB_ORG_UNITS)
                    ) {
                        cardsToExpand.push(ACCESSORY_PANEL_TAB_ORG_UNITS)
                    }
                    if (!expandedCards.includes(ACCESSORY_PANEL_TAB_PERIODS)) {
                        cardsToExpand.push(ACCESSORY_PANEL_TAB_PERIODS)
                    }
                    if (!expandedCards.includes(ACCESSORY_PANEL_TAB_STATUSES)) {
                        cardsToExpand.push(ACCESSORY_PANEL_TAB_STATUSES)
                    }
                    if (!expandedCards.includes(ACCESSORY_PANEL_TAB_DATA)) {
                        cardsToExpand.push(ACCESSORY_PANEL_TAB_DATA)
                    }
                } else if (isProgramWithRegistration) {
                    // Program config view (enrollment/stages)
                    if (
                        !expandedCards.includes(ACCESSORY_PANEL_TAB_ENROLLMENT)
                    ) {
                        cardsToExpand.push(ACCESSORY_PANEL_TAB_ENROLLMENT)
                    }
                    // Expand all stage cards
                    dataSource.programStages.forEach((stage) => {
                        const stageCardId = getStageCardId(stage.id)
                        if (!expandedCards.includes(stageCardId)) {
                            cardsToExpand.push(stageCardId)
                        }
                    })
                    // Expand program indicators card if applicable
                    if (
                        hasProgramIndicators &&
                        !expandedCards.includes(
                            ACCESSORY_PANEL_TAB_PROGRAM_INDICATORS
                        )
                    ) {
                        cardsToExpand.push(
                            ACCESSORY_PANEL_TAB_PROGRAM_INDICATORS
                        )
                    }
                }
            }

            // Expand tracked entity card if applicable
            if (
                entityType?.name &&
                dataSourceType === 'TRACKED_ENTITY_TYPE' &&
                !expandedCards.includes(ACCESSORY_PANEL_TAB_TRACKED_ENTITY)
            ) {
                cardsToExpand.push(ACCESSORY_PANEL_TAB_TRACKED_ENTITY)
            }

            // Expand main dimensions and your dimensions cards
            if (!expandedCards.includes(ACCESSORY_PANEL_TAB_MAIN_DIMENSIONS)) {
                cardsToExpand.push(ACCESSORY_PANEL_TAB_MAIN_DIMENSIONS)
            }
            if (!expandedCards.includes(ACCESSORY_PANEL_TAB_YOUR)) {
                cardsToExpand.push(ACCESSORY_PANEL_TAB_YOUR)
            }

            // Dispatch all expansions at once
            if (cardsToExpand.length > 0) {
                cardsToExpand.forEach((cardId) => {
                    dispatch(acToggleUiExpandedCard(cardId))
                })
            }
        }
    }, [dataSourceId, viewMode]) // Trigger when data source or view mode changes

    return (
        <div
            className={cx(styles.container, {
                [styles.hidden]: isHidden,
            })}
        >
            <div
                className={styles.main}
                data-test="main-sidebar"
                style={{ width: `${width}px`, paddingTop: '4px' }}
            >
                <InputPanel visible={true} />

                {/* Show UnifiedSearch when data source is selected */}
                {hasDataSource && (
                    <UnifiedSearch
                        onSearchChange={setUnifiedSearchTerm}
                        onCollapseAll={onCollapseAllCards}
                        hasExpandedCards={expandedCards.length > 0}
                        viewMode={viewMode}
                        onViewModeChange={(mode) => {
                            setViewMode(mode)
                            setTypeFilter(TYPE_FILTER_ALL)
                        }}
                        typeFilter={typeFilter}
                        onTypeFilterChange={setTypeFilter}
                        showModeToggle={
                            dataSourceType !== 'TRACKED_ENTITY_TYPE' &&
                            isProgramWithRegistration
                        }
                        showTypeFilter={
                            dataSourceType !== 'TRACKED_ENTITY_TYPE' &&
                            isProgramWithRegistration &&
                            viewMode === VIEW_MODE_PROGRAM_CONFIG
                        }
                        isScrolled={isScrolled}
                    />
                )}

                <div ref={cardsContainerRef} className={styles.cardsContainer}>
                    {/* Show placeholder when no data source is selected */}
                    {!hasDataSource && (
                        <div className={styles.placeholderCardsWrapper}>
                            <div
                                className={styles.placeholderCard}
                                data-test="placeholder-card-1"
                            >
                                <div>
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 32 32"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g clipPath="url(#clip0_2936_26231)">
                                            <path
                                                d="M27 29H13C11.9 29 11 28.1 11 27V23H13V27H27V13H23V11H27C28.1 11 29 11.9 29 13V27C29 28.1 28.1 29 27 29Z"
                                                fill="#A0ADBA"
                                            />
                                            <path
                                                d="M21 19H11V21H21V19Z"
                                                fill="#A0ADBA"
                                            />
                                            <path
                                                d="M21 15H11V17H21V15Z"
                                                fill="#A0ADBA"
                                            />
                                            <path
                                                d="M21 11H11V13H21V11Z"
                                                fill="#A0ADBA"
                                            />
                                            <path
                                                d="M5 3H19C20.1 3 21 3.9 21 5V9H19V5H5V19H9V21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3Z"
                                                fill="#A0ADBA"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2936_26231">
                                                <rect
                                                    width="32"
                                                    height="32"
                                                    fill="white"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                    <p>
                                        {i18n.t(
                                            'Choose a data source to see available dimensions'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Program dimensions cards - show based on view mode */}
                    {hasDataSource &&
                        dataSourceType !== 'TRACKED_ENTITY_TYPE' &&
                        viewMode === VIEW_MODE_BY_TYPE && (
                            <>
                                {/* Data type grouping: Show org units, periods, and data cards */}
                                {/* Organization Units Card */}
                                <CardSection
                                    label={i18n.t('Organisation units')}
                                    onClick={() =>
                                        onCardClick(
                                            ACCESSORY_PANEL_TAB_ORG_UNITS
                                        )
                                    }
                                    expanded={expandedCards.includes(
                                        ACCESSORY_PANEL_TAB_ORG_UNITS
                                    )}
                                    dataTest="org-units-card"
                                >
                                    <OrganizationUnitsPanel
                                        program={dataSource}
                                        searchTerm={unifiedSearchTerm}
                                    />
                                </CardSection>

                                {/* Periods Card */}
                                <CardSection
                                    label={i18n.t('Periods')}
                                    onClick={() =>
                                        onCardClick(ACCESSORY_PANEL_TAB_PERIODS)
                                    }
                                    expanded={expandedCards.includes(
                                        ACCESSORY_PANEL_TAB_PERIODS
                                    )}
                                    dataTest="periods-card"
                                >
                                    <PeriodsPanel
                                        program={dataSource}
                                        searchTerm={unifiedSearchTerm}
                                    />
                                </CardSection>

                                {/* Statuses Card */}
                                <CardSection
                                    label={i18n.t('Statuses')}
                                    onClick={() =>
                                        onCardClick(
                                            ACCESSORY_PANEL_TAB_STATUSES
                                        )
                                    }
                                    expanded={expandedCards.includes(
                                        ACCESSORY_PANEL_TAB_STATUSES
                                    )}
                                    dataTest="statuses-card"
                                >
                                    <StatusesPanel
                                        program={dataSource}
                                        searchTerm={unifiedSearchTerm}
                                    />
                                </CardSection>

                                {/* Data Card */}
                                <CardSection
                                    label={i18n.t('Data')}
                                    onClick={() =>
                                        onCardClick(ACCESSORY_PANEL_TAB_DATA)
                                    }
                                    expanded={expandedCards.includes(
                                        ACCESSORY_PANEL_TAB_DATA
                                    )}
                                    dataTest="data-card"
                                >
                                    <DataPanel
                                        program={dataSource}
                                        searchTerm={unifiedSearchTerm}
                                    />
                                </CardSection>
                            </>
                        )}

                    {/* Program config view: Show enrollment + stage cards */}
                    {hasDataSource &&
                        dataSourceType !== 'TRACKED_ENTITY_TYPE' &&
                        viewMode === VIEW_MODE_PROGRAM_CONFIG &&
                        isProgramWithRegistration && (
                            <>
                                {/* Enrollment Card */}
                                <CardSection
                                    label={
                                        dataSource?.name === 'Child Programme'
                                            ? i18n.t('Pregnancy')
                                            : i18n.t('Enrollment')
                                    }
                                    onClick={() =>
                                        onCardClick(
                                            ACCESSORY_PANEL_TAB_ENROLLMENT
                                        )
                                    }
                                    expanded={expandedCards.includes(
                                        ACCESSORY_PANEL_TAB_ENROLLMENT
                                    )}
                                    dataTest="enrollment-card"
                                >
                                    <EnrollmentDimensionsPanel
                                        program={dataSource}
                                        searchTerm={unifiedSearchTerm}
                                        typeFilter={typeFilter}
                                    />
                                </CardSection>

                                {/* Stage Cards - one per stage */}
                                {dataSource.programStages.map((stage) => {
                                    const stageCardId = getStageCardId(stage.id)
                                    return (
                                        <CardSection
                                            key={stageCardId}
                                            label={stage.name}
                                            onClick={() =>
                                                onCardClick(stageCardId)
                                            }
                                            expanded={expandedCards.includes(
                                                stageCardId
                                            )}
                                            dataTest={`stage-${stage.id}-card`}
                                        >
                                            <StageDimensionsPanel
                                                program={dataSource}
                                                stage={stage}
                                                searchTerm={unifiedSearchTerm}
                                                typeFilter={typeFilter}
                                            />
                                        </CardSection>
                                    )
                                })}

                                {/* Program Indicators Card - only show if there are indicators */}
                                {hasProgramIndicators && (
                                    <CardSection
                                        label={i18n.t('Program Indicators')}
                                        onClick={() =>
                                            onCardClick(
                                                ACCESSORY_PANEL_TAB_PROGRAM_INDICATORS
                                            )
                                        }
                                        expanded={expandedCards.includes(
                                            ACCESSORY_PANEL_TAB_PROGRAM_INDICATORS
                                        )}
                                        dataTest="program-indicators-card"
                                    >
                                        <ProgramIndicatorsPanel
                                            program={dataSource}
                                            searchTerm={unifiedSearchTerm}
                                            typeFilter={typeFilter}
                                        />
                                    </CardSection>
                                )}
                            </>
                        )}

                    {/* TrackedEntityDimensions Card - shown for tracked entity type data sources only */}
                    {entityType?.name &&
                        hasDataSource &&
                        dataSourceType === 'TRACKED_ENTITY_TYPE' && (
                            <CardSection
                                label={`${entityType.name} ${i18n.t('data')}`}
                                onClick={() =>
                                    onCardClick(
                                        ACCESSORY_PANEL_TAB_TRACKED_ENTITY
                                    )
                                }
                                expanded={expandedCards.includes(
                                    ACCESSORY_PANEL_TAB_TRACKED_ENTITY
                                )}
                                count={counts.trackedEntity}
                                dataTest="tracked-entity-dimensions-card"
                                isEmpty={trackedEntityDimensionsEmpty}
                            >
                                <TrackedEntityDimensionsPanel
                                    visible={true}
                                    searchTerm={unifiedSearchTerm}
                                    onEmptyStateChange={
                                        setTrackedEntityDimensionsEmpty
                                    }
                                />
                            </CardSection>
                        )}

                    {/* Programs Using Type Card - shown for tracked entity type data sources only */}
                    {entityType?.name &&
                        hasDataSource &&
                        dataSourceType === 'TRACKED_ENTITY_TYPE' && (
                            <CardSection
                                label={i18n.t(
                                    'Programs where {{typeName}} is used',
                                    {
                                        typeName: entityType.name,
                                    }
                                )}
                                onClick={() =>
                                    onCardClick(
                                        ACCESSORY_PANEL_TAB_PROGRAMS_USING_TYPE
                                    )
                                }
                                expanded={expandedCards.includes(
                                    ACCESSORY_PANEL_TAB_PROGRAMS_USING_TYPE
                                )}
                                dataTest="programs-using-type-card"
                            >
                                <ProgramsUsingTypePanel
                                    visible={true}
                                    searchTerm={unifiedSearchTerm}
                                />
                            </CardSection>
                        )}

                    {hasDataSource && (
                        <CardSection
                            label={i18n.t('Metadata')}
                            onClick={() =>
                                onCardClick(ACCESSORY_PANEL_TAB_MAIN_DIMENSIONS)
                            }
                            expanded={expandedCards.includes(
                                ACCESSORY_PANEL_TAB_MAIN_DIMENSIONS
                            )}
                            dataTest="main-dimensions-card"
                            isEmpty={mainDimensionsEmpty}
                        >
                            <MainDimensions
                                searchTerm={unifiedSearchTerm}
                                onEmptyStateChange={setMainDimensionsEmpty}
                            />
                        </CardSection>
                    )}

                    {hasDataSource && (
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
                                onEmptyStateChange={setYourDimensionsEmpty}
                            />
                        </CardSection>
                    )}
                </div>
                <div
                    className={styles.resizeHandle}
                    onMouseDown={handleMouseDown}
                    onDoubleClick={handleDoubleClick}
                    data-test="main-sidebar-resize-handle"
                />
            </div>
        </div>
    )
}

const MainSidebarWithSelectedDimensionsProvider = () => (
    <SelectedDimensionsProvider>
        <MainSidebar />
    </SelectedDimensionsProvider>
)

export { MainSidebarWithSelectedDimensionsProvider as MainSidebar }
