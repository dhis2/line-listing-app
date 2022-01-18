const optionsQuery = {
    resource: 'options',
    params: ({ optionSetId, searchTerm, nameProp, page }) => {
        const filters = [`optionSet.id:eq:${optionSetId}`]

        if (searchTerm) {
            filters.push(`${nameProp}:ilike:${searchTerm}`)
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
    nameProp,
    optionSetId,
    page,
}) => {
    const optionsData = await dataEngine.query(
        { options: optionsQuery },
        {
            variables: {
                searchTerm,
                nameProp,
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
