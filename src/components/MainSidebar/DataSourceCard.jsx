import { DIMENSION_TYPE_PROGRAM_INDICATOR } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import React, { useState, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acToggleUiExpandedCard } from '../../actions/ui.js'
import {
    ACCESSORY_PANEL_TAB_ENROLLMENT,
    ACCESSORY_PANEL_TAB_PROGRAM_INDICATORS,
    ACCESSORY_PANEL_TAB_PERSON,
    ACCESSORY_PANEL_TAB_EVENT,
    ACCESSORY_PANEL_TAB_PROGRAM_DATA,
    ACCESSORY_PANEL_TAB_TRACKED_ENTITY,
    getStageCardId,
} from '../../modules/accessoryPanelConstants.js'
import { useDebounce } from '../../modules/utils.js'
import { OUTPUT_TYPE_ENROLLMENT } from '../../modules/visualization.js'
import { sGetUiExpandedCards } from '../../reducers/ui.js'
import { CardSection } from './CardSection/index.js'
import { CARD_TYPE_PROGRAM_INDICATORS } from '../../modules/paginationConfig.js'
import { usePaginationConfig } from '../PaginationConfigContext.jsx'
import { EnrollmentDimensionsPanel } from './ProgramDimensionsPanel/EnrollmentDimensionsPanel.jsx'
import { EventDimensionsPanel } from './ProgramDimensionsPanel/EventDimensionsPanel.jsx'
import { StageDimensionsPanel } from './ProgramDimensionsPanel/StageDimensionsPanel.jsx'
import { ProgramIndicatorsPanel } from './ProgramDimensionsPanel/ProgramIndicatorsPanel.jsx'
import { PersonDimensionsPanel } from './ProgramDimensionsPanel/PersonDimensionsPanel.jsx'
import { useProgramDataDimensions } from './ProgramDimensionsPanel/useProgramDataDimensions.js'
import { TrackedEntityDimensionsPanel } from './TrackedEntityDimensionsPanel/index.js'
import { useDataSourceDimensionCounts } from './useDataSourceDimensionCounts.js'
import styles from './DataSourceCard.module.css'

// Helper to generate unique card IDs per data source
const getDataSourceCardId = (dataSourceId) => `datasource-${dataSourceId}`
const getEnrollmentCardId = (dataSourceId) => `enrollment-${dataSourceId}`
const getEventCardId = (dataSourceId) => `event-${dataSourceId}`
const getProgramDataCardId = (dataSourceId) => `programdata-${dataSourceId}`
const getPersonCardId = (dataSourceId) => `person-${dataSourceId}`
const getProgramIndicatorsCardId = (dataSourceId) =>
    `programindicators-${dataSourceId}`
const getTrackedEntityCardId = (dataSourceId) => `trackedentity-${dataSourceId}`
const getDataSourceStageCardId = (dataSourceId, stageId) =>
    `stage-${dataSourceId}-${stageId}`

