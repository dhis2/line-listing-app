import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import {
    DIMENSION_ID_ORGUNIT,
    DIMENSION_TYPE_DATA_ELEMENT,
} from '@dhis2/analytics'
import {
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_EVENT_STATUS,
} from '../../../modules/dimensionConstants.js'
import { formatDimensionId } from '../../../modules/dimensionId.js'
import { OUTPUT_TYPE_EVENT } from '../../../modules/visualization.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { acAddMetadata } from '../../../actions/metadata.js'
import { DimensionsList } from '../DimensionsList/index.js'
import { ProgramDataDimensionsList } from '../ProgramDimensionsPanel/ProgramDataDimensionsList.jsx'
import { useProgramDataDimensions } from '../ProgramDimensionsPanel/useProgramDataDimensions.js'
import { useDebounce } from '../../../modules/utils.js'

/**
 * EventDimensionsPanel displays all event dimensions for programs without registration:
 * - Event organisation unit
 * - Event date (period)
 * - Event status
 * - Event data elements
 */
const EventDimensionsPanel = ({ program, searchTerm }) => {
    const dispatch = useDispatch()
    const debouncedSearchTerm = useDebounce(searchTerm || '')

    // Get event org unit dimension
    const eventOrgUnitId = program?.id
        ? formatDimensionId({
              dimensionId: DIMENSION_ID_ORGUNIT,
              programId: program.id,
              outputType: OUTPUT_TYPE_EVENT,
          })
        : null

    const eventOrgUnit = useSelector((state) =>
        sGetMetadataById(state, eventOrgUnitId)
    )

    // Get event date dimension
    const eventDateId = program?.id
        ? formatDimensionId({
              dimensionId: DIMENSION_ID_EVENT_DATE,
              programId: program.id,
              outputType: OUTPUT_TYPE_EVENT,
          })
        : null

    const eventDate = useSelector((state) =>
        sGetMetadataById(state, eventDateId)
    )

    // Get event status dimension
    const eventStatusId = program?.id
        ? formatDimensionId({
              dimensionId: DIMENSION_ID_EVENT_STATUS,
              programId: program.id,
              outputType: OUTPUT_TYPE_EVENT,
          })
        : null

    const eventStatus = useSelector((state) =>
        sGetMetadataById(state, eventStatusId)
    )

    // Get data elements for the program (event programs have a single stage)
    const {
        dimensions: dataElementDimensions,
        loading: dataElementsLoading,
        fetching: dataElementsFetching,
        error: dataElementsError,
        hasMore: dataElementsHasMore,
        loadMore: dataElementsLoadMore,
    } = useProgramDataDimensions({
        inputType: OUTPUT_TYPE_EVENT,
        program,
        searchTerm: debouncedSearchTerm,
        dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
    })

    // Create mock metadata for event dimensions if they don't exist
    useEffect(() => {
        if (!program?.id) return

        const mockMetadata = {}

        // Event org unit
        if (eventOrgUnitId && !eventOrgUnit) {
            mockMetadata[eventOrgUnitId] = {
                id: eventOrgUnitId,
                name: 'Organisation unit',
                dimensionType: 'ORGANISATION_UNIT',
            }
        }

        // Event date
        if (eventDateId && !eventDate) {
            // Get label from program stage if available
            const stage = program.programStages?.[0]
            mockMetadata[eventDateId] = {
                id: eventDateId,
                name:
                    stage?.displayExecutionDateLabel ||
                    stage?.executionDateLabel ||
                    'Event date',
                dimensionType: 'PERIOD',
            }
        }

        // Event status
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
        program,
        eventOrgUnitId,
        eventOrgUnit,
        eventDateId,
        eventDate,
        eventStatusId,
        eventStatus,
    ])

    // Build base event dimensions (org unit, date, status)
    const baseEventDimensions = useMemo(() => {
        const dims = []

        if (eventOrgUnit) {
            dims.push(eventOrgUnit)
        }

        if (eventDate) {
            dims.push(eventDate)
        }

        if (eventStatus) {
            dims.push(eventStatus)
        }

        return dims
    }, [eventOrgUnit, eventDate, eventStatus])

    // Filter base dimensions based on search term
    const filteredBaseDimensions = useMemo(() => {
        if (!debouncedSearchTerm) return baseEventDimensions
        const lowerSearch = debouncedSearchTerm.toLowerCase()
        return baseEventDimensions.filter((dimension) =>
            dimension.name.toLowerCase().includes(lowerSearch)
        )
    }, [baseEventDimensions, debouncedSearchTerm])

    // Add draggableId to base dimensions
    const draggableBaseDimensions = filteredBaseDimensions.map((dimension) => ({
        draggableId: `event-${dimension.id}`,
        ...dimension,
    }))

    // Don't render if program is not available
    if (!program || !program.id) {
        return null
    }

    return (
        <>
            {/* Base event dimensions (org unit, date, status) */}
            {draggableBaseDimensions.length > 0 && (
                <DimensionsList
                    dimensions={draggableBaseDimensions}
                    loading={false}
                    fetching={false}
                    error={null}
                    hasMore={false}
                    onLoadMore={() => {}}
                    dataTest="event-base-dimensions-list"
                />
            )}

            {/* Event data elements */}
            {dataElementDimensions && dataElementDimensions.length > 0 && (
                <ProgramDataDimensionsList
                    dimensions={dataElementDimensions}
                    loading={dataElementsLoading}
                    fetching={dataElementsFetching}
                    error={dataElementsError}
                    hasMore={dataElementsHasMore}
                    onLoadMore={dataElementsLoadMore}
                    program={program}
                    searchTerm={debouncedSearchTerm}
                    dataTest="event-data-elements-list"
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

