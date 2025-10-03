import i18n from '@dhis2/d2-i18n'
import { IconArrowRight16, IconFolder16 } from '@dhis2/ui'
import cx from 'classnames'
import React, { useCallback, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useResizableMainSidebar } from './useResizableMainSidebar.js'
import {
    acSetUiDetailsPanelOpen,
    acToggleUiExpandedCard,
} from '../../actions/ui.js'
import {
    ACCESSORY_PANEL_TAB_INPUT,
    ACCESSORY_PANEL_TAB_PROGRAM,
    ACCESSORY_PANEL_TAB_TRACKED_ENTITY,
    ACCESSORY_PANEL_TAB_YOUR,
    ACCESSORY_PANEL_TAB_MAIN_DIMENSIONS,
    ACCESSORY_PANEL_TAB_PROGRAM_DIMENSIONS,
} from '../../modules/accessoryPanelConstants.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../../modules/programTypes.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../modules/visualization.js'
import { sGetMetadataById } from '../../reducers/metadata.js'
import {
    sGetUiInputType,
    sGetUiProgramId,
    sGetUiSidebarHidden,
    sGetUiProgramStageId,
    sGetUiExpandedCards,
    sGetUiEntityTypeId,
    sGetUiSplitDataCards,
} from '../../reducers/ui.js'
import { CardSection } from './CardSection/index.js'
import { InputPanel, getLabelForInputType } from './InputPanel/index.js'
import { MainDimensions } from './MainDimensions.jsx'
import styles from './MainSidebar.module.css'
import { ProgramDimensionsPanel } from './ProgramDimensionsPanel/index.js'
import { ProgramDimensionsOnly } from './ProgramDimensionsPanel/ProgramDimensionsOnly.jsx'
import { ProgramDataOnly } from './ProgramDimensionsPanel/ProgramDataOnly.jsx'
import {
    SelectedDimensionsProvider,
    useSelectedDimensions,
} from './SelectedDimensionsContext.jsx'
import { TrackedEntityDimensionsPanel } from './TrackedEntityDimensionsPanel/index.js'
import { UnifiedSearch } from './UnifiedSearch.jsx'
import { YourDimensionsPanel } from './YourDimensionsPanel/index.js'

