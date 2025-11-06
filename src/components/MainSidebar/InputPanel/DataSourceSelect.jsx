import { useCachedDataQuery } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tSetDataSource } from '../../../actions/ui.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { sGetUiDataSource } from '../../../reducers/ui.js'
import { acAddMetadata } from '../../../actions/metadata.js'
import {
    getDynamicTimeDimensionsMetadata,
    getProgramAsMetadata,
} from '../../../modules/metadata.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'

const query = {
    programs: {
        resource: 'programs',
        params: ({ nameProp }) => ({
            fields: [
                'id',
                `${nameProp}~rename(name)`,
                'programType',
                'trackedEntityType[id]',
                'programStages[id,displayName~rename(name)]',
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

export const DataSourceSelect = ({ noBorders = false }) => {
    const { currentUser } = useCachedDataQuery()
    const dispatch = useDispatch()
    const selectedDataSource = useSelector(sGetUiDataSource)
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

    const programs = data?.programs?.programs || []
    const trackedEntityTypes =
        data?.trackedEntityTypes?.trackedEntityTypes || []

    const handleSelect = (selectedId) => {
        if (!selectedId) {
            return
        }

        // Check if it's a program or tracked entity type
        const isProgram = selectedId.startsWith('program-')
        const id = selectedId.replace(/^(program|tet)-/, '')

        if (isProgram) {
            const program = programs.find((p) => p.id === id)

            if (program) {
                // Prepare all metadata including time dimensions (without specific stage)
                const allMetadata = {
                    ...getProgramAsMetadata(program),
                    ...getDynamicTimeDimensionsMetadata(
                        program,
                        undefined, // No stage required - show all dimensions
                        OUTPUT_TYPE_EVENT
                    ),
                }

                // Set data source (this will clear old dimensions first)
                dispatch(
                    tSetDataSource({
                        type: 'PROGRAM',
                        id: program.id,
                        programType: program.programType,
                        stage: undefined, // No stage auto-selection
                        metadata: allMetadata,
                    })
                )

                // Add metadata AFTER setting data source (after clearing)
                dispatch(acAddMetadata(allMetadata))
            }
        } else {
            const tet = trackedEntityTypes.find((t) => t.id === id)

            if (tet) {
                // Add tracked entity type metadata to store
                dispatch(acAddMetadata({ [tet.id]: tet }))

                dispatch(
                    tSetDataSource({
                        type: 'TRACKED_ENTITY_TYPE',
                        id: tet.id,
                        metadata: { [tet.id]: tet },
                    })
                )
            }
        }
    }

    const selectedValue =
        selectedDataSource?.id && selectedDataSource?.type
            ? `${selectedDataSource.type === 'PROGRAM' ? 'program' : 'tet'}-${
                  selectedDataSource.id
              }`
            : ''

    return (
        <SingleSelect
            dense
            selected={selectedValue}
            onChange={({ selected }) => handleSelect(selected)}
            placeholder={i18n.t('Choose a data source')}
            maxHeight="max(60vh, 460px)"
            dataTest="data-source-select"
            filterable
            noMatchText={i18n.t('No data sources found')}
            empty={i18n.t('No data sources found')}
            loading={fetching}
        >
            {!fetching &&
                programs.map(({ id, name }) => (
                    <SingleSelectOption
                        key={`program-${id}`}
                        label={`${name} (Program)`}
                        value={`program-${id}`}
                    />
                ))}
            {!fetching &&
                trackedEntityTypes.map(({ id, name }) => (
                    <SingleSelectOption
                        key={`tet-${id}`}
                        label={`${name} (Tracked Entity)`}
                        value={`tet-${id}`}
                    />
                ))}
        </SingleSelect>
    )
}
