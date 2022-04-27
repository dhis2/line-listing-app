import { useCachedDataQuery } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, CenteredContent, CircularLoader } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { tSetUiProgram } from '../../../actions/ui.js'
import { DIMENSION_TYPE_ALL } from '../../../modules/dimensionConstants.js'
import {
    PROGRAM_TYPE_WITH_REGISTRATION,
    PROGRAM_TYPE_WITHOUT_REGISTRATION,
} from '../../../modules/programTypes.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { useDebounce } from '../../../modules/utils.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
} from '../../../modules/visualization.js'
import {
    sGetUiInputType,
    sGetUiProgramId,
    sGetUiProgramStageId,
} from '../../../reducers/ui.js'
import { ProgramDimensionsFilter } from './ProgramDimensionsFilter.js'
import { ProgramDimensionsList } from './ProgramDimensionsList.js'
import styles from './ProgramDimensionsPanel.module.css'
import { ProgramSelect } from './ProgramSelect.js'

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
        }),
    },
}

const ProgramDimensionsPanel = ({ visible }) => {
    const dispatch = useDispatch()
    const inputType = useSelector(sGetUiInputType)
    const selectedProgramId = useSelector(sGetUiProgramId)
    const selectedStageId = useSelector(sGetUiProgramStageId)
    const { userSettings } = useCachedDataQuery()
    const { fetching, error, data, refetch, called } = useDataQuery(query, {
        lazy: true,
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [dimensionType, setDimensionType] = useState(DIMENSION_TYPE_ALL)
    const debouncedSearchTerm = useDebounce(searchTerm)
    const filteredPrograms = data?.programs.programs.filter(
        ({ programType }) =>
            !(
                inputType === OUTPUT_TYPE_ENROLLMENT &&
                programType === PROGRAM_TYPE_WITHOUT_REGISTRATION
            )
    )
    const selectedProgram =
        selectedProgramId &&
        filteredPrograms?.find(({ id }) => id === selectedProgramId)
    const programType = selectedProgram?.programType
    const requiredStageSelection =
        inputType === OUTPUT_TYPE_EVENT &&
        programType === PROGRAM_TYPE_WITH_REGISTRATION
    const isProgramSelectionComplete =
        inputType === OUTPUT_TYPE_EVENT
            ? selectedProgram && selectedStageId
            : !!selectedProgram
    const setSelectedProgramId = (programId) => {
        if (programId !== selectedProgramId) {
            const program = filteredPrograms?.find(({ id }) => id === programId)
            const stage =
                // auto-select if a program only has a single stage
                program?.programStages.length === 1
                    ? program.programStages[0]
                    : undefined
            dispatch(tSetUiProgram({ program, stage }))
        }
    }

    useEffect(() => {
        if (visible && !called) {
            refetch({
                nameProp:
                    userSettings[DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY],
            })
        }
    }, [visible, called])

    useEffect(() => {
        setSearchTerm('')
        setDimensionType(DIMENSION_TYPE_ALL)
    }, [inputType, selectedProgramId])

    if (!called) {
        return null
    }

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

    if (fetching) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    return (
        <div className={styles.container}>
            {visible && (
                <div className={cx(styles.section, styles.bordered)}>
                    <ProgramSelect
                        programs={filteredPrograms}
                        selectedProgram={selectedProgram}
                        setSelectedProgramId={setSelectedProgramId}
                        requiredStageSelection={requiredStageSelection}
                    />
                </div>
            )}
            {visible && (
                <div
                    className={cx(styles.section, {
                        [styles.bordered]: !!selectedProgramId,
                    })}
                >
                    {isProgramSelectionComplete ? (
                        <ProgramDimensionsFilter
                            program={selectedProgram}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            dimensionType={dimensionType}
                            setDimensionType={setDimensionType}
                        />
                    ) : (
                        <div className={styles.helptext}>
                            {requiredStageSelection
                                ? i18n.t(
                                      'Choose a program and stage above to add program dimensions.'
                                  )
                                : i18n.t(
                                      'Choose a program above to add program dimensions.'
                                  )}
                        </div>
                    )}
                </div>
            )}
            {isProgramSelectionComplete && (
                <ProgramDimensionsList
                    inputType={inputType}
                    program={selectedProgram}
                    dimensionType={dimensionType}
                    searchTerm={debouncedSearchTerm}
                    stageId={selectedStageId}
                    visible={visible}
                />
            )}
        </div>
    )
}

ProgramDimensionsPanel.propTypes = {
    visible: PropTypes.bool.isRequired,
}

export { ProgramDimensionsPanel }
