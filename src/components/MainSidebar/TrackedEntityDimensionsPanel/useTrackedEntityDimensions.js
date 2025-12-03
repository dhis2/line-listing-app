import { DIMENSION_TYPE_PROGRAM_ATTRIBUTE } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect, useState, useCallback } from 'react'
import { DIMENSION_LIST_FIELDS } from '../DimensionsList/index.js'

// Analytics dimensions endpoint for program attributes
const TRACKED_ENTITY_DIMENSIONS_RESOURCE =
    'analytics/trackedEntities/query/dimensions'

// Query for program attributes (when a program is selected)
const programAttributesQuery = {
    dimensions: {
        resource: TRACKED_ENTITY_DIMENSIONS_RESOURCE,
        params: ({ page, searchTerm, nameProp, id, programId }) => {
            const filters = ['dimensionType:eq:PROGRAM_ATTRIBUTE']

            if (searchTerm) {
                filters.push(`${nameProp}:ilike:${searchTerm}`)
            }

            return {
                pageSize: 25,
                page,
                fields: [...DIMENSION_LIST_FIELDS, `${nameProp}~rename(name)`],
                filter: filters,
                order: `${nameProp}:asc`,
                trackedEntityType: id,
                program: programId,
            }
        },
    },
}

// Query for tracked entity type attributes (when no program is selected)
// Fetches attributes directly from the tracked entity type metadata
const trackedEntityTypeAttributesQuery = {
    trackedEntityType: {
        resource: 'trackedEntityTypes',
        id: ({ id }) => id,
        params: ({ nameProp }) => ({
            fields: [
                'id',
                `trackedEntityTypeAttributes[trackedEntityAttribute[id,${nameProp}~rename(name),valueType,optionSet]]`,
            ],
        }),
    },
}

const useTrackedEntityDimensions = ({
    visible,
    searchTerm,
    nameProp,
    id,
    programId,
}) => {
    const [dimensions, setDimensions] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState(null)

    // Query for program attributes
    const {
        data: programData,
        error: programError,
        loading: programLoading,
        fetching: programFetching,
        refetch: refetchProgram,
    } = useDataQuery(programAttributesQuery, {
        lazy: true,
    })

    // Query for tracked entity type attributes
    const {
        data: tetData,
        error: tetError,
        loading: tetLoading,
        fetching: tetFetching,
        refetch: refetchTet,
    } = useDataQuery(trackedEntityTypeAttributesQuery, {
        lazy: true,
    })

    // Transform tracked entity type attributes to dimension format
    const transformTetAttributes = useCallback(
        (data, searchTermFilter) => {
            const tetAttributes =
                data?.trackedEntityType?.trackedEntityTypeAttributes || []

            let transformed = tetAttributes
                .map((attr) => ({
                    id: attr.trackedEntityAttribute?.id,
                    name: attr.trackedEntityAttribute?.name,
                    valueType: attr.trackedEntityAttribute?.valueType,
                    optionSet: attr.trackedEntityAttribute?.optionSet,
                    dimensionType: DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
                }))
                .filter((attr) => attr.id && attr.name) // Filter out invalid entries

            // Apply search filter if provided
            if (searchTermFilter) {
                const lowerSearch = searchTermFilter.toLowerCase()
                transformed = transformed.filter((attr) =>
                    attr.name.toLowerCase().includes(lowerSearch)
                )
            }

            // Sort alphabetically by name
            transformed.sort((a, b) => a.name.localeCompare(b.name))

            return transformed
        },
        []
    )

    // Handle fetching based on whether program is selected
    useEffect(() => {
        if (!visible || !id) {
            return
        }

        // Reset state
        setDimensions(null)
        setCurrentPage(1)
        setError(null)

        if (programId) {
            // Program selected - fetch program attributes from analytics endpoint
            refetchProgram({
                page: 1,
                searchTerm,
                nameProp,
                id,
                programId,
            })
        } else {
            // No program selected - fetch tracked entity type attributes
            refetchTet({
                id,
                nameProp,
            })
        }
    }, [visible, id, programId, searchTerm, nameProp, refetchProgram, refetchTet])

    // Process program attributes data
    useEffect(() => {
        if (programId && programData && !programFetching) {
            const { pager } = programData.dimensions
            const isLastPage = pager.pageSize * pager.page >= pager.total

            setHasMore(!isLastPage)
            setCurrentPage(pager.page)
            setDimensions((currDimensions) => [
                ...(currDimensions ?? []),
                ...programData.dimensions.dimensions,
            ])
            setLoading(false)
            setFetching(false)
        }
    }, [programData, programFetching, programId])

    // Process tracked entity type attributes data
    useEffect(() => {
        if (!programId && tetData && !tetFetching) {
            const transformed = transformTetAttributes(tetData, searchTerm)
            setDimensions(transformed)
            setHasMore(false) // No pagination for TET attributes
            setLoading(false)
            setFetching(false)
        }
    }, [tetData, tetFetching, programId, searchTerm, transformTetAttributes])

    // Update loading/fetching states
    useEffect(() => {
        if (programId) {
            setLoading(programLoading)
            setFetching(programFetching)
        } else {
            setLoading(tetLoading)
            setFetching(tetFetching)
        }
    }, [programId, programLoading, programFetching, tetLoading, tetFetching])

    // Update error state
    useEffect(() => {
        if (programId) {
            setError(programError)
        } else {
            setError(tetError)
        }
    }, [programId, programError, tetError])

    const loadMore = () => {
        // Only support pagination for program attributes
        if (programId && hasMore && !fetching) {
            refetchProgram({
                page: currentPage + 1,
                searchTerm,
                nameProp,
                id,
                programId,
            })
        }
    }

    return {
        loading: dimensions ? false : loading,
        fetching,
        error,
        dimensions: dimensions ?? [],
        hasMore,
        loadMore,
    }
}

export { useTrackedEntityDimensions }
