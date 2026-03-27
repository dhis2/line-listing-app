import { useCachedDataQuery } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect, useMemo } from 'react'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../modules/userSettings.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../../modules/programTypes.js'

const query = {
    programs: {
        resource: 'programs',
        params: ({ nameProp }) => ({
            fields: [
                'id',
                `${nameProp}~rename(name)`,
                'programType',
                'trackedEntityType[id,displayName~rename(name)]',
                'displayIncidentDate',
                'displayEnrollmentDateLabel',
                'displayIncidentDateLabel',
                'programStages[id,displayName~rename(name),executionDateLabel,displayExecutionDateLabel,hideDueDate,dueDateLabel,displayDueDateLabel,repeatable]',
            ],
            paging: false,
            filter: 'access.data.read:eq:true',
        }),
    },
    trackedEntityTypes: {
        resource: 'trackedEntityTypes',
        params: ({ nameProp }) => ({
            fields: ['id', `${nameProp}~rename(name)`],
            paging: false,
            filter: 'access.data.read:eq:true',
        }),
    },
}

/**
 * Hook to fetch all available data sources (programs and tracked entity types)
 * @returns {Object} { programs, trackedEntityTypes, loading, error }
 */
export const useDataSources = () => {
    const { currentUser } = useCachedDataQuery()
    const nameProp =
        currentUser.settings[DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY]

    const { fetching, error, data, refetch, called } = useDataQuery(query, {
        lazy: true,
    })

    useEffect(() => {
        if (!called) {
            refetch({ nameProp })
        }
    }, [called, refetch, nameProp])

    const programs = useMemo(() => {
        return (data?.programs?.programs || []).map((program) => ({
            ...program,
            dataSourceType: 'PROGRAM',
            isProgramWithRegistration:
                program.programType === PROGRAM_TYPE_WITH_REGISTRATION &&
                program.programStages &&
                program.programStages.length > 0,
        }))
    }, [data?.programs?.programs])

    // PROTOTYPE HACK: Only show Person and Lab sample tracked entity types
    const trackedEntityTypes = useMemo(() => {
        return (data?.trackedEntityTypes?.trackedEntityTypes || [])
            .filter((tet) => ['Person', 'Lab sample'].includes(tet.name))
            .map((tet) => ({
                ...tet,
                dataSourceType: 'TRACKED_ENTITY_TYPE',
            }))
    }, [data?.trackedEntityTypes?.trackedEntityTypes])

    return {
        programs,
        trackedEntityTypes,
        loading: fetching,
        error,
    }
}
