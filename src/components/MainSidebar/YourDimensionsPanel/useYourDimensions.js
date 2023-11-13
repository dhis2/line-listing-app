import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'
import { DIMENSION_LIST_FIELDS } from '../DimensionsList/index.js'

const YOUR_DIMENSIONS_RESOURCE = 'dimensions'
// Fixed filter on org units for 2.38 ?
const YOUR_DIMENSIONS_FILTER = 'dimensionType:eq:ORGANISATION_UNIT_GROUP_SET'

const query = {
    dimensions: {
        resource: YOUR_DIMENSIONS_RESOURCE,
        params: ({ page, searchTerm, nameProp }) => {
            const filters = [YOUR_DIMENSIONS_FILTER]

            if (searchTerm) {
                filters.push(`${nameProp}:ilike:${searchTerm}`)
            }

            return {
                pageSize: 50,
                page,
                fields: [...DIMENSION_LIST_FIELDS, `${nameProp}~rename(name)`],
                filter: filters,
                order: `${nameProp}:asc`,
            }
        },
    },
}

const useYourDimensions = ({ visible, searchTerm, nameProp }) => {
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
            refetch({ page: 1, nameProp })
        }
    }, [visible, called])

    useEffect(() => {
        if (visible) {
            refetch({
                page: 1,
                searchTerm,
                nameProp,
            })
        }
        // Reset when filter changes
        setDimensions(null)
    }, [searchTerm, nameProp])

    useEffect(() => {
        if (data) {
            const { pager } = data.dimensions
            const isLastPage = pager.pageSize * pager.page >= pager.total

            if (isListEndVisible && !isLastPage && !fetching) {
                refetch({
                    page: pager.page + 1,
                    searchTerm,
                    nameProp,
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

export { useYourDimensions, YOUR_DIMENSIONS_FILTER, YOUR_DIMENSIONS_RESOURCE }
