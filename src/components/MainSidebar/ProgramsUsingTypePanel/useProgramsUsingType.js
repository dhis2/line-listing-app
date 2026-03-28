import { useCachedDataQuery } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'

const query = {
    programs: {
        resource: 'programs',
        params: ({ nameProp, entityTypeId }) => ({
            fields: [
                'id',
                `${nameProp}~rename(name)`,
                'trackedEntityType[id,name]',
                'programType',
                'enrollmentDateLabel',
                'incidentDateLabel',
                'programStages[id,displayName~rename(name),executionDateLabel,displayExecutionDateLabel,hideDueDate,dueDateLabel,displayDueDateLabel,repeatable]',
                'displayIncidentDate',
                'displayIncidentDateLabel',
                'displayEnrollmentDateLabel',
            ],
            paging: false,
            filter: [
                'access.data.read:eq:true',
                `trackedEntityType.id:eq:${entityTypeId}`,
            ],
            order: `${nameProp}:asc`,
        }),
    },
}

export const useProgramsUsingType = ({ visible, entityTypeId, searchTerm }) => {
    const { currentUser } = useCachedDataQuery()
    const [programs, setPrograms] = useState([])
    const { data, error, loading, fetching, called, refetch } = useDataQuery(
        query,
        {
            lazy: true,
        }
    )

    useEffect(() => {
        // Fetch when component becomes visible and we have an entity type
        if (visible && entityTypeId && !called) {
            refetch({
                nameProp:
                    currentUser.settings[
                        DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY
                    ],
                entityTypeId,
            })
        }
    }, [visible, entityTypeId, called, currentUser, refetch])

    useEffect(() => {
        if (data?.programs?.programs) {
            setPrograms(data.programs.programs)
        }
    }, [data])

    // Filter programs by search term
    const filteredPrograms = searchTerm
        ? programs.filter((program) =>
              program.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : programs

    return {
        loading: !called ? loading : false,
        fetching,
        error,
        programs: filteredPrograms,
    }
}
