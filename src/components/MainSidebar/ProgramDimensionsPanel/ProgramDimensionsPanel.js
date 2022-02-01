import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, CenteredContent, CircularLoader } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    tSetUiProgram,
    acUpdateUiProgramStage,
    acClearUiProgram,
} from '../../../actions/ui.js'
import { useDebounce } from '../../../modules/utils.js'
import {
    DIMENSION_TYPE_ALL,
    OUTPUT_TYPE_EVENT,
} from '../../../modules/visualization.js'
import {
    sGetUiInputType,
    sGetUiProgramId,
    sGetUiProgramStage,
} from '../../../reducers/ui.js'
import { ProgramDimensionsFilter } from './ProgramDimensionsFilter.js'
import { ProgramDimensionsList } from './ProgramDimensionsList.js'
import styles from './ProgramDimensionsPanel.module.css'
import { ProgramSelect } from './ProgramSelect.js'

export const PROGRAM_TYPE_WITHOUT_REGISTRATION = 'WITHOUT_REGISTRATION'
export const PROGRAM_TYPE_WITH_REGISTRATION = 'WITH_REGISTRATION'

const query = {
    programs: {
        resource: 'programs',
        params: {
            fields: [
                'id',
                'displayName~rename(name)',
                'enrollmentDateLabel',
                'incidentDateLabel',
                'programType',
                'programStages[id,displayName~rename(name),displayExecutionDateLabel,hideDueDate,displayDueDateLabel]',
                'displayIncidentDate',
                'displayIncidentDateLabel',
                'displayEnrollmentDateLabel',
            ],
            paging: false,
        },
    },
}

const ProgramDimensionsPanel = ({ visible }) => {
    const dispatch = useDispatch()
    const inputType = useSelector(sGetUiInputType)
    const selectedProgramId = useSelector(sGetUiProgramId)
    const selectedStageId = useSelector(sGetUiProgramStage)
    const setSelectedProgramId = (programId) =>
        dispatch(
            tSetUiProgram({
                programId,
                metadata: {
                    [programId]: filteredPrograms.find(
                        ({ id }) => id === programId
                    ),
                },
            })
        )
    const { fetching, error, data, refetch, called } = useDataQuery(query, {
        lazy: true,
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [dimensionType, setDimensionType] = useState(DIMENSION_TYPE_ALL)
    const debouncedSearchTerm = useDebounce(searchTerm)
    const filteredPrograms = data?.programs.programs.filter(
        ({ programType }) =>
            inputType === OUTPUT_TYPE_EVENT ||
            programType === PROGRAM_TYPE_WITHOUT_REGISTRATION
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

    useEffect(() => {
        if (visible && !called) {
            refetch()
        }
    }, [visible, called])

    useEffect(() => {
        // Clear everything when user changes input type
        dispatch(acClearUiProgram())
        setSearchTerm('')
        setDimensionType(DIMENSION_TYPE_ALL)
    }, [inputType])

    useEffect(() => {
        if (
            // These only have a single artificial stage
            inputType === OUTPUT_TYPE_EVENT &&
            programType === PROGRAM_TYPE_WITHOUT_REGISTRATION
        ) {
            const artificialStageId = selectedProgram.programStages[0].id
            dispatch(acUpdateUiProgramStage(artificialStageId))
        }
    }, [inputType, programType])

    if (!visible || !called) {
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
            <div className={cx(styles.section, styles.bordered)}>
                <ProgramSelect
                    programs={filteredPrograms}
                    selectedProgram={selectedProgram}
                    setSelectedProgramId={setSelectedProgramId}
                    requiredStageSelection={requiredStageSelection}
                />
            </div>
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
            {isProgramSelectionComplete && (
                <ProgramDimensionsList
                    inputType={inputType}
                    programId={selectedProgramId}
                    programName={selectedProgram.name}
                    dimensionType={dimensionType}
                    searchTerm={debouncedSearchTerm}
                    stageId={selectedStageId}
                />
            )}
        </div>
    )
}

ProgramDimensionsPanel.propTypes = {
    visible: PropTypes.bool.isRequired,
}

export { ProgramDimensionsPanel }
