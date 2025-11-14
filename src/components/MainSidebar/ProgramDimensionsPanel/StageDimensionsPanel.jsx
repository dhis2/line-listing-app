import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import {
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'
import {
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_EVENT_STATUS,
} from '../../../modules/dimensionConstants.js'
import { formatDimensionId } from '../../../modules/dimensionId.js'
import { OUTPUT_TYPE_EVENT } from '../../../modules/visualization.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { acAddMetadata } from '../../../actions/metadata.js'
import { DimensionsList } from '../DimensionsList/index.js'
import { ProgramDataDimensionsList } from './ProgramDataDimensionsList.jsx'
import { useProgramDataDimensions } from './useProgramDataDimensions.js'
import { useDebounce } from '../../../modules/utils.js'

const StageDimensionsPanel = ({ program, stage, searchTerm }) => {
    const dispatch = useDispatch()
    const debouncedSearchTerm = useDebounce(searchTerm || '')

    // Get stage-specific dimensions from metadata
    // NOTE: Backend doesn't support stage-specific org units, so we create mock dimensions
    // with stage-specific IDs that will display with stage suffixes in the layout
    const stageOrgUnitId =
        program?.id && stage?.id
            ? formatDimensionId({
                  dimensionId: DIMENSION_ID_ORGUNIT,
                  programId: program.id,
                  programStageId: stage.id,
                  outputType: OUTPUT_TYPE_EVENT,
              })
            : null
    const eventDateId =
        program?.id && stage?.id
            ? formatDimensionId({
                  dimensionId: DIMENSION_ID_EVENT_DATE,
                  programId: program.id,
                  programStageId: stage.id,
                  outputType: OUTPUT_TYPE_EVENT,
              })
            : null
    const scheduledDateId =
        program?.id && stage?.id
            ? formatDimensionId({
                  dimensionId: DIMENSION_ID_SCHEDULED_DATE,
                  programId: program.id,
                  programStageId: stage.id,
                  outputType: OUTPUT_TYPE_EVENT,
              })
            : null
    const eventStatusId =
        program?.id && stage?.id
            ? formatDimensionId({
                  dimensionId: DIMENSION_ID_EVENT_STATUS,
                  programId: program.id,
                  programStageId: stage.id,
                  outputType: OUTPUT_TYPE_EVENT,
              })
            : null

    // Get from metadata store - will be populated by useEffect below
    const stageOrgUnit = useSelector((state) =>
        sGetMetadataById(state, stageOrgUnitId)
    )
    const eventDate = useSelector((state) =>
        sGetMetadataById(state, eventDateId)
    )
    const scheduledDate = useSelector((state) =>
        sGetMetadataById(state, scheduledDateId)
    )
    const eventStatus = useSelector((state) =>
        sGetMetadataById(state, eventStatusId)
    )

    // Create and store mock stage dimensions in Redux metadata once
    // This ensures they're available throughout the app without causing re-renders
    useEffect(() => {
        // Only run if we have stage info and IDs
        if (!stage?.id || !stage?.name) {
            return
        }

        const mockMetadata = {}

        // Add stage to metadata if not already there (needed for suffix generation)
        if (stage.id && stage.name) {
            mockMetadata[stage.id] = { id: stage.id, name: stage.name }
        }

        // Create mock stage-specific dimensions only if they don't exist in metadata
        if (stageOrgUnitId && !stageOrgUnit) {
            mockMetadata[stageOrgUnitId] = {
                id: stageOrgUnitId,
                name: 'Organisation unit',
                dimensionType: 'ORGANISATION_UNIT',
                programStage: { id: stage.id, name: stage.name },
            }
        }
        if (eventDateId && !eventDate) {
            mockMetadata[eventDateId] = {
                id: eventDateId,
                name: stage.displayExecutionDateLabel || 'Event date',
                dimensionType: 'PERIOD',
                programStage: { id: stage.id, name: stage.name },
            }
        }
        if (scheduledDateId && !scheduledDate && !stage.hideDueDate) {
            mockMetadata[scheduledDateId] = {
                id: scheduledDateId,
                name: stage.displayDueDateLabel || 'Scheduled date',
                dimensionType: 'PERIOD',
                programStage: { id: stage.id, name: stage.name },
            }
        }
        if (eventStatusId && !eventStatus) {
            mockMetadata[eventStatusId] = {
                id: eventStatusId,
                name: 'Event status',
                dimensionType: 'STATUS',
                programStage: { id: stage.id, name: stage.name },
            }
        }

        if (Object.keys(mockMetadata).length > 0) {
            dispatch(acAddMetadata(mockMetadata))
        }
    }, [
        dispatch,
        stage?.id,
        stage?.name,
        stage?.displayExecutionDateLabel,
        stage?.displayDueDateLabel,
        stage?.hideDueDate,
        stageOrgUnitId,
        eventDateId,
        scheduledDateId,
        eventStatusId,
        stageOrgUnit,
        eventDate,
        scheduledDate,
        eventStatus,
    ])

    // Get stage-specific data elements
    const {
        dimensions: dataElementDimensions,
        loading,
        fetching,
        error,
        hasMore,
        loadMore,
    } = useProgramDataDimensions({
        inputType: OUTPUT_TYPE_EVENT,
        program,
        stageId: stage?.id,
        searchTerm: debouncedSearchTerm,
        dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
    })

    // Build stage-specific dimensions list (org unit, periods, status)
    const stageDimensions = useMemo(() => {
        const dims = []
        if (stageOrgUnit) dims.push(stageOrgUnit)
        if (eventDate) dims.push(eventDate)
        if (scheduledDate && !stage.hideDueDate) {
            dims.push(scheduledDate)
        }
        if (eventStatus) dims.push(eventStatus)
        return dims
    }, [stageOrgUnit, eventDate, scheduledDate, eventStatus, stage])

    // Filter dimensions based on search term
    const filteredStageDimensions = useMemo(() => {
        if (!searchTerm) return stageDimensions
        return stageDimensions.filter((dimension) =>
            dimension.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [stageDimensions, searchTerm])

    // Add draggableId to dimensions
    const draggableStageDimensions = filteredStageDimensions.map(
        (dimension) => ({
            draggableId: `stage-${stage?.id}-${dimension.id}`,
            ...dimension,
        })
    )

    // Don't render if program or stage is not available
    if (!program || !program.id || !stage || !stage.id) {
        return null
    }

    return (
        <>
            {/* Stage org unit and periods */}
            {filteredStageDimensions.length > 0 && (
                <DimensionsList
                    dimensions={draggableStageDimensions}
                    loading={false}
                    fetching={false}
                    error={null}
                    hasMore={false}
                    onLoadMore={() => {}}
                    dataTest={`stage-${stage.id}-dimensions-list`}
                />
            )}

            {/* Stage-specific data elements */}
            {dataElementDimensions && dataElementDimensions.length > 0 && (
                <ProgramDataDimensionsList
                    dimensions={dataElementDimensions}
                    loading={loading}
                    fetching={fetching}
                    error={error}
                    hasMore={hasMore}
                    onLoadMore={loadMore}
                    program={program}
                    searchTerm={debouncedSearchTerm}
                />
            )}
        </>
    )
}

StageDimensionsPanel.propTypes = {
    program: PropTypes.object.isRequired,
    stage: PropTypes.object.isRequired,
    searchTerm: PropTypes.string,
}

export { StageDimensionsPanel }
