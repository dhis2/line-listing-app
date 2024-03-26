import {
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
} from '@dhis2/analytics'
import { extractDimensionIdParts } from '../modules/dimensionId.js'

const dataElementsQuery = {
    resource: 'dataElements',
    id: ({ id }) => id,
    params: {
        fields: 'legendSets[id,name]',
    },
}

const trackedEntityAttributesQuery = {
    resource: 'trackedEntityAttributes',
    id: ({ id }) => id,
    params: {
        fields: 'legendSets[id,name]',
    },
}

const programIndicatorsQuery = {
    resource: 'programIndicators',
    id: ({ id }) => id,
    params: {
        fields: 'legendSets[id,name]',
    },
}

const legendSetQuery = {
    resource: 'legendSets',
    id: ({ id }) => id,
    params: {
        fields: [
            'id',
            'displayName~rename(name)',
            'legends[id,displayName~rename(name),startValue,endValue]',
        ],
        paging: 'false',
    },
}

export const apiFetchLegendSetById = async ({ dataEngine, id }) => {
    const response = await dataEngine.query(
        { legendSet: legendSetQuery },
        {
            variables: {
                id,
            },
            onError: (error) => console.log('Error: ', error),
        }
    )

    return response.legendSet
}

export const apiFetchLegendSetsByDimension = async ({
    dataEngine,
    dimensionId,
    dimensionType,
}) => {
    let query
    switch (dimensionType) {
        case DIMENSION_TYPE_DATA_ELEMENT:
            query = dataElementsQuery
            break
        case DIMENSION_TYPE_PROGRAM_ATTRIBUTE:
            query = trackedEntityAttributesQuery
            break
        case DIMENSION_TYPE_PROGRAM_INDICATOR:
            query = programIndicatorsQuery
            break
        default:
            throw new Error(`${dimensionType} is not a valid dimension type`)
    }

    const { dimensionId: id } = extractDimensionIdParts(dimensionId)

    const response = await dataEngine.query(
        { legendSets: query },
        {
            variables: {
                id,
            },
            onError: (error) => console.log('Error: ', error),
        }
    )

    return response.legendSets.legendSets
}
