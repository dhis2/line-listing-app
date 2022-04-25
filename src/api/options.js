const optionsQuery = {
    resource: 'options',
    params: ({ optionSetId, searchTerm, page }) => {
        const filters = [`optionSet.id:eq:${optionSetId}`]

        if (searchTerm) {
            filters.push(`displayName:ilike:${searchTerm}`)
        }

        return {
            fields: 'code,name,id',
            filter: filters,
            paging: true,
            page,
        }
    },
}

export const apiFetchOptions = async ({
    dataEngine,
    searchTerm,
    optionSetId,
    page,
}) => {
    const optionsData = await dataEngine.query(
        { options: optionsQuery },
        {
            variables: {
                searchTerm,
                optionSetId,
                page,
            },
            onError: (error) => console.log('Error: ', error),
        }
    )

    const response = optionsData.options

    return {
        options: response.options,
        nextPage: response.pager.nextPage ? response.pager.page + 1 : null,
    }
}
