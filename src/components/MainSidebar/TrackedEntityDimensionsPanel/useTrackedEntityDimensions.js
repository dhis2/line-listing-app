import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'
import { DIMENSION_LIST_FIELDS } from '../DimensionsList/index.js'

const TRACKED_ENTITY_DIMENSIONS_RESOURCE =
    'analytics/trackedEntities/query/dimensions'

const query = {
    dimensions: {
        resource: TRACKED_ENTITY_DIMENSIONS_RESOURCE,
        params: ({ page, searchTerm, nameProp, id }) => {
            const filters = []

            if (searchTerm) {
                filters.push(`${nameProp}:ilike:${searchTerm}`)
            }

            return {
                pageSize: 50,
                page,
                fields: [...DIMENSION_LIST_FIELDS, `${nameProp}~rename(name)`],
                ...(filters.length ? { filter: filters } : {}),
                order: `${nameProp}:asc`,
                trackedEntityType: id,
            }
        },
    },
}

const useTrackedEntityDimensions = ({ visible, searchTerm, nameProp, id }) => {
    const [isListEndVisible, setIsListEndVisible] = useState(false)
    const [dimensions, setDimensions] = useState(null)
    const { data, error, loading, fetching, called, refetch } = useDataQuery(
        query,
        {
            lazy: true,
        }
    )

    useEffect(() => {
        // Delay initial fetch until component comes into view
        if (visible && !called) {
            refetch({ page: 1, nameProp, id })
        }
    }, [visible, called, id])

    useEffect(() => {
        if (visible) {
            refetch({
                page: 1,
                searchTerm,
                nameProp,
                id,
            })
        }
        // Reset when filter changes
        setDimensions(null)
    }, [searchTerm, nameProp, id, visible])

    useEffect(() => {
        if (data) {
            const { pager } = data.dimensions
            const isLastPage = pager.pageSize * pager.page >= pager.total

            if (isListEndVisible && !isLastPage && !fetching) {
                refetch({
                    page: pager.page + 1,
                    searchTerm,
                    nameProp,
                    id,
                })
            }
        }
    }, [isListEndVisible, nameProp])

    useEffect(() => {
        if (data) {
            setDimensions((currDimensions) => [
                ...(currDimensions ?? []),
                ...data.dimensions.dimensions,
            ])
        }
    }, [data])

    return {
        loading: dimensions ? false : loading,
        fetching,
        error,
        dimensions: dimensions ?? [],
        setIsListEndVisible,
    }
}

export { useTrackedEntityDimensions }
