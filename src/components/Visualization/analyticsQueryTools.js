import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'
import {
    DIMENSION_ID_PROGRAM_STATUS,
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_CREATED,
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_LAST_UPDATED_BY,
    DIMENSION_ID_REGISTRATION_OU,
    DIMENSION_ID_REGISTRATION_DATE,
    DIMENSION_IDS_TIME,
} from '../../modules/dimensionConstants.js'
import { formatDimensionId } from '../../modules/dimensionId.js'
import { getRequestOptions } from '../../modules/getRequestOptions.js'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
    getHeadersMap,
} from '../../modules/visualization.js'

const excludedDimensions = [
    DIMENSION_ID_CREATED,
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_LAST_UPDATED_BY,
]

const isTimeDimension = (dimensionId) => DIMENSION_IDS_TIME.has(dimensionId)

const adaptDimensions = (dimensions, parameters, outputType) => {
    const adaptedDimensions = []
    dimensions.forEach((dimensionObj) => {
        let dimensionId = dimensionObj.dimension

        // Translate mock registration dimension IDs to real backend IDs (prototype)
        if (dimensionId === DIMENSION_ID_REGISTRATION_OU) {
            dimensionId = DIMENSION_ID_ORGUNIT
            dimensionObj = { ...dimensionObj, dimension: dimensionId }
        } else if (dimensionId === DIMENSION_ID_REGISTRATION_DATE) {
            dimensionId = DIMENSION_ID_CREATED
            dimensionObj = { ...dimensionObj, dimension: dimensionId }
        }

        if (
            isTimeDimension(dimensionId) ||
            dimensionId === DIMENSION_ID_EVENT_STATUS ||
            dimensionId === DIMENSION_ID_PROGRAM_STATUS ||
            dimensionId === DIMENSION_ID_CREATED ||
            (dimensionId === DIMENSION_ID_ORGUNIT &&
                outputType === OUTPUT_TYPE_TRACKED_ENTITY)
        ) {
            if (dimensionObj.items?.length) {
                const items = dimensionObj.items?.map((item) => item.id)
                if (
                    (dimensionId === DIMENSION_ID_PROGRAM_STATUS ||
                        isTimeDimension(dimensionId)) &&
                    Array.isArray(parameters[dimensionId])
                ) {
                    parameters[dimensionId].push(...items)
                } else if (dimensionId === DIMENSION_ID_ORGUNIT) {
                    adaptedDimensions.push(dimensionObj)
                } else {
                    parameters[dimensionId] = items
                }
            }
        } else if (!excludedDimensions.includes(dimensionId)) {
            adaptedDimensions.push(dimensionObj)
        }
    })

    return adaptedDimensions
}

export const getAdaptedVisualization = (visualization) => {
    const outputType = visualization.outputType

    const parameters = getRequestOptions(visualization)

    const adaptedColumns = adaptDimensions(
        visualization[AXIS_ID_COLUMNS],
        parameters,
        outputType
    )
    const adaptedRows = adaptDimensions(
        visualization[AXIS_ID_ROWS],
        parameters,
        outputType
    )
    const adaptedFilters = adaptDimensions(
        visualization[AXIS_ID_FILTERS],
        parameters,
        outputType
    )

    const dimensionHeadersMap = getHeadersMap(visualization)

    const headers = [
        ...visualization[AXIS_ID_COLUMNS],
        ...visualization[AXIS_ID_ROWS],
    ].map(({ dimension, program, programStage, repetition }) => {
        const programStageId = programStage?.id
        const isTimeDimension = DIMENSION_IDS_TIME.has(dimension)

        // For EVENT and ENROLLMENT output types, time dimensions should not have stage/program prefix
        // For EVENT: the stage is specified separately via the 'stage' parameter
        // For ENROLLMENT: time dimensions are at the program/enrollment level, not stage level
        const shouldIncludeStageId =
            (outputType !== OUTPUT_TYPE_EVENT &&
                outputType !== OUTPUT_TYPE_ENROLLMENT) ||
            !isTimeDimension

        if (repetition?.indexes?.length) {
            return repetition.indexes.map((index) =>
                formatDimensionId({
                    programId: program?.id,
                    programStageId: shouldIncludeStageId
                        ? `${programStageId}[${index}]`
                        : undefined,
                    dimensionId: dimensionHeadersMap[dimension] || dimension,
                    outputType,
                })
            )
        } else {
            return formatDimensionId({
                programId: program?.id,
                programStageId: shouldIncludeStageId
                    ? programStageId
                    : undefined,
                dimensionId: dimensionHeadersMap[dimension] || dimension,
                outputType,
            })
        }
    })

    return {
        adaptedVisualization: {
            [AXIS_ID_COLUMNS]: adaptedColumns,
            [AXIS_ID_ROWS]: adaptedRows,
            [AXIS_ID_FILTERS]: adaptedFilters,
            outputType,
        },
        headers,
        parameters,
    }
}

const analyticsApiEndpointMap = {
    [OUTPUT_TYPE_ENROLLMENT]: 'enrollments',
    [OUTPUT_TYPE_EVENT]: 'events',
    [OUTPUT_TYPE_TRACKED_ENTITY]: 'trackedEntities',
}

export const getAnalyticsEndpoint = (outputType) =>
    analyticsApiEndpointMap[outputType]
