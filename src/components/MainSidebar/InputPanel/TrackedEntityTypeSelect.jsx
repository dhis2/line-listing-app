import { useCachedDataQuery } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    DropdownButton,
    Menu,
    MenuItem,
    IconDimensionData16,
    FlyoutMenu,
} from '@dhis2/ui'
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acAddMetadata } from '../../../actions/metadata.js'
import { tSetTrackedEntityType } from '../../../actions/ui.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { sGetUiEntityTypeId } from '../../../reducers/ui.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { TrackedEntityMenuItem } from './TrackedEntityMenuItem.jsx'
import styles from './TrackedEntityTypeSelect.module.css'

const MAX_VISIBLE_PROGRAMS = 3
const STORAGE_KEY = 'lineListing.lastTrackedEntityTypeId'

const query = {
    programs: {
        resource: 'programs',
        params: ({ nameProp }) => ({
            fields: ['id', `${nameProp}~rename(name)`, 'trackedEntityType[id]'],
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

// Format the subtitle showing program names with cutoff
const formatProgramsSubtitle = (programs) => {
    if (!programs || programs.length === 0) {
        return ''
    }

    const programNames = programs.map((p) => p.name)

    if (programNames.length <= MAX_VISIBLE_PROGRAMS) {
        return i18n.t('Used by {{programs}}', {
            programs: programNames.join(', '),
        })
    }

    const visiblePrograms = programNames.slice(0, MAX_VISIBLE_PROGRAMS)
    const remainingCount = programNames.length - MAX_VISIBLE_PROGRAMS

    return i18n.t('Used by {{programs}} and {{count}} other programs', {
        programs: visiblePrograms.join(', '),
        count: remainingCount,
    })
}

export const TrackedEntityTypeSelect = () => {
    const { currentUser } = useCachedDataQuery()
    const dispatch = useDispatch()
    const selectedEntityTypeId = useSelector(sGetUiEntityTypeId)
    const selectedEntityType = useSelector((state) =>
        sGetMetadataById(state, selectedEntityTypeId)
    )
    const nameProp =
        currentUser.settings[DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY]

    const [isOpen, setIsOpen] = useState(false)
    const hasRestoredSelection = useRef(false)

    const { fetching, data, refetch, called } = useDataQuery(query, {
        lazy: true,
    })

    useEffect(() => {
        if (!called) {
            refetch({ nameProp })
        }
    }, [called, refetch, nameProp])

    // Process data: group programs by TET and filter TETs with programs
    const trackedEntityTypesWithPrograms = useMemo(() => {
        const programs = data?.programs?.programs || []
        const trackedEntityTypes =
            data?.trackedEntityTypes?.trackedEntityTypes || []

        // Group programs by tracked entity type ID
        const programsByTetId = {}
        programs.forEach((program) => {
            const tetId = program.trackedEntityType?.id
            if (tetId) {
                if (!programsByTetId[tetId]) {
                    programsByTetId[tetId] = []
                }
                programsByTetId[tetId].push(program)
            }
        })

        // Filter TETs to only those with programs and attach program list
        return trackedEntityTypes
            .filter((tet) => programsByTetId[tet.id]?.length > 0)
            .map((tet) => ({
                ...tet,
                programs: programsByTetId[tet.id] || [],
            }))
    }, [data])

    // Restore last selection from localStorage when data is loaded
    useEffect(() => {
        if (
            !hasRestoredSelection.current &&
            !selectedEntityTypeId &&
            trackedEntityTypesWithPrograms.length > 0
        ) {
            hasRestoredSelection.current = true
            const savedTetId = localStorage.getItem(STORAGE_KEY)
            if (savedTetId) {
                const savedTet = trackedEntityTypesWithPrograms.find(
                    (tet) => tet.id === savedTetId
                )
                if (savedTet) {
                    dispatch(acAddMetadata({ [savedTet.id]: savedTet }))
                    dispatch(tSetTrackedEntityType({ type: savedTet }))
                }
            }
        }
    }, [selectedEntityTypeId, trackedEntityTypesWithPrograms, dispatch])

    const toggleOpen = useCallback(() => {
        setIsOpen((currentIsOpen) => !currentIsOpen)
    }, [])

    const handleSelect = useCallback(
        (tet) => {
            // Add TET to metadata first
            dispatch(acAddMetadata({ [tet.id]: tet }))

            // Set the tracked entity type (this will reset layout)
            dispatch(tSetTrackedEntityType({ type: tet }))

            // Remember this selection for next time
            localStorage.setItem(STORAGE_KEY, tet.id)

            setIsOpen(false)
        },
        [dispatch]
    )

    const menuComponent = (
        <FlyoutMenu>
            <div className={styles.explainer}>
                <div className={styles.explainerText}>
                    {i18n.t(
                        'Choose a data type to show available data and programs'
                    )}
                </div>
            </div>
            {trackedEntityTypesWithPrograms.map((tet) => (
                <TrackedEntityMenuItem
                    key={tet.id}
                    name={tet.name}
                    subtitle={formatProgramsSubtitle(tet.programs)}
                    active={tet.id === selectedEntityTypeId}
                    onClick={() => handleSelect(tet)}
                />
            ))}
            {trackedEntityTypesWithPrograms.length === 0 && !fetching && (
                <MenuItem
                    label={i18n.t('No tracked entity types available')}
                    disabled
                />
            )}
        </FlyoutMenu>
    )

    return (
        <div className={styles.container}>
            <DropdownButton
                component={menuComponent}
                onClick={toggleOpen}
                open={isOpen}
                small
                className={styles.button}
                title={
                    selectedEntityType?.name ||
                    i18n.t('Select tracked entity type')
                }
            >
                <IconDimensionData16 />
            </DropdownButton>
        </div>
    )
}
