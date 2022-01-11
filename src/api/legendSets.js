const TYPE_PA = 'PROGRAM_ATTRIBUTE'
//const TYPE_DE = 'PROGRAM_DATA_ELEMENT'

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

const legendSetsQuery = {
    resource: 'legendSets',
    id: ({ id }) => id,
    params: {
        fields: [
            'id',
            'displayName~rename(name)',
            'legends[id,displayName~rename(name),startValue,endValue,color]',
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
    const query =
        dimensionType === TYPE_PA
            ? trackedEntityAttributesQuery
            : dataElementsQuery
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
