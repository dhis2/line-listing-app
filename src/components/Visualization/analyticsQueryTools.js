import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
} from '@dhis2/analytics'
import {
    DIMENSION_ID_PROGRAM_STATUS,
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_CREATED,
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_LAST_UPDATED_BY,
    DIMENSION_IDS_TIME,
} from '../../modules/dimensionConstants.js'
import { getRequestOptions } from '../../modules/getRequestOptions.js'
import { formatDimensionId } from '../../modules/utils.js'
import { getHeadersMap } from '../../modules/visualization.js'

const excludedDimensions = [
    DIMENSION_ID_CREATED,
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_LAST_UPDATED_BY,
]

const isTimeDimension = (dimensionId) => DIMENSION_IDS_TIME.has(dimensionId)

const adaptDimensions = (dimensions, parameters) => {
    const adaptedDimensions = []
    dimensions.forEach((dimensionObj) => {
        const dimensionId = dimensionObj.dimension

        if (
            isTimeDimension(dimensionId) ||
            dimensionId === DIMENSION_ID_EVENT_STATUS ||
            dimensionId === DIMENSION_ID_PROGRAM_STATUS ||
            dimensionId === DIMENSION_ID_CREATED
        ) {
            if (dimensionObj.items?.length) {
                const items = dimensionObj.items?.map((item) => item.id)
                if (
                    (dimensionId === DIMENSION_ID_PROGRAM_STATUS ||
                        isTimeDimension(dimensionId)) &&
                    Array.isArray(parameters[dimensionId])
                ) {
                    parameters[dimensionId].push(...items)
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
        parameters
    )
    const adaptedRows = adaptDimensions(visualization[AXIS_ID_ROWS], parameters)
    const adaptedFilters = adaptDimensions(
        visualization[AXIS_ID_FILTERS],
        parameters
    )

    const dimensionHeadersMap = getHeadersMap(visualization)

    const headers = [
        ...visualization[AXIS_ID_COLUMNS],
        ...visualization[AXIS_ID_ROWS],
    ].map(({ dimension, program, programStage, repetition }) => {
        const programStageId = programStage?.id

        if (repetition?.indexes?.length) {
            return repetition.indexes.map((index) =>
                formatDimensionId({
                    programId: program?.id,
                    programStageId: `${programStageId}[${index}]`,
                    dimensionId: dimensionHeadersMap[dimension] || dimension,
                    outputType,
                })
            )
        } else {
            return formatDimensionId({
                programId: program?.id,
                programStageId,
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
