import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import {
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_EVENT_STATUS,
} from '../../../modules/dimensionConstants.js'
import { formatDimensionId } from '../../../modules/dimensionId.js'
import { CARD_TYPE_EVENT } from '../../../modules/paginationConfig.js'
import { OUTPUT_TYPE_EVENT } from '../../../modules/visualization.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { acAddMetadata } from '../../../actions/metadata.js'
import { usePaginationConfig } from '../../PaginationConfigContext.jsx'
import { DimensionsList } from '../DimensionsList/index.js'
import { ProgramDataDimensionsList } from './ProgramDataDimensionsList.jsx'
import { useProgramDataDimensions } from './useProgramDataDimensions.js'
import { useDebounce } from '../../../modules/utils.js'

/**
 * EventDimensionsPanel displays all dimensions for a program without registration
 * (event program) in a single card. This includes:
 * - Organisation unit
 * - Event date (and scheduled date if applicable)
 * - Event status
 * - All data elements from the event stage
 */
const EventDimensionsPanel = ({ program, searchTerm }) => {
    const dispatch = useDispatch()
    const debouncedSearchTerm = useDebounce(searchTerm || '')
    const { getPageSize } = usePaginationConfig()
    const pageSize = getPageSize(CARD_TYPE_EVENT)

    // Get the first (and usually only) stage from the program
    const stage = program?.programStages?.[0]

    // Build dimension IDs for org unit, event date, scheduled date, and event status
    const orgUnitId =
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

    // Get from metadata store
    const orgUnit = useSelector((state) => sGetMetadataById(state, orgUnitId))
    const eventDate = useSelector((state) =>
        sGetMetadataById(state, eventDateId)
    )
    const scheduledDate = useSelector((state) =>
        sGetMetadataById(state, scheduledDateId)
    )
    const eventStatus = useSelector((state) =>
        sGetMetadataById(state, eventStatusId)
    )

    // Create and store mock dimensions in Redux metadata
    useEffect(() => {
        if (!stage?.id || !stage?.name) {
            return
        }

        const mockMetadata = {}

        // Add stage to metadata
        if (stage.id && stage.name) {
            mockMetadata[stage.id] = { id: stage.id, name: stage.name }
        }

        // Create mock dimensions if they don't exist
        if (orgUnitId && !orgUnit) {
            mockMetadata[orgUnitId] = {
                id: orgUnitId,
                name: 'Organisation unit',
                dimensionType: 'ORGANISATION_UNIT',
            }
        }
        if (eventDateId && !eventDate) {
            mockMetadata[eventDateId] = {
                id: eventDateId,
                name:
                    stage.displayExecutionDateLabel ||
                    stage.executionDateLabel ||
                    'Event date',
                dimensionType: 'PERIOD',
            }
        }
        if (scheduledDateId && !scheduledDate && !stage.hideDueDate) {
            mockMetadata[scheduledDateId] = {
                id: scheduledDateId,
                name:
                    stage.displayDueDateLabel ||
                    stage.dueDateLabel ||
                    'Scheduled date',
                dimensionType: 'PERIOD',
            }
        }
        if (eventStatusId && !eventStatus) {
            mockMetadata[eventStatusId] = {
                id: eventStatusId,
                name: 'Event status',
                dimensionType: 'STATUS',
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
        stage?.executionDateLabel,
        stage?.displayDueDateLabel,
        stage?.dueDateLabel,
        stage?.hideDueDate,
        orgUnitId,
        eventDateId,
        scheduledDateId,
        eventStatusId,
        orgUnit,
        eventDate,
        scheduledDate,
        eventStatus,
    ])

    // Get data elements for the stage
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
        pageSize,
    })

    // Build event dimensions list (org unit, periods, status)
    const eventDimensions = useMemo(() => {
        const dims = []
        if (orgUnit) {
            dims.push({
                ...orgUnit,
                name: i18n.t('Event org. unit'),
            })
        }
        if (eventDate) dims.push(eventDate)
        if (scheduledDate && !stage?.hideDueDate) {
            dims.push(scheduledDate)
        }
        if (eventStatus) dims.push(eventStatus)
        return dims
    }, [orgUnit, eventDate, scheduledDate, eventStatus, stage?.hideDueDate])

    // Filter dimensions based on search term
    const filteredEventDimensions = useMemo(() => {
        if (!searchTerm) return eventDimensions
        return eventDimensions.filter((dimension) =>
            dimension.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [eventDimensions, searchTerm])

    // Add draggableId to dimensions
    const draggableEventDimensions = filteredEventDimensions.map(
        (dimension) => ({
            draggableId: `event-${dimension.id}`,
            ...dimension,
        })
    )

    // Don't render if program is not available or has no stages
    if (!program || !program.id || !stage || !stage.id) {
        return null
    }

    const hasEventDimensions = draggableEventDimensions.length > 0
    const hasDataElementDimensions =
        dataElementDimensions && dataElementDimensions.length > 0

    return (
        <>
            {/* Event org unit, dates, and status */}
            {hasEventDimensions && (
                <DimensionsList
                    dimensions={draggableEventDimensions}
                    loading={false}
                    fetching={false}
                    error={null}
                    hasMore={false}
                    onLoadMore={() => {}}
                    dataTest="event-dimensions-list"
                />
            )}

            {/* Data elements */}
            {hasDataElementDimensions && (
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

EventDimensionsPanel.propTypes = {
    program: PropTypes.object.isRequired,
    searchTerm: PropTypes.string,
}

export { EventDimensionsPanel }

