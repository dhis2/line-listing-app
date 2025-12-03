import { useCachedDataQuery } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    DropdownButton,
    MenuItem,
    IconDimensionData16,
    FlyoutMenu,
    IconCross16,
    IconCheckmark16,
} from '@dhis2/ui'
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acAddMetadata } from '../../../actions/metadata.js'
import {
    tSetTrackedEntityType,
    tSetEventsWithoutRegistration,
} from '../../../actions/ui.js'
import { EVENTS_WITHOUT_REGISTRATION_ID } from '../../../modules/programTypes.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { sGetUiEntityTypeId } from '../../../reducers/ui.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
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

const TrackedEntityOption = ({ name, subtitle, active, onClick }) => (
    <button
        className={`${styles.option} ${active ? styles.optionActive : ''}`}
        onClick={onClick}
        type="button"
    >
        <span className={styles.checkmark}>
            {active && <IconCheckmark16 />}
        </span>
        <span className={styles.optionContent}>
            <span className={styles.optionName}>{name}</span>
            {subtitle && (
                <span className={styles.optionSubtitle}>{subtitle}</span>
            )}
        </span>
    </button>
)

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
    const { trackedEntityTypesWithPrograms, programsWithoutRegistration } =
        useMemo(() => {
            const programs = data?.programs?.programs || []
            const trackedEntityTypes =
                data?.trackedEntityTypes?.trackedEntityTypes || []

            // Group programs by tracked entity type ID
            const programsByTetId = {}
            const noRegistrationPrograms = []

            programs.forEach((program) => {
                const tetId = program.trackedEntityType?.id
                if (tetId) {
                    if (!programsByTetId[tetId]) {
                        programsByTetId[tetId] = []
                    }
                    programsByTetId[tetId].push(program)
                } else {
                    // Programs without a tracked entity type (event programs)
                    noRegistrationPrograms.push(program)
                }
            })

            // Filter TETs to only those with programs and attach program list
            const tetsWithPrograms = trackedEntityTypes
                .filter((tet) => programsByTetId[tet.id]?.length > 0)
                .map((tet) => ({
                    ...tet,
                    programs: programsByTetId[tet.id] || [],
                }))

            return {
                trackedEntityTypesWithPrograms: tetsWithPrograms,
                programsWithoutRegistration: noRegistrationPrograms,
            }
        }, [data])

    // Restore last selection from localStorage when data is loaded
    useEffect(() => {
        if (
            !hasRestoredSelection.current &&
            !selectedEntityTypeId &&
            (trackedEntityTypesWithPrograms.length > 0 ||
                programsWithoutRegistration.length > 0)
        ) {
            hasRestoredSelection.current = true
            const savedTetId = localStorage.getItem(STORAGE_KEY)
            if (savedTetId) {
                // Check if it's the "Events without registration" option
                if (
                    savedTetId === EVENTS_WITHOUT_REGISTRATION_ID &&
                    programsWithoutRegistration.length > 0
                ) {
                    dispatch(tSetEventsWithoutRegistration())
                } else {
                    const savedTet = trackedEntityTypesWithPrograms.find(
                        (tet) => tet.id === savedTetId
                    )
                    if (savedTet) {
                        dispatch(acAddMetadata({ [savedTet.id]: savedTet }))
                        dispatch(tSetTrackedEntityType({ type: savedTet }))
                    }
                }
            }
        }
    }, [
        selectedEntityTypeId,
        trackedEntityTypesWithPrograms,
        programsWithoutRegistration,
        dispatch,
    ])

    const toggleOpen = useCallback(() => {
        setIsOpen((currentIsOpen) => !currentIsOpen)
    }, [])

    const handleClose = useCallback(() => {
        setIsOpen(false)
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

    const handleSelectEventsWithoutRegistration = useCallback(() => {
        // Set the events without registration mode
        dispatch(tSetEventsWithoutRegistration())

        // Remember this selection for next time
        localStorage.setItem(STORAGE_KEY, EVENTS_WITHOUT_REGISTRATION_ID)

        setIsOpen(false)
    }, [dispatch])

    const menuComponent = (
        <div className={styles.dropdown}>
            <div className={styles.header}>
                <span className={styles.headerTitle}>
                    {i18n.t(
                        'Choose a data type to show available data and programs'
                    )}
                </span>
            </div>
            <div className={styles.optionsList}>
                {trackedEntityTypesWithPrograms.map((tet) => (
                    <TrackedEntityOption
                        key={tet.id}
                        name={tet.name}
                        subtitle={formatProgramsSubtitle(tet.programs)}
                        active={tet.id === selectedEntityTypeId}
                        onClick={() => handleSelect(tet)}
                    />
                ))}
                {programsWithoutRegistration.length > 0 && (
                    <TrackedEntityOption
                        name={i18n.t('Events without registration')}
                        subtitle={formatProgramsSubtitle(
                            programsWithoutRegistration
                        )}
                        active={
                            selectedEntityTypeId ===
                            EVENTS_WITHOUT_REGISTRATION_ID
                        }
                        onClick={handleSelectEventsWithoutRegistration}
                    />
                )}
                {trackedEntityTypesWithPrograms.length === 0 &&
                    programsWithoutRegistration.length === 0 &&
                    !fetching && (
                        <div className={styles.emptyState}>
                            {i18n.t('No data types available')}
                        </div>
                    )}
            </div>
        </div>
    )

    // Get the display name for the button
    const buttonLabel = useMemo(() => {
        if (selectedEntityTypeId === EVENTS_WITHOUT_REGISTRATION_ID) {
            return i18n.t('Events without registration')
        }
        return selectedEntityType?.name || i18n.t('Select data type')
    }, [selectedEntityTypeId, selectedEntityType])

    return (
        <div className={styles.container}>
            <DropdownButton
                component={menuComponent}
                onClick={toggleOpen}
                open={isOpen}
                small
                className={styles.button}
                title={buttonLabel}
            >
                <IconDimensionData16 />
            </DropdownButton>
        </div>
    )
}
