import { DIMENSION_TYPE_PROGRAM_ATTRIBUTE } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'

// Query to fetch tracked entity type with its attributes
const query = {
    trackedEntityType: {
        resource: 'trackedEntityTypes',
        id: ({ id }) => id,
        params: ({ nameProp }) => ({
            fields: [
                'id',
                `${nameProp}~rename(name)`,
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
    programId, // Not used for TET attributes, but kept for API compatibility
}) => {
    const [dimensions, setDimensions] = useState(null)
    const { data, error, loading, fetching, refetch } = useDataQuery(query, {
        lazy: true,
    })

    useEffect(() => {
        // Delay initial fetch until component comes into view
        if (visible && !dimensions && id) {
            refetch({ id, nameProp })
        }
    }, [visible, id, nameProp])

    useEffect(() => {
        // Reset when id changes
        setDimensions(null)
        if (visible && id) {
            refetch({ id, nameProp })
        }
    }, [id])

    useEffect(() => {
        if (!fetching && data?.trackedEntityType) {
            // Transform the tracked entity type attributes into dimension format
            const tetAttributes =
                data.trackedEntityType.trackedEntityTypeAttributes || []

            const transformedDimensions = tetAttributes
                .map((attr) => ({
                    id: attr.trackedEntityAttribute.id,
                    name: attr.trackedEntityAttribute.name,
                    valueType: attr.trackedEntityAttribute.valueType,
                    optionSet: attr.trackedEntityAttribute.optionSet,
                    dimensionType: DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
                }))
                .filter((dim) => {
                    // Apply search filter if provided
                    if (searchTerm) {
                        return dim.name
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase())
                    }
                    return true
                })

            setDimensions(transformedDimensions)
        }
    }, [data, fetching, searchTerm])

    return {
        loading: dimensions === null ? loading : false,
        fetching,
        error,
        dimensions: dimensions ?? [],
        hasMore: false, // No pagination needed - all attributes fetched at once
        loadMore: () => {}, // No-op since we fetch all at once
    }
}

export { useTrackedEntityDimensions }
