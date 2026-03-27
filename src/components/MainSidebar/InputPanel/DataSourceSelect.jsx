import { useCachedDataQuery } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    SingleSelect,
    SingleSelectOption,
    IconDimensionEventDataItem16,
} from '@dhis2/ui'
import React, { useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tSetDataSource, tRemoveDataSourceDimensions } from '../../../actions/ui.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { extractDimensionIdParts } from '../../../modules/dimensionId.js'
import {
    sGetUiDataSource,
    sGetUiLayout,
    sGetUiInputType,
    sGetUiDataSourceType,
    sGetUiDataSourceId,
} from '../../../reducers/ui.js'
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
import styles from './DataSourceSelect.module.css'

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

// Hook to count dimensions per data source from the layout
const useDimensionCountsByDataSource = (programs) => {
    const layout = useSelector(sGetUiLayout)
    const inputType = useSelector(sGetUiInputType)
    const currentDataSourceType = useSelector(sGetUiDataSourceType)
    const currentDataSourceId = useSelector(sGetUiDataSourceId)

    return useMemo(() => {
        const counts = {}

        // Get all dimension IDs from layout (columns + filters)
        const allDimensionIds = [
            ...(layout.columns || []),
            ...(layout.filters || []),
        ]

        // Create a set of program IDs for quick lookup
        const programIds = new Set(programs.map((p) => p.id))

        allDimensionIds.forEach((id) => {
            const { programId, programStageId } = extractDimensionIdParts(
                id,
                inputType
            )

            // For dimensions with programId in the ID
            if (programId && programIds.has(programId)) {
                counts[programId] = (counts[programId] || 0) + 1
            }
            // For dimensions with stageId, find the program that owns this stage
            else if (programStageId) {
                const ownerProgram = programs.find((p) =>
                    p.programStages?.some((s) => s.id === programStageId)
                )
                if (ownerProgram) {
                    counts[ownerProgram.id] =
                        (counts[ownerProgram.id] || 0) + 1
                }
            }
        })

        // For tracked entity type data sources, count all dimensions
        // since TET dimensions don't have program/stage prefixes
        if (
            currentDataSourceType === 'TRACKED_ENTITY_TYPE' &&
            currentDataSourceId &&
            allDimensionIds.length > 0
        ) {
            // Count dimensions that don't belong to any program
            const programDimensionCount = Object.values(counts).reduce(
                (sum, c) => sum + c,
                0
            )
            const tetDimensionCount =
                allDimensionIds.length - programDimensionCount
            if (tetDimensionCount > 0) {
                counts[currentDataSourceId] = tetDimensionCount
            }
        }

        return counts
    }, [
        layout,
        inputType,
        programs,
        currentDataSourceType,
        currentDataSourceId,
    ])
}

// Component for rendering option label with badge and optional remove button
const OptionLabelWithBadge = ({ name, count, onRemove }) => (
    <span className={styles.optionWithBadge}>
        <span className={styles.optionName}>{name}</span>
        {count > 0 && onRemove ? (
            <button
                className={styles.removeBadge}
                onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    onRemove()
                }}
                onMouseDown={(e) => {
                    // Prevent dropdown from closing
                    e.stopPropagation()
                }}
                title={i18n.t('Remove all {{count}} dimensions from this data source', { count })}
                aria-label={i18n.t('Remove all {{count}} dimensions from this data source', { count })}
            >
                {count} ×
            </button>
        ) : count > 0 ? (
            <span className={styles.badge}>{count}</span>
        ) : null}
    </span>
)

// Component for rendering section header
const SectionHeader = ({ label }) => (
    <span className={styles.sectionHeader}>{label}</span>
)

export const DataSourceSelect = ({
    noBorders = false,
    onSelect,
    onSelectRef,
}) => {
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
    // PROTOTYPE HACK: Only show Person and Lab sample tracked entity types
    const trackedEntityTypes = (
        data?.trackedEntityTypes?.trackedEntityTypes || []
    ).filter((tet) => ['Person', 'Lab sample'].includes(tet.name))

    // Get dimension counts per data source
    const dimensionCounts = useDimensionCountsByDataSource(programs)


    const handleSelect = (selectedId) => {
        if (!selectedId || selectedId.startsWith('header-')) {
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

        // Call optional callback
        if (onSelect) {
            onSelect(selectedId)
        }
    }

    // Expose handleSelect via ref
    useEffect(() => {
        if (onSelectRef) {
            onSelectRef.current = handleSelect
        }
    }, [handleSelect, onSelectRef])

    const selectedValue =
        selectedDataSource?.id && selectedDataSource?.type
            ? `${selectedDataSource.type === 'PROGRAM' ? 'program' : 'tet'}-${
                  selectedDataSource.id
              }`
            : ''

    // Handler to remove all dimensions from a data source
    const handleRemoveDataSourceDimensions = useCallback(
        (dataSourceType, dataSourceId) => {
            dispatch(
                tRemoveDataSourceDimensions({
                    dataSourceType,
                    dataSourceId,
                    programs,
                })
            )
        },
        [dispatch, programs]
    )

    // Build the options list with sections
    const renderOptions = () => {
        const options = []

        // Section 1: Programs
        if (programs.length > 0) {
            options.push(
                <SingleSelectOption
                    key="header-programs"
                    label={<SectionHeader label={i18n.t('Programs')} />}
                    value="header-programs"
                    disabled
                />
            )
            programs.forEach(({ id, name }) => {
                const count = dimensionCounts[id] || 0
                options.push(
                    <SingleSelectOption
                        key={`program-${id}`}
                        label={
                            count > 0 ? (
                                <OptionLabelWithBadge
                                    name={name}
                                    count={count}
                                    onRemove={() =>
                                        handleRemoveDataSourceDimensions('PROGRAM', id)
                                    }
                                />
                            ) : (
                                name
                            )
                        }
                        value={`program-${id}`}
                    />
                )
            })
        }

        // Section 2: Tracked entity types
        if (trackedEntityTypes.length > 0) {
            options.push(
                <SingleSelectOption
                    key="header-tet"
                    label={<SectionHeader label={i18n.t('Analyze without a program')} />}
                    value="header-tet"
                    disabled
                />
            )
            trackedEntityTypes.forEach(({ id, name }) => {
                const count = dimensionCounts[id] || 0
                options.push(
                    <SingleSelectOption
                        key={`tet-${id}`}
                        label={
                            count > 0 ? (
                                <OptionLabelWithBadge
                                    name={name}
                                    count={count}
                                    onRemove={() =>
                                        handleRemoveDataSourceDimensions('TRACKED_ENTITY_TYPE', id)
                                    }
                                />
                            ) : (
                                name
                            )
                        }
                        value={`tet-${id}`}
                    />
                )
            })
        }

        return options
    }

    return (
        <SingleSelect
            dense
            selected={selectedValue}
            onChange={({ selected }) => handleSelect(selected)}
            placeholder={i18n.t('Choose a data source')}
            maxHeight="max(60vh, 460px)"
            dataTest="data-source-select"
            filterable
            filterPlaceholder={i18n.t('Filter data sources')}
            noMatchText={i18n.t('No data sources found')}
            empty={i18n.t('No data sources found')}
            loading={fetching}
            prefix={
                selectedValue ? <IconDimensionEventDataItem16 /> : undefined
            }
        >
            {!fetching && renderOptions()}
        </SingleSelect>
    )
}
