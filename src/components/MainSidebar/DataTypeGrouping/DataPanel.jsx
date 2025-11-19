import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import {
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
} from '@dhis2/analytics'
import {
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_PROGRAM_STATUS,
} from '../../../modules/dimensionConstants.js'
import { formatDimensionId } from '../../../modules/dimensionId.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
} from '../../../modules/visualization.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { acAddMetadata } from '../../../actions/metadata.js'
import { DimensionsList } from '../DimensionsList/index.js'
import { ProgramDataDimensionsList } from '../ProgramDimensionsPanel/ProgramDataDimensionsList.jsx'
import { useProgramDataDimensions } from '../ProgramDimensionsPanel/useProgramDataDimensions.js'
import { useDebounce } from '../../../modules/utils.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../../../modules/programTypes.js'

/**
 * DataPanel displays all data dimensions including:
 * - Program attributes (enrollment)
 * - Data elements (from all stages)
 * - Program indicators
 * - Status dimensions
 */
const DataPanel = ({ program, searchTerm }) => {
    const dispatch = useDispatch()
    const debouncedSearchTerm = useDebounce(searchTerm || '')

    const isProgramWithRegistration =
        program?.programType === PROGRAM_TYPE_WITH_REGISTRATION &&
        program?.programStages &&
        program.programStages.length > 0

    // Get program status dimension (enrollment)
    const programStatusId = program?.id
        ? formatDimensionId({
              dimensionId: DIMENSION_ID_PROGRAM_STATUS,
              programId: program.id,
              outputType: OUTPUT_TYPE_ENROLLMENT,
          })
        : null

    const programStatus = useSelector((state) =>
        sGetMetadataById(state, programStatusId)
    )

    // Get program attributes (enrollment data)
    const {
        dimensions: attributeDimensions,
        loading: attributesLoading,
        fetching: attributesFetching,
        error: attributesError,
        hasMore: attributesHasMore,
        loadMore: attributesLoadMore,
    } = useProgramDataDimensions({
        inputType: OUTPUT_TYPE_ENROLLMENT,
        program,
        searchTerm: debouncedSearchTerm,
        dimensionType: DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    })

    // Get data elements from all stages combined
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
        // Don't specify stageId to get all data elements from all stages
    })

    // Get program indicators
    const {
        dimensions: programIndicators,
        loading: indicatorsLoading,
        fetching: indicatorsFetching,
        error: indicatorsError,
        hasMore: indicatorsHasMore,
        loadMore: indicatorsLoadMore,
    } = useProgramDataDimensions({
        inputType: OUTPUT_TYPE_ENROLLMENT,
        program,
        searchTerm: debouncedSearchTerm,
        dimensionType: DIMENSION_TYPE_PROGRAM_INDICATOR,
    })

    // Get event status dimensions for all stages
    const stageEventStatuses = useMemo(() => {
        if (!isProgramWithRegistration) return []

        return program.programStages.map((stage) => {
            const eventStatusId = formatDimensionId({
                dimensionId: DIMENSION_ID_EVENT_STATUS,
                programId: program.id,
                programStageId: stage.id,
                outputType: OUTPUT_TYPE_EVENT,
            })
            return {
                id: eventStatusId,
                stageId: stage.id,
                stageName: stage.name,
            }
        })
    }, [isProgramWithRegistration, program])

    // Get event statuses from metadata
    const stageEventStatusesMetadata = useSelector((state) =>
        stageEventStatuses.map((stageStatus) => ({
            ...sGetMetadataById(state, stageStatus.id),
            stageId: stageStatus.stageId,
            stageName: stageStatus.stageName,
        }))
    )

    // Create and store mock event status dimensions
    useEffect(() => {
        if (!isProgramWithRegistration) return

        const mockMetadata = {}

        program.programStages.forEach((stage) => {
            const eventStatusId = formatDimensionId({
                dimensionId: DIMENSION_ID_EVENT_STATUS,
                programId: program.id,
                programStageId: stage.id,
                outputType: OUTPUT_TYPE_EVENT,
            })

            // Add stage to metadata
            mockMetadata[stage.id] = { id: stage.id, name: stage.name }

            // Create mock event status dimension
            mockMetadata[eventStatusId] = {
                id: eventStatusId,
                name: 'Event status',
                dimensionType: 'STATUS',
                programStage: { id: stage.id, name: stage.name },
            }
        })

        if (Object.keys(mockMetadata).length > 0) {
            dispatch(acAddMetadata(mockMetadata))
        }
    }, [dispatch, isProgramWithRegistration, program])

    // For programs without registration, get the single event status
    const programEventStatusId =
        !isProgramWithRegistration && program?.id
            ? formatDimensionId({
                  dimensionId: DIMENSION_ID_EVENT_STATUS,
                  programId: program.id,
                  outputType: OUTPUT_TYPE_EVENT,
              })
            : null

    const programEventStatus = useSelector((state) =>
        sGetMetadataById(state, programEventStatusId)
    )

    // Build status dimensions list
    const statusDimensions = useMemo(() => {
        const dims = []

        // Add program status if it's a program with registration
        if (isProgramWithRegistration) {
            if (programStatus) {
                dims.push({
                    ...programStatus,
                    displayName: `${programStatus.name} (Enrollment)`,
                })
            }

            // Add event statuses from stages
            stageEventStatusesMetadata.forEach((stageStatus) => {
                if (stageStatus && stageStatus.id) {
                    dims.push({
                        ...stageStatus,
                        displayName: `${stageStatus.name} (${stageStatus.stageName})`,
                    })
                }
            })
        } else if (programEventStatus) {
            // For programs without registration, just show event status
            dims.push({
                ...programEventStatus,
                displayName: programEventStatus.name,
            })
        }

        return dims
    }, [
        isProgramWithRegistration,
        programStatus,
        stageEventStatusesMetadata,
        programEventStatus,
    ])

    // Filter status dimensions based on search term
    const filteredStatusDimensions = useMemo(() => {
        if (!searchTerm) return statusDimensions
        return statusDimensions.filter((dimension) =>
            dimension.displayName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
    }, [statusDimensions, searchTerm])

    // Add draggableId to status dimensions
    const draggableStatusDimensions = filteredStatusDimensions.map(
        (dimension) => ({
            draggableId: `status-${dimension.id}`,
            ...dimension,
            name: dimension.displayName, // Use displayName for rendering
        })
    )

    // Don't render if program is not available
    if (!program || !program.id) {
        return null
    }

    // Combine loading states
    const isLoading =
        attributesLoading || dataElementsLoading || indicatorsLoading
    const isFetching =
        attributesFetching || dataElementsFetching || indicatorsFetching

    return (
        <>
            {/* Status dimensions */}
            {draggableStatusDimensions.length > 0 && (
                <DimensionsList
                    dimensions={draggableStatusDimensions}
                    loading={false}
                    fetching={false}
                    error={null}
                    hasMore={false}
                    onLoadMore={() => {}}
                    dataTest="status-dimensions-list"
                />
            )}

            {/* Program attributes (enrollment data) */}
            {isProgramWithRegistration &&
                attributeDimensions &&
                attributeDimensions.length > 0 && (
                    <ProgramDataDimensionsList
                        dimensions={attributeDimensions}
                        loading={attributesLoading}
                        fetching={attributesFetching}
                        error={attributesError}
                        hasMore={attributesHasMore}
                        onLoadMore={attributesLoadMore}
                        program={program}
                        searchTerm={debouncedSearchTerm}
                        dataTest="enrollment-attributes-list"
                    />
                )}

            {/* Data elements (from all stages) */}
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
                    dataTest="data-elements-list"
                />
            )}

            {/* Program indicators */}
            {isProgramWithRegistration &&
                programIndicators &&
                programIndicators.length > 0 && (
                    <ProgramDataDimensionsList
                        dimensions={programIndicators}
                        loading={indicatorsLoading}
                        fetching={indicatorsFetching}
                        error={indicatorsError}
                        hasMore={indicatorsHasMore}
                        onLoadMore={indicatorsLoadMore}
                        program={program}
                        searchTerm={debouncedSearchTerm}
                        dataTest="program-indicators-list"
                    />
                )}
        </>
    )
}

DataPanel.propTypes = {
    program: PropTypes.object.isRequired,
    searchTerm: PropTypes.string,
}

export { DataPanel }