const MainSidebar = () => {
    const dispatch = useDispatch()
    const expandedCards = useSelector(sGetUiExpandedCards) || []
    const splitDataCards = useSelector(sGetUiSplitDataCards)
    const { width, handleMouseDown, handleDoubleClick } = useResizableMainSidebar()
    const [unifiedSearchTerm, setUnifiedSearchTerm] = useState('')
    const [mainDimensionsEmpty, setMainDimensionsEmpty] = useState(false)
    const [trackedEntityDimensionsEmpty, setTrackedEntityDimensionsEmpty] = useState(false)
    const [yourDimensionsEmpty, setYourDimensionsEmpty] = useState(false)
    const [programDimensionsEmpty, setProgramDimensionsEmpty] = useState(false)
    const selectedInputType = useSelector(sGetUiInputType)
    const selectedProgramId = useSelector(sGetUiProgramId)
    const selectedStageId = useSelector(sGetUiProgramStageId)
    const selectedEntityTypeId = useSelector(sGetUiEntityTypeId)
    const program = useSelector((state) =>
        sGetMetadataById(state, selectedProgramId)
    )
    const stage = useSelector((state) =>
        sGetMetadataById(state, selectedStageId)
    )
    const entityType = useSelector((state) =>
        sGetMetadataById(state, selectedEntityTypeId)
    )
    const getSubtitle = () => {
        if (
            selectedInputType === OUTPUT_TYPE_EVENT &&
            program?.programType === PROGRAM_TYPE_WITH_REGISTRATION &&
            program?.name &&
            stage?.name
        ) {
            return `${program.name} - ${stage.name}`
        } else if (selectedInputType === OUTPUT_TYPE_TRACKED_ENTITY) {
            return entityType?.name
        } else {
            return program?.name
        }
    }

    const isHidden = useSelector(sGetUiSidebarHidden)
    const closeDetailsPanel = () => dispatch(acSetUiDetailsPanelOpen(false))
    const onCardClick = useCallback(
        (id) => {
            dispatch(acToggleUiExpandedCard(id))
            closeDetailsPanel()
        },
        [dispatch]
    )
    const { counts } = useSelectedDimensions()

    // Auto-expand "Org. units, periods, and statuses" card when split mode is first enabled
    useEffect(() => {
        if (splitDataCards) {
            // Only auto-expand if the card is not already expanded (respect user's manual collapse)
            if (!expandedCards.includes(ACCESSORY_PANEL_TAB_PROGRAM_DIMENSIONS)) {
                dispatch(acToggleUiExpandedCard(ACCESSORY_PANEL_TAB_PROGRAM_DIMENSIONS))
            }
        }
    }, [splitDataCards]) // Only trigger when split mode changes, not when program/entity changes

    return (
        <div
            className={cx(styles.container, {
                [styles.hidden]: isHidden,
            })}
        >
            <div 
                className={styles.main} 
                data-test="main-sidebar"
                style={{ width: `${width}px` }}
            >
                <InputPanel visible={true} />
                
                <UnifiedSearch onSearchChange={setUnifiedSearchTerm} />
                
                <div className={styles.cardsContainer}>
                    {entityType?.name && (
                        <CardSection
                            label={`${entityType.name} ${i18n.t('data')}`}
                            onClick={() => onCardClick(ACCESSORY_PANEL_TAB_TRACKED_ENTITY)}
                            expanded={expandedCards.includes(ACCESSORY_PANEL_TAB_TRACKED_ENTITY)}
                            count={counts.trackedEntity}
                            dataTest="tracked-entity-dimensions-card"
                            isEmpty={trackedEntityDimensionsEmpty}
                        >
                            <TrackedEntityDimensionsPanel 
                                visible={true} 
                                searchTerm={unifiedSearchTerm} 
                                onEmptyStateChange={setTrackedEntityDimensionsEmpty}
                            />
                        </CardSection>
                    )}

                    {splitDataCards ? (
                        <>
                            {/* Program Dimensions Card */}
                            <CardSection
                                label={i18n.t('Org. units, periods, and statuses')}
                                onClick={() => onCardClick(ACCESSORY_PANEL_TAB_PROGRAM_DIMENSIONS)}
                                expanded={expandedCards.includes(ACCESSORY_PANEL_TAB_PROGRAM_DIMENSIONS)}
                                dataTest="program-dimensions-only-card"
                                isEmpty={programDimensionsEmpty}
                            >
                                {!(selectedProgramId || selectedEntityTypeId) ? (
                                    <div style={{ 
                                        padding: 'var(--spacers-dp16)', 
                                        textAlign: 'center', 
                                        color: 'var(--colors-grey600)',
                                        fontSize: '13px'
                                    }}>
                                        {i18n.t('Choose a program to show org. units, periods, and statuses')}
                                    </div>
                                ) : (
                                    <ProgramDimensionsOnly 
                                        searchTerm={unifiedSearchTerm}
                                        onEmptyStateChange={setProgramDimensionsEmpty}
                                    />
                                )}
                            </CardSection>
                            
                            {/* Program Data Card */}
                            <CardSection
                                label={
                                    selectedInputType === OUTPUT_TYPE_TRACKED_ENTITY 
                                        ? i18n.t('Program data') 
                                        : i18n.t('Data')
                                }
                                onClick={() => onCardClick(ACCESSORY_PANEL_TAB_PROGRAM)}
                                expanded={expandedCards.includes(ACCESSORY_PANEL_TAB_PROGRAM)}
                                count={selectedProgramId || selectedEntityTypeId ? counts.program : undefined}
                                dataTest="program-data-card"
                            >
                                {!(selectedProgramId || selectedEntityTypeId) ? (
                                    <div style={{ 
                                        padding: 'var(--spacers-dp16)', 
                                        textAlign: 'center', 
                                        color: 'var(--colors-grey600)',
                                        fontSize: '13px'
                                    }}>
                                        {i18n.t('Choose a program to show available data')}
                                    </div>
                                ) : (
                                    <ProgramDataOnly searchTerm={unifiedSearchTerm} />
                                )}
                            </CardSection>
                        </>
                    ) : (
                        /* Combined Program Dimensions Card (original behavior) */
                        <CardSection
                            label={
                                selectedInputType === OUTPUT_TYPE_TRACKED_ENTITY 
                                    ? i18n.t('Program data') 
                                    : i18n.t('Data')
                            }
                            onClick={() => onCardClick(ACCESSORY_PANEL_TAB_PROGRAM)}
                            expanded={expandedCards.includes(ACCESSORY_PANEL_TAB_PROGRAM)}
                            count={selectedProgramId || selectedEntityTypeId ? counts.program : undefined}
                            dataTest="program-dimensions-card"
                        >
                            {!(selectedProgramId || selectedEntityTypeId) ? (
                                <div style={{ 
                                    padding: 'var(--spacers-dp16)', 
                                    textAlign: 'center', 
                                    color: 'var(--colors-grey600)',
                                    fontSize: '13px'
                                }}>
                                    {i18n.t('Choose a program to show available data')}
                                </div>
                            ) : (
                                <ProgramDimensionsPanel visible={true} searchTerm={unifiedSearchTerm} />
                            )}
                        </CardSection>
                    )}

                    <CardSection
                        label={i18n.t('Metadata')}
                        onClick={() => onCardClick(ACCESSORY_PANEL_TAB_MAIN_DIMENSIONS)}
                        expanded={expandedCards.includes(ACCESSORY_PANEL_TAB_MAIN_DIMENSIONS)}
                        dataTest="main-dimensions-card"
                        isEmpty={mainDimensionsEmpty}
                    >
                        <MainDimensions 
                            searchTerm={unifiedSearchTerm} 
                            onEmptyStateChange={setMainDimensionsEmpty}
                        />
                    </CardSection>
                    
                    <CardSection
                        label={i18n.t('Other')}
                        onClick={() => onCardClick(ACCESSORY_PANEL_TAB_YOUR)}
                        expanded={expandedCards.includes(ACCESSORY_PANEL_TAB_YOUR)}
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
