import { useCachedDataQuery } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, SingleSelect, IconDimensionEventDataItem16 } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tSetUiProgram } from '../../../actions/ui.js'
import { extractDimensionIdParts } from '../../../modules/dimensionId.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../../../modules/programTypes.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import {
    sGetDimensionIdsFromLayout,
    sGetUiEntityTypeId,
    sGetUiInputType,
    sGetUiProgramId,
} from '../../../reducers/ui.js'
import styles from './ProgramSelect.module.css'
import { SingleSelectOptionWithSuffix } from './SingleSelectOptionWithSuffix.jsx'
import { StageSelect } from './StageSelect.jsx'

const query = {
    programs: {
        resource: 'programs',
        params: ({ nameProp, selectedEntityTypeId, inputType }) => ({
            fields: [
                'id',
                `${nameProp}~rename(name)`,
                'enrollmentDateLabel',
                'incidentDateLabel',
                'programType',
                'programStages[id,displayName~rename(name),displayExecutionDateLabel,hideDueDate,displayDueDateLabel,repeatable]',
                'displayIncidentDate',
                'displayIncidentDateLabel',
                'displayEnrollmentDateLabel',
            ],
            paging: false,
            filter: [
                'access.data.read:eq:true',
                ...(selectedEntityTypeId
                    ? [`trackedEntityType.id:eq:${selectedEntityTypeId}`]
                    : []),
                ...(inputType === OUTPUT_TYPE_ENROLLMENT
                    ? [`programType:eq:${PROGRAM_TYPE_WITH_REGISTRATION}`]
                    : []),
            ],
        }),
    },
}

const ProgramSelect = ({ prefix, noBorders = false }) => {
    const { currentUser } = useCachedDataQuery()
    const dispatch = useDispatch()
    const selectedEntityTypeId = useSelector(sGetUiEntityTypeId)
    const selectedProgramId = useSelector(sGetUiProgramId)
    const selectedProgram = useSelector((state) =>
        sGetMetadataById(state, selectedProgramId)
    )
    const allDimensionIds = useSelector(sGetDimensionIdsFromLayout)
    const inputType = useSelector(sGetUiInputType)
    const { fetching, error, data, refetch } = useDataQuery(query, {
        lazy: true,
    })
    const [programDimensionsMap, setProgramDimensionsMap] = useState({})

    const programs = data?.programs.programs
    const programType = selectedProgram?.programType
    const requiredStageSelection =
        inputType === OUTPUT_TYPE_EVENT &&
        programType === PROGRAM_TYPE_WITH_REGISTRATION
    const showStageSelect = selectedProgram && requiredStageSelection

    const setSelectedProgramId = (programId) => {
        if (programId !== selectedProgramId) {
            const program = programs?.find(({ id }) => id === programId)
            const stage =
                // auto-select first stage if input type is Event
                inputType === OUTPUT_TYPE_EVENT && program?.programStages.length
                    ? program.programStages[0]
                    : undefined
            dispatch(tSetUiProgram({ program, stage }))
        }
    }

    useEffect(() => {
        if (inputType === OUTPUT_TYPE_TRACKED_ENTITY && selectedEntityTypeId) {
            const map = {}
            allDimensionIds.forEach((id) => {
                const { programId } = extractDimensionIdParts(id, inputType)
                if (programId) {
                    map[programId] = map[programId] ? map[programId] + 1 : 1
                }
            })
            setProgramDimensionsMap(map)
        }
    }, [selectedEntityTypeId, allDimensionIds, inputType])

    useEffect(() => {
        refetch({
            nameProp:
                currentUser.settings[
                    DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY
                ],
            selectedEntityTypeId,
            inputType,
        })
    }, [refetch, selectedEntityTypeId, currentUser, inputType])

    if (error && !fetching) {
        return (
            <div className={styles.section}>
                <NoticeBox error title={i18n.t('Could not load programs')}>
                    {error?.message ||
                        i18n.t(
                            "The programs couldn't be retrieved. Try again or contact your system administrator."
                        )}
                </NoticeBox>
            </div>
        )
    }
    return (
        <div className={styles.rows}>
            <div className={styles.columns}>
                <div className={styles.stretch}>
                    <div className={cx(styles.dropdownWrapper, {
                        [styles.noBorders]: noBorders
                    })}>
                        <SingleSelect
                        dense
                        selected={selectedProgram?.id || undefined}
                        onChange={({ selected }) =>
                            setSelectedProgramId(selected)
                        }
                        placeholder={i18n.t('Choose a program')}
                        maxHeight="max(60vh, 460px)"
                        dataTest="program-dimensions-program-select"
                        filterable
                        noMatchText={i18n.t('No programs found')}
                        prefix={selectedProgram?.id ? (prefix || <IconDimensionEventDataItem16 />) : undefined}
                        empty={i18n.t('No programs found')}
                        loading={fetching}
                    >
                        {(fetching || !programs) && selectedProgram?.id && (
                            <SingleSelectOptionWithSuffix
                                key={selectedProgram?.id}
                                label={selectedProgram?.name}
                                suffix={
                                    (selectedEntityTypeId &&
                                        selectedProgram?.id &&
                                        programDimensionsMap[
                                            selectedProgram.id
                                        ]) ||
                                    null
                                }
                                value={selectedProgram?.id}
                            />
                        )}
                        {!fetching &&
                            programs?.map(({ id, name }) => (
                                <SingleSelectOptionWithSuffix
                                    key={id}
                                    label={name}
                                    value={id}
                                    suffix={
                                        (selectedEntityTypeId &&
                                            programDimensionsMap[id]) ||
                                        null
                                    }
                                />
                            ))}
                        </SingleSelect>
                    </div>
                </div>
            </div>
            {showStageSelect && (
                <StageSelect stages={selectedProgram.programStages} />
            )}
        </div>
    )
}

ProgramSelect.propTypes = {
    prefix: PropTypes.string,
    noBorders: PropTypes.bool,
}

export { ProgramSelect }
