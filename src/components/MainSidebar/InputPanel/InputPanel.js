import { useCachedDataQuery } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    tSetUiEntityType,
    tSetUiInput,
    tSetUiProgram,
} from '../../../actions/ui.js'
import {
    PROGRAM_TYPE_WITHOUT_REGISTRATION,
    PROGRAM_TYPE_WITH_REGISTRATION,
} from '../../../modules/programTypes.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'
import {
    sGetUiEntityTypeId,
    sGetUiInput,
    sGetUiProgramId,
} from '../../../reducers/ui.js'
import { ProgramSelect } from '../ProgramDimensionsPanel/ProgramSelect.js'
import { TypeSelect } from '../ProgramDimensionsPanel/TypeSelect.js'
import { InputOption } from './InputOption.js'
import styles from './InputPanel.module.css'

const query = {
    programs: {
        resource: 'programs',
        params: ({ nameProp }) => ({
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
            filter: 'access.data.read:eq:true',
        }),
    },
}

const queryTE = {
    programs: {
        resource: 'trackedEntityTypes',
        params: ({ nameProp }) => ({
            fields: ['id', `${nameProp}~rename(name)`],
            paging: false,
            filter: 'access.data.read:eq:true',
        }),
    },
}

const getLabelForInputType = (type) => {
    switch (type) {
        case OUTPUT_TYPE_EVENT:
            return i18n.t('Event')
        case OUTPUT_TYPE_ENROLLMENT:
            return i18n.t('Enrollment')
        case OUTPUT_TYPE_TRACKED_ENTITY:
            return i18n.t('Tracked entity')
        default:
            throw new Error('No input type specified')
    }
}

const InputPanel = ({ visible }) => {
    const dispatch = useDispatch()
    const selectedInput = useSelector(sGetUiInput)
    const selectedProgramId = useSelector(sGetUiProgramId)
    const selectedTypeId = useSelector(sGetUiEntityTypeId)
    const { currentUser } = useCachedDataQuery()
    const { fetching, error, data, refetch, called } = useDataQuery(query, {
        lazy: true,
    })
    const {
        fetching: fetchingTE,
        error: errorTE,
        data: dataTE,
        refetch: refetchTE,
        called: calledTE,
    } = useDataQuery(queryTE, {
        lazy: true,
    }) // TODO: split the program fetching and type fetching into two separate components

    const filteredPrograms = data?.programs.programs.filter(
        ({ programType }) =>
            !(
                selectedInput.type === OUTPUT_TYPE_ENROLLMENT &&
                programType === PROGRAM_TYPE_WITHOUT_REGISTRATION
            )
    )
    const types = dataTE?.programs.trackedEntityTypes

    const selectedProgram =
        selectedProgramId &&
        filteredPrograms?.find(({ id }) => id === selectedProgramId)
    const selectedType =
        selectedTypeId && types?.find(({ id }) => id === selectedTypeId)

    const programType = selectedProgram?.programType
    const requiredStageSelection =
        selectedInput.type === OUTPUT_TYPE_EVENT &&
        programType === PROGRAM_TYPE_WITH_REGISTRATION
    const setSelectedProgramId = (programId) => {
        if (programId !== selectedProgramId) {
            const program = filteredPrograms?.find(({ id }) => id === programId)
            const stage =
                // auto-select first stage if input type is Event
                selectedInput.type === OUTPUT_TYPE_EVENT &&
                program?.programStages.length
                    ? program.programStages[0]
                    : undefined
            dispatch(tSetUiProgram({ program, stage }))
        }
    }
    const setSelectedTypeId = (typeId) => {
        if (typeId !== selectedTypeId) {
            const type = types?.find(({ id }) => id === typeId)
            dispatch(tSetUiEntityType({ type }))
        }
    }

    useEffect(() => {
        if (visible && !called) {
            refetch({
                nameProp:
                    currentUser.settings[
                        DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY
                    ],
            })
        }
        if (visible && !calledTE) {
            refetchTE({
                nameProp:
                    currentUser.settings[
                        DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY
                    ],
            })
        }
    }, [visible, called, refetch, calledTE, refetchTE])

    if (!visible) {
        return null
    }

    const setSelectedInput = (input) => {
        if (selectedInput.type !== input.type) {
            dispatch(tSetUiInput(input))
        }
    }

    const renderProgramSelect = () => {
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
        } else if (fetching) {
            return (
                <CenteredContent>
                    <CircularLoader small />
                </CenteredContent>
            )
        } else if (filteredPrograms) {
            return (
                <ProgramSelect
                    programs={filteredPrograms}
                    selectedProgram={selectedProgram}
                    setSelectedProgramId={setSelectedProgramId}
                    requiredStageSelection={requiredStageSelection}
                />
            )
        }
    }

    const renderTypeSelect = () => {
        if (errorTE && !fetchingTE) {
            return (
                <div className={styles.section}>
                    <NoticeBox error title={i18n.t('Could not load types')}>
                        {errorTE?.message ||
                            i18n.t(
                                "The types couldn't be retrieved. Try again or contact your system administrator."
                            )}
                    </NoticeBox>
                </div>
            )
        } else if (fetchingTE) {
            return (
                <CenteredContent>
                    <CircularLoader small />
                </CenteredContent>
            )
        } else if (types) {
            return (
                <TypeSelect
                    types={types}
                    selectedType={selectedType}
                    setSelectedTypeId={setSelectedTypeId}
                />
            )
        }
    }

    return (
        <div className={styles.container} data-test="input-panel">
            <InputOption
                dataTest="input-event"
                header={getLabelForInputType(OUTPUT_TYPE_EVENT)}
                description={i18n.t(
                    'See individual event data from a Tracker program stage or event program.'
                )}
                onClick={() => setSelectedInput({ type: OUTPUT_TYPE_EVENT })}
                selected={selectedInput.type === OUTPUT_TYPE_EVENT}
            >
                {selectedInput.type === OUTPUT_TYPE_EVENT &&
                    renderProgramSelect()}
            </InputOption>
            <InputOption
                dataTest="input-enrollment"
                header={getLabelForInputType(OUTPUT_TYPE_ENROLLMENT)}
                description={i18n.t(
                    'See data from multiple program stages in a Tracker program.'
                )}
                onClick={() =>
                    setSelectedInput({ type: OUTPUT_TYPE_ENROLLMENT })
                }
                selected={selectedInput.type === OUTPUT_TYPE_ENROLLMENT}
            >
                {selectedInput.type === OUTPUT_TYPE_ENROLLMENT &&
                    renderProgramSelect()}
            </InputOption>
            <InputOption
                dataTest="input-tracked-entity"
                header={getLabelForInputType(OUTPUT_TYPE_TRACKED_ENTITY)}
                description={i18n.t(
                    'See individual tracked entities from one or more Tracker program.'
                )}
                onClick={() =>
                    setSelectedInput({ type: OUTPUT_TYPE_TRACKED_ENTITY })
                }
                selected={selectedInput.type === OUTPUT_TYPE_TRACKED_ENTITY}
            >
                {selectedInput.type === OUTPUT_TYPE_TRACKED_ENTITY &&
                    renderTypeSelect()}
            </InputOption>
        </div>
    )
}

InputPanel.propTypes = {
    visible: PropTypes.bool.isRequired,
}

export { InputPanel, getLabelForInputType }
