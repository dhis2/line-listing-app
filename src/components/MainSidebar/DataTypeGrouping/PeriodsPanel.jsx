import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
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
 * PeriodsPanel displays all period/date dimensions
 * from enrollment and stages grouped together
 */
const PeriodsPanel = ({ program, searchTerm }) => {
    const dispatch = useDispatch()

    const isProgramWithRegistration =
        program?.programType === PROGRAM_TYPE_WITH_REGISTRATION &&
        program?.programStages &&
        program.programStages.length > 0

    // Get enrollment date dimensions
    const enrollmentDateId = program?.id
        ? formatDimensionId({
              dimensionId: DIMENSION_ID_ENROLLMENT_DATE,
              programId: program.id,
              outputType: OUTPUT_TYPE_ENROLLMENT,
          })
        : null
    const incidentDateId = program?.id
        ? formatDimensionId({
              dimensionId: DIMENSION_ID_INCIDENT_DATE,
              programId: program.id,
              outputType: OUTPUT_TYPE_ENROLLMENT,
          })
        : null

    const enrollmentDate = useSelector((state) =>
        sGetMetadataById(state, enrollmentDateId)
    )
    const incidentDate = useSelector((state) =>
        sGetMetadataById(state, incidentDateId)
    )

    // Get stage date dimensions
    const stageDates = useMemo(() => {
        if (!isProgramWithRegistration) return []

        return program.programStages.flatMap((stage) => {
            const eventDateId = formatDimensionId({
                dimensionId: DIMENSION_ID_EVENT_DATE,
                programId: program.id,
                programStageId: stage.id,
                outputType: OUTPUT_TYPE_EVENT,
            })
            const scheduledDateId = formatDimensionId({
                dimensionId: DIMENSION_ID_SCHEDULED_DATE,
                programId: program.id,
                programStageId: stage.id,
                outputType: OUTPUT_TYPE_EVENT,
            })

            const dates = [
                {
                    id: eventDateId,
                    stageId: stage.id,
                    stageName: stage.name,
                    type: 'eventDate',
                    displayExecutionDateLabel: stage.displayExecutionDateLabel,
                    executionDateLabel: stage.executionDateLabel,
                },
            ]

            if (!stage.hideDueDate) {
                dates.push({
                    id: scheduledDateId,
                    stageId: stage.id,
                    stageName: stage.name,
                    type: 'scheduledDate',
                    displayDueDateLabel: stage.displayDueDateLabel,
                    dueDateLabel: stage.dueDateLabel,
                    hideDueDate: stage.hideDueDate,
                })
            }

            return dates
        })
    }, [isProgramWithRegistration, program])

    // Get stage dates from metadata
    const stageDatesMetadata = useSelector((state) =>
        stageDates.map((stageDate) => ({
            metadata: sGetMetadataById(state, stageDate.id),
            ...stageDate,
        }))
    )

    // Create and store mock stage date dimensions
    useEffect(() => {
        if (!isProgramWithRegistration) return

        const mockMetadata = {}

        program.programStages.forEach((stage) => {
            const eventDateId = formatDimensionId({
                dimensionId: DIMENSION_ID_EVENT_DATE,
                programId: program.id,
                programStageId: stage.id,
                outputType: OUTPUT_TYPE_EVENT,
            })
            const scheduledDateId = formatDimensionId({
                dimensionId: DIMENSION_ID_SCHEDULED_DATE,
                programId: program.id,
                programStageId: stage.id,
                outputType: OUTPUT_TYPE_EVENT,
            })

            // Add stage to metadata
            mockMetadata[stage.id] = { id: stage.id, name: stage.name }

            // Create mock event date dimension
            mockMetadata[eventDateId] = {
                id: eventDateId,
                name:
                    stage.displayExecutionDateLabel ||
                    stage.executionDateLabel ||
                    'Event date',
                dimensionType: 'PERIOD',
                programStage: { id: stage.id, name: stage.name },
            }

            // Create mock scheduled date dimension
            if (!stage.hideDueDate) {
                mockMetadata[scheduledDateId] = {
                    id: scheduledDateId,
                    name:
                        stage.displayDueDateLabel ||
                        stage.dueDateLabel ||
                        'Scheduled date',
                    dimensionType: 'PERIOD',
                    programStage: { id: stage.id, name: stage.name },
                }
            }
        })

        if (Object.keys(mockMetadata).length > 0) {
            dispatch(acAddMetadata(mockMetadata))
        }
    }, [dispatch, isProgramWithRegistration, program])

    // For programs without registration, get the single event date
    const programEventDateId =
        !isProgramWithRegistration && program?.id
            ? formatDimensionId({
                  dimensionId: DIMENSION_ID_EVENT_DATE,
                  programId: program.id,
                  outputType: OUTPUT_TYPE_EVENT,
              })
            : null

    const programEventDate = useSelector((state) =>
        sGetMetadataById(state, programEventDateId)
    )

    // Build all period dimensions
    const periodDimensions = useMemo(() => {
        const dims = []

        // Add enrollment dates if it's a program with registration
        if (isProgramWithRegistration) {
            if (enrollmentDate) {
                dims.push({
                    ...enrollmentDate,
                    stageName: i18n.t('Enrollment'),
                })
            }
            if (incidentDate && program.displayIncidentDate !== false) {
                dims.push({
                    ...incidentDate,
                    stageName: i18n.t('Enrollment'),
                })
            }

            // Add stage dates (already have stageName from programStage)
            stageDatesMetadata.forEach(({ metadata, stageName }) => {
                if (metadata && metadata.id) {
                    dims.push({
                        ...metadata,
                        stageName: metadata.programStage?.name || stageName,
                    })
                }
            })
        } else if (programEventDate) {
            // For programs without registration, just show event date
            dims.push(programEventDate)
        }

        return dims
    }, [
        isProgramWithRegistration,
        enrollmentDate,
        incidentDate,
        stageDatesMetadata,
        programEventDate,
        program,
    ])

    // Filter dimensions based on search term
    const filteredPeriodDimensions = useMemo(() => {
        if (!searchTerm) return periodDimensions
        const lowerSearch = searchTerm.toLowerCase()
        return periodDimensions.filter((dimension) => {
            const nameMatch = dimension.name.toLowerCase().includes(lowerSearch)
            const stageMatch = dimension.stageName
                ?.toLowerCase()
                .includes(lowerSearch)
            return nameMatch || stageMatch
        })
    }, [periodDimensions, searchTerm])

    // Add draggableId to dimensions
    const draggablePeriodDimensions = filteredPeriodDimensions.map(
        (dimension) => ({
            draggableId: `period-${dimension.id}`,
            ...dimension,
        })
    )

    // Don't render if program is not available
    if (!program || !program.id) {
        return null
    }

    // Don't render if no dimensions after filtering
    if (draggablePeriodDimensions.length === 0) {
        return null
    }

    return (
        <DimensionsList
            dimensions={draggablePeriodDimensions}
            loading={false}
            fetching={false}
            error={null}
            hasMore={false}
            onLoadMore={() => {}}
            dataTest="periods-dimensions-list"
        />
    )
}

PeriodsPanel.propTypes = {
    program: PropTypes.object.isRequired,
    searchTerm: PropTypes.string,
}

export { PeriodsPanel }
