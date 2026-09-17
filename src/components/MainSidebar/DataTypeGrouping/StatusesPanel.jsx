import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
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
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../../../modules/programTypes.js'

/**
 * StatusesPanel displays all status dimensions
 * - Program status (enrollment)
 * - Event statuses (from all stages)
 */
const StatusesPanel = ({ program, searchTerm }) => {
    const dispatch = useDispatch()

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

    // Build status dimensions list
    const statusDimensions = useMemo(() => {
        const dims = []

        // Add program status if it's a program with registration
        if (isProgramWithRegistration) {
            if (programStatus) {
                dims.push({
                    ...programStatus,
                    stageName: i18n.t('Enrollment'),
                })
            }

            // Add event statuses from stages (already have stageName from programStage)
            stageEventStatusesMetadata.forEach((stageStatus) => {
                if (stageStatus && stageStatus.id) {
                    dims.push({
                        ...stageStatus,
                        stageName:
                            stageStatus.programStage?.name ||
                            stageStatus.stageName,
                    })
                }
            })
        } else if (programEventStatus) {
            // For programs without registration, just show event status
            dims.push(programEventStatus)
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
        const lowerSearch = searchTerm.toLowerCase()
        return statusDimensions.filter((dimension) => {
            const nameMatch = dimension.name.toLowerCase().includes(lowerSearch)
            const stageMatch = dimension.stageName
                ?.toLowerCase()
                .includes(lowerSearch)
            return nameMatch || stageMatch
        })
    }, [statusDimensions, searchTerm])

    // Add draggableId to status dimensions
    const draggableStatusDimensions = filteredStatusDimensions.map(
        (dimension) => ({
            draggableId: `status-${dimension.id}`,
            ...dimension,
        })
    )

    // Don't render if program is not available
    if (!program || !program.id) {
        return null
    }

    // Don't render if no dimensions after filtering
    if (draggableStatusDimensions.length === 0) {
        return null
    }

    return (
        <DimensionsList
            dimensions={draggableStatusDimensions}
            loading={false}
            fetching={false}
            error={null}
            hasMore={false}
            onLoadMore={() => {}}
            dataTest="statuses-dimensions-list"
        />
    )
}

StatusesPanel.propTypes = {
    program: PropTypes.object.isRequired,
    searchTerm: PropTypes.string,
}

export { StatusesPanel }
