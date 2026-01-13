import {
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    useCachedDataQuery,
} from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import { useEffect, useState, useCallback } from 'react'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { DIMENSION_LIST_FIELDS } from '../DimensionsList/index.js'

// Use the analytics dimensions API which returns ALL dimensions available
// for a tracked entity type, including attributes from all programs that use it
const createDimensionsQuery = ({ trackedEntityTypeId, nameProp, searchTerm }) => ({
    resource: 'analytics/trackedEntities/query/dimensions',
    params: {
        trackedEntityType: trackedEntityTypeId,
        fields: [...DIMENSION_LIST_FIELDS, `${nameProp}~rename(name)`],
        filter: [
            // Only get program attributes (tracked entity attributes)
            'dimensionType:eq:PROGRAM_ATTRIBUTE',
            // Apply search filter if provided
            ...(searchTerm ? [`${nameProp}:ilike:${searchTerm}`] : []),
        ],
        order: `${nameProp}:asc`,
        paging: false, // Get all at once
    },
})

const useTrackedEntityDimensions = ({
    visible,
    searchTerm,
    nameProp: externalNameProp,
    id,
    programId, // Not used for TET attributes, but kept for API compatibility
}) => {
    const { currentUser } = useCachedDataQuery()
    const nameProp = externalNameProp || currentUser?.settings?.[DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY] || 'displayName'
    const engine = useDataEngine()
    const [dimensions, setDimensions] = useState(null)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState(null)

    const fetchDimensions = useCallback(async () => {
        if (!id) {
            setDimensions([])
            return
        }

        setLoading(dimensions === null)
        setFetching(true)
        setError(null)

        try {
            const query = createDimensionsQuery({
                trackedEntityTypeId: id,
                nameProp,
                searchTerm,
            })

            const data = await engine.query({ dimensions: query })
            
            // Transform the response - the API returns dimensions with all info
            const fetchedDimensions = data?.dimensions?.dimensions || []
            
            // Ensure all dimensions have the correct dimensionType
            const transformedDimensions = fetchedDimensions.map((dim) => ({
                ...dim,
                dimensionType: dim.dimensionType || DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
            }))

            setDimensions(transformedDimensions)
        } catch (err) {
            console.error('Error fetching tracked entity dimensions:', err)
            setError(err)
            setDimensions([])
        } finally {
            setLoading(false)
            setFetching(false)
        }
    }, [id, nameProp, searchTerm, engine, dimensions])

    useEffect(() => {
        // Delay initial fetch until component comes into view
        if (visible && dimensions === null && id) {
            fetchDimensions()
        }
    }, [visible, id])

    useEffect(() => {
        // Reset and refetch when id or search term changes
        if (visible && id) {
            setDimensions(null)
            fetchDimensions()
        }
    }, [id, searchTerm])

    return {
        loading,
        fetching,
        error,
        dimensions: dimensions ?? [],
        hasMore: false, // No pagination needed - all attributes fetched at once
        loadMore: () => {}, // No-op since we fetch all at once
    }
}

export { useTrackedEntityDimensions }
