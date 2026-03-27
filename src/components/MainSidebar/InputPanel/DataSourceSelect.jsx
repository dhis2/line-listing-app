import { useCachedDataQuery } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    SingleSelect,
    SingleSelectOption,
    IconDimensionEventDataItem16,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tSetDataSource, tClearProgramSelection } from '../../../actions/ui.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { extractDimensionIdParts } from '../../../modules/dimensionId.js'
import {
    sGetUiLayout,
    sGetUiInputType,
    sGetUiProgramId,
} from '../../../reducers/ui.js'
import { acAddMetadata } from '../../../actions/metadata.js'
import {
    getDynamicTimeDimensionsMetadata,
    getProgramAsMetadata,
} from '../../../modules/metadata.js'
import { OUTPUT_TYPE_EVENT } from '../../../modules/visualization.js'
import styles from './DataSourceSelect.module.css'

// Query that filters programs by tracked entity type
const query = {
    programs: {
        resource: 'programs',
        params: ({ nameProp, trackedEntityTypeId }) => {
            const filters = ['access.data.read:eq:true']
            if (trackedEntityTypeId) {
                filters.push(`trackedEntityType.id:eq:${trackedEntityTypeId}`)
            }
            return {
                fields: [
                    'id',
                    `${nameProp}~rename(name)`,
                    'programType',
                    'trackedEntityType[id]',
                    'displayIncidentDate',
                    'displayEnrollmentDateLabel',
                    'displayIncidentDateLabel',
                    'programStages[id,displayName~rename(name),executionDateLabel,displayExecutionDateLabel,hideDueDate,dueDateLabel,displayDueDateLabel,repeatable]',
                ],
                paging: false,
                filter: filters,
            }
        },
    },
}

// Hook to count dimensions per program from the layout
const useDimensionCountsByProgram = (programs) => {
    const layout = useSelector(sGetUiLayout)
    const inputType = useSelector(sGetUiInputType)

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

        return counts
    }, [layout, inputType, programs])
}

// Component for rendering option label with badge
const OptionLabelWithBadge = ({ name, count }) => (
    <span className={styles.optionWithBadge}>
        <span className={styles.optionName}>{name}</span>
        {count > 0 && <span className={styles.badge}>{count}</span>}
    </span>
)

// Component for rendering section header
const SectionHeader = ({ label }) => (
    <span className={styles.sectionHeader}>{label}</span>
)

export const DataSourceSelect = ({ trackedEntityTypeId }) => {
    const { currentUser } = useCachedDataQuery()
    const dispatch = useDispatch()
    const selectedProgramId = useSelector(sGetUiProgramId)
    const nameProp =
        currentUser.settings[DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY]

    const { fetching, data, refetch } = useDataQuery(query, {
        lazy: true,
    })

    // Refetch when trackedEntityTypeId changes
    useEffect(() => {
        if (trackedEntityTypeId) {
            refetch({ nameProp, trackedEntityTypeId })
        }
    }, [trackedEntityTypeId, refetch, nameProp])

    const programs = data?.programs?.programs || []

    // Get dimension counts per program
    const dimensionCounts = useDimensionCountsByProgram(programs)

    // Separate programs into "used in visualization" and regular sections
    const { usedPrograms, remainingPrograms } = useMemo(() => {
        const used = []
        const remaining = []

        programs.forEach((program) => {
            if (dimensionCounts[program.id]) {
                used.push({
                    ...program,
                    count: dimensionCounts[program.id],
                })
            } else {
                remaining.push(program)
            }
        })

        return {
            usedPrograms: used,
            remainingPrograms: remaining,
        }
    }, [programs, dimensionCounts])

    const handleChange = ({ selected }) => {
        // Handle clear - when selection is cleared
        if (!selected) {
            dispatch(tClearProgramSelection())
            return
        }

        // Ignore header clicks
        if (selected.startsWith('header-')) {
            return
        }

        // Handle program selection
        const programId = selected.replace(/^program-/, '')
        const program = programs.find((p) => p.id === programId)

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

            // Set data source - preserve the tracked entity type
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
    }

    // Determine selected value - empty string when no program selected
    const selectedValue = selectedProgramId
        ? `program-${selectedProgramId}`
        : ''

    // Don't render if no tracked entity type is selected
    if (!trackedEntityTypeId) {
        return (
            <SingleSelect
                dense
                selected=""
                disabled
                placeholder={i18n.t('Select a tracked entity type first')}
                dataTest="data-source-select"
            />
        )
    }

    const hasNoPrograms =
        !fetching && programs.length === 0 && trackedEntityTypeId

    // Render program options
    const renderOptions = () => {
        const options = []

        // Only add program options when not loading and programs exist
        if (!fetching && !hasNoPrograms) {
            // Section 1: Used in this visualization (only if there are any)
            if (usedPrograms.length > 0) {
                options.push(
                    <SingleSelectOption
                        key="header-used"
                        label={
                            <SectionHeader
                                label={i18n.t('Used in this visualization')}
                            />
                        }
                        value="header-used"
                        disabled
                    />
                )
                usedPrograms.forEach(({ id, name, count }) => {
                    options.push(
                        <SingleSelectOption
                            key={`program-${id}`}
                            label={
                                <OptionLabelWithBadge name={name} count={count} />
                            }
                            value={`program-${id}`}
                        />
                    )
                })
            }

            // Section 2: Available programs
            if (remainingPrograms.length > 0) {
                options.push(
                    <SingleSelectOption
                        key="header-programs"
                        label={<SectionHeader label={i18n.t('Programs')} />}
                        value="header-programs"
                        disabled
                    />
                )
                remainingPrograms.forEach(({ id, name }) => {
                    options.push(
                        <SingleSelectOption
                            key={`program-${id}`}
                            label={name}
                            value={`program-${id}`}
                        />
                    )
                })
            }
        }

        return options
    }

    return (
        <SingleSelect
            dense
            selected={selectedValue}
            onChange={handleChange}
            placeholder={i18n.t('Choose a program')}
            maxHeight="max(60vh, 460px)"
            dataTest="data-source-select"
            filterable
            filterPlaceholder={i18n.t('Filter programs')}
            noMatchText={i18n.t('No programs found')}
            empty={i18n.t('No programs available for this tracked entity type')}
            loading={fetching}
            clearable
            clearText={i18n.t('Clear program selection')}
            prefix={selectedProgramId ? <IconDimensionEventDataItem16 /> : undefined}
        >
            {renderOptions()}
        </SingleSelect>
    )
}

DataSourceSelect.propTypes = {
    trackedEntityTypeId: PropTypes.string,
}
