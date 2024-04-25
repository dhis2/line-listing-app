import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'
import { DIMENSION_LIST_FIELDS } from '../DimensionsList/index.js'

const TRACKED_ENTITY_DIMENSIONS_RESOURCE =
    'analytics/trackedEntities/query/dimensions'

const TRACKED_ENTITY_DIMENSIONS_FILTER = 'dimensionType:eq:PROGRAM_ATTRIBUTE'

const query = {
    dimensions: {
        resource: TRACKED_ENTITY_DIMENSIONS_RESOURCE,
        params: ({ page, searchTerm, nameProp, id, programId }) => {
            const filters = [TRACKED_ENTITY_DIMENSIONS_FILTER]

            if (searchTerm) {
                filters.push(`${nameProp}:ilike:${searchTerm}`)
            }

            return {
                pageSize: 50,
                page,
                fields: [...DIMENSION_LIST_FIELDS, `${nameProp}~rename(name)`],
                filter: filters,
                order: `${nameProp}:asc`,
                trackedEntityType: id,
                ...(programId ? { program: programId } : {}),
            }
        },
    },
}

const useTrackedEntityDimensions = ({
    visible,
    searchTerm,
    nameProp,
    id,
    programId,
}) => {
    const [isListEndVisible, setIsListEndVisible] = useState(false)
    const [dimensions, setDimensions] = useState(null)
    const { data, error, loading, fetching, refetch } = useDataQuery(query, {
        lazy: true,
    })

    useEffect(() => {
        // Delay initial fetch until component comes into view
        if (visible && !dimensions) {
            refetch({ page: 1, nameProp, id, programId })
        }
    }, [visible])

    useEffect(() => {
        // Reset when filter changes
        setDimensions(null)
        if (visible) {
            refetch({
                page: 1,
                searchTerm,
                nameProp,
                id,
                programId,
            })
        }
    }, [searchTerm, id, programId])

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
                    programId,
                })
            }
        }
    }, [isListEndVisible, nameProp])

    useEffect(() => {
        if (!fetching && data) {
            setDimensions((currDimensions) => [
                ...(currDimensions ?? []),
                ...data.dimensions.dimensions,
            ])
        }
    }, [data, fetching])

    return {
        loading: dimensions ? false : loading,
        fetching,
        error,
        dimensions: dimensions ?? [],
        setIsListEndVisible,
    }
}

export { useTrackedEntityDimensions }