export const DataSourceCard = ({ dataSource, searchTerm, typeFilter }) => {
    const dispatch = useDispatch()
    const expandedCards = useSelector(sGetUiExpandedCards) || []
    const { getPageSize } = usePaginationConfig()
    const programIndicatorsPageSize = getPageSize(CARD_TYPE_PROGRAM_INDICATORS)

    // Empty state trackers
    const [enrollmentDimensionsEmpty, setEnrollmentDimensionsEmpty] =
        useState(false)
    const [personDimensionsEmpty, setPersonDimensionsEmpty] = useState(false)
    const [programIndicatorsEmpty, setProgramIndicatorsEmpty] = useState(false)
    const [stageEmptyStates, setStageEmptyStates] = useState({})
    const [trackedEntityDimensionsEmpty, setTrackedEntityDimensionsEmpty] =
        useState(false)

    const { id, name, dataSourceType, isProgramWithRegistration } = dataSource

    // Get dimension counts for this data source
    const counts = useDataSourceDimensionCounts(dataSource)

    // Card IDs for this data source
    const dataSourceCardId = getDataSourceCardId(id)
    const enrollmentCardId = getEnrollmentCardId(id)
    const eventCardId = getEventCardId(id)
    const programDataCardId = getProgramDataCardId(id)
    const personCardId = getPersonCardId(id)
    const programIndicatorsCardId = getProgramIndicatorsCardId(id)
    const trackedEntityCardId = getTrackedEntityCardId(id)

    // Check if cards are expanded
    const isDataSourceExpanded = expandedCards.includes(dataSourceCardId)
    const isEnrollmentExpanded = expandedCards.includes(enrollmentCardId)
    const isEventExpanded = expandedCards.includes(eventCardId)
    const isProgramDataExpanded = expandedCards.includes(programDataCardId)
    const isPersonExpanded = expandedCards.includes(personCardId)
    const isProgramIndicatorsExpanded = expandedCards.includes(
        programIndicatorsCardId
    )
    const isTrackedEntityExpanded = expandedCards.includes(trackedEntityCardId)

    // Debounced search term for API calls
    const debouncedSearchTerm = useDebounce(searchTerm || '')

    // Check for program indicators
    const { dimensions: programIndicators, loading: programIndicatorsLoading } =
        useProgramDataDimensions({
            inputType: OUTPUT_TYPE_ENROLLMENT,
            program: dataSourceType === 'PROGRAM' ? dataSource : null,
            searchTerm: debouncedSearchTerm,
            dimensionType: DIMENSION_TYPE_PROGRAM_INDICATOR,
            pageSize: programIndicatorsPageSize,
        })

    const hasProgramIndicators = useMemo(() => {
        if (dataSourceType !== 'PROGRAM' || !isProgramWithRegistration) {
            return false
        }
        if (programIndicatorsLoading) return true
        return programIndicators && programIndicators.length > 0
    }, [
        dataSourceType,
        isProgramWithRegistration,
        programIndicatorsLoading,
        programIndicators,
    ])

    // Toggle handlers
    const onCardClick = useCallback(
        (cardId) => {
            dispatch(acToggleUiExpandedCard(cardId))
        },
        [dispatch]
    )

    // Callback to update individual stage empty state
    const handleStageEmptyStateChange = useCallback((stageId, isEmpty) => {
        setStageEmptyStates((prev) => {
            if (prev[stageId] === isEmpty) return prev
            return { ...prev, [stageId]: isEmpty }
        })
    }, [])

    // Check if all stages are empty
    const allStagesEmpty = useMemo(() => {
        if (!dataSource?.programStages?.length) return false
        return dataSource.programStages.every(
            (stage) => stageEmptyStates[stage.id] === true
        )
    }, [dataSource?.programStages, stageEmptyStates])

    // Calculate total count for the data source card
    const totalCount = useMemo(() => {
        return (
            (counts.enrollment || 0) +
            (counts.event || 0) +
            (counts.person || 0) +
            (counts.programIndicators || 0) +
            (counts.trackedEntity || 0)
        )
    }, [counts])

    // Render content based on data source type
    const renderContent = () => {
        if (dataSourceType === 'TRACKED_ENTITY_TYPE') {
            // Tracked Entity Type content
            return (
                <TrackedEntityDimensionsPanel
                    visible={true}
                    trackedEntityType={dataSource}
                    searchTerm={searchTerm}
                    onEmptyStateChange={setTrackedEntityDimensionsEmpty}
                />
            )
        }

        if (dataSourceType === 'PROGRAM') {
            if (!isProgramWithRegistration) {
                // Program WITHOUT registration - Event card content
                return (
                    <EventDimensionsPanel
                        program={dataSource}
                        searchTerm={searchTerm}
                    />
                )
            }

            // Program WITH registration - nested cards
            return (
                <div className={styles.nestedCards}>
                    {/* Enrollment Card */}
                    <CardSection
                        label={
                            dataSource?.name === 'Child Programme'
                                ? i18n.t('Pregnancy data')
                                : i18n.t('Enrollment data')
                        }
                        onClick={() => onCardClick(enrollmentCardId)}
                        expanded={isEnrollmentExpanded}
                        count={counts.enrollment}
                        dataTest={`enrollment-card-${id}`}
                        nested
                        isEmpty={enrollmentDimensionsEmpty}
                    >
                        <EnrollmentDimensionsPanel
                            program={dataSource}
                            searchTerm={searchTerm}
                            typeFilter={typeFilter}
                            onEmptyStateChange={setEnrollmentDimensionsEmpty}
                        />
                    </CardSection>

                    {/* Event Data Card with nested stages */}
                    <CardSection
                        label={i18n.t('Event data')}
                        onClick={() => onCardClick(programDataCardId)}
                        expanded={isProgramDataExpanded}
                        count={counts.event}
                        dataTest={`program-data-card-${id}`}
                        nested
                        isEmpty={allStagesEmpty}
                    >
                        {dataSource.programStages.map((stage) => {
                            const stageCardId = getDataSourceStageCardId(
                                id,
                                stage.id
                            )
                            return (
                                <CardSection
                                    key={stageCardId}
                                    label={stage.name}
                                    onClick={() => onCardClick(stageCardId)}
                                    expanded={expandedCards.includes(
                                        stageCardId
                                    )}
                                    count={counts.stages?.[stage.id]}
                                    dataTest={`stage-${id}-${stage.id}-card`}
                                    nested
                                    isEmpty={stageEmptyStates[stage.id]}
                                >
                                    <StageDimensionsPanel
                                        program={dataSource}
                                        stage={stage}
                                        searchTerm={searchTerm}
                                        typeFilter={typeFilter}
                                        onEmptyStateChange={(isEmpty) =>
                                            handleStageEmptyStateChange(
                                                stage.id,
                                                isEmpty
                                            )
                                        }
                                    />
                                </CardSection>
                            )
                        })}
                    </CardSection>

                    {/* Person Registration Card */}
                    <CardSection
                        label={i18n.t('{{entityTypeName}} registration', {
                            entityTypeName:
                                dataSource?.trackedEntityType?.name ||
                                i18n.t('Tracked entity'),
                        })}
                        onClick={() => onCardClick(personCardId)}
                        expanded={isPersonExpanded}
                        count={counts.person}
                        dataTest={`person-card-${id}`}
                        nested
                        isEmpty={personDimensionsEmpty}
                    >
                        <PersonDimensionsPanel
                            program={dataSource}
                            searchTerm={searchTerm}
                            typeFilter={typeFilter}
                            onEmptyStateChange={setPersonDimensionsEmpty}
                        />
                    </CardSection>

                    {/* Program Indicators Card */}
                    {hasProgramIndicators && (
                        <CardSection
                            label={i18n.t('Program Indicators')}
                            onClick={() => onCardClick(programIndicatorsCardId)}
                            expanded={isProgramIndicatorsExpanded}
                            count={counts.programIndicators}
                            dataTest={`program-indicators-card-${id}`}
                            nested
                            isEmpty={programIndicatorsEmpty}
                        >
                            <ProgramIndicatorsPanel
                                program={dataSource}
                                searchTerm={searchTerm}
                                typeFilter={typeFilter}
                                onEmptyStateChange={setProgramIndicatorsEmpty}
                            />
                        </CardSection>
                    )}
                </div>
            )
        }

        return null
    }

    return (
        <CardSection
            label={name}
            onClick={() => onCardClick(dataSourceCardId)}
            expanded={isDataSourceExpanded}
            count={totalCount}
            dataTest={`datasource-card-${id}`}
        >
            {renderContent()}
        </CardSection>
    )
}

// Export card ID helpers for expand/collapse logic
export {
    getDataSourceCardId,
    getEnrollmentCardId,
    getEventCardId,
    getProgramDataCardId,
    getPersonCardId,
    getProgramIndicatorsCardId,
    getTrackedEntityCardId,
    getDataSourceStageCardId,
}
