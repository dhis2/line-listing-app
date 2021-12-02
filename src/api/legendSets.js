const legendSetsQuery = {
    legendSets: {
        resource: 'legendSets',
        params: {
            fields: [
                'id',
                'displayName~rename(name)',
                'legends[id,displayName~rename(name),startValue,endValue,color]',
            ],
            paging: 'false',
        },
    },
}

export const apiFetchLegendSets = async dataEngine => {
    const legendSetsData = await dataEngine.query(legendSetsQuery)

    return legendSetsData.legendSets.legendSets
}
