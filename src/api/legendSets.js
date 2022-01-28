const TYPE_PA = 'PROGRAM_ATTRIBUTE'
const TYPE_DE = 'PROGRAM_DATA_ELEMENT'
const TYPE_PI = 'PROGRAM_INDICATOR'

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

const legendSetsQuery = {
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
        { legendSet: legendSetsQuery },
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
        case TYPE_DE:
            query = dataElementsQuery
            break
        case TYPE_PA:
            query = trackedEntityAttributesQuery
            break
        case TYPE_PI:
            query = programIndicatorsQuery
            break
        default:
            throw new Error(`${dimensionType} is not a valid dimension type`)
    }
    const response = await dataEngine.query(
        { legendSets: query },
        {
            variables: {
                id: dimensionId,
            },
            onError: (error) => console.log('Error: ', error),
        }
    )

    return response.legendSets.legendSets
}
