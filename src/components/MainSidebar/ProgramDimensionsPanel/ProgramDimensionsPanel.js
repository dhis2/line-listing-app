import {
    DIMENSION_TYPE_ALL,
    DIMENSION_TYPE_DATA_ELEMENT,
    useCachedDataQuery,
} from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tSetUiProgram } from '../../../actions/ui.js'
import {
    PROGRAM_TYPE_WITHOUT_REGISTRATION,
    PROGRAM_TYPE_WITH_REGISTRATION,
} from '../../../modules/programTypes.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { useDebounce } from '../../../modules/utils.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import {
    sGetUiEntityTypeId,
    sGetUiInputType,
    sGetUiProgramId,
    sGetUiProgramStageId,
} from '../../../reducers/ui.js'
import { ProgramDataDimensionsList } from './ProgramDataDimensionsList.js'
import { ProgramDimensions } from './ProgramDimensions.js'
import { ProgramDimensionsFilter } from './ProgramDimensionsFilter.js'
import styles from './ProgramDimensionsPanel.module.css'
import { ProgramSelect } from './ProgramSelect.js'

const ProgramDimensionsPanel = ({ visible }) => {
    const dispatch = useDispatch()
    const inputType = useSelector(sGetUiInputType)
    const selectedProgramId = useSelector(sGetUiProgramId)
    const selectedEntityTypeId = useSelector(sGetUiEntityTypeId)
    const selectedProgram = useSelector((state) =>
        sGetMetadataById(state, selectedProgramId)
    )
    const selectedStageId = useSelector(sGetUiProgramStageId)

    const [searchTerm, setSearchTerm] = useState('')
    const [stageFilter, setStageFilter] = useState()
    const [dimensionType, setDimensionType] = useState(DIMENSION_TYPE_ALL)
    const debouncedSearchTerm = useDebounce(searchTerm)
    const isProgramSelectionComplete = () => {
        if (inputType === OUTPUT_TYPE_EVENT) {
            return selectedProgram && selectedStageId
        } else if (inputType === OUTPUT_TYPE_ENROLLMENT) {
            return !!selectedProgram
        } else if (inputType === OUTPUT_TYPE_TRACKED_ENTITY) {
            return !!selectedEntityTypeId
        }
    }

    useEffect(() => {
        setSearchTerm('')
        setDimensionType(DIMENSION_TYPE_ALL)
        setStageFilter()
    }, [inputType, selectedProgramId, selectedStageId])

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
    const { currentUser } = useCachedDataQuery()
    const { data, refetch, called } = useDataQuery(query, {
        lazy: true,
    })
    // FIXME: the fetching should be consolidated with the fetching in InputPanel and not be duplicated like this

    useEffect(() => {
        if (visible && !called) {
            refetch({
                nameProp:
                    currentUser.settings[
                        DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY
                    ],
            })
        }
    }, [visible, called, refetch])

    if (!visible) {
        return null
    }

    if ([OUTPUT_TYPE_EVENT, OUTPUT_TYPE_ENROLLMENT].includes(inputType)) {
        return (
            <div className={styles.container}>
                {isProgramSelectionComplete() ? (
                    <>
                        <div>
                            <ProgramDimensions />
                        </div>
                        <div className={styles.section}>
                            <ProgramDimensionsFilter
                                program={selectedProgram}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                dimensionType={dimensionType}
                                setDimensionType={setDimensionType}
                                stageFilter={stageFilter}
                                setStageFilter={setStageFilter}
                                showProgramAttribute={
                                    selectedProgram.programType ===
                                    PROGRAM_TYPE_WITH_REGISTRATION
                                }
                            />
                        </div>

                        <ProgramDataDimensionsList
                            inputType={inputType}
                            program={selectedProgram}
                            dimensionType={dimensionType}
                            searchTerm={debouncedSearchTerm}
                            stageId={
                                [
                                    OUTPUT_TYPE_ENROLLMENT,
                                    OUTPUT_TYPE_TRACKED_ENTITY,
                                ].includes(inputType) ===
                                    OUTPUT_TYPE_ENROLLMENT &&
                                dimensionType === DIMENSION_TYPE_DATA_ELEMENT
                                    ? stageFilter
                                    : inputType === OUTPUT_TYPE_EVENT
                                    ? selectedStageId
                                    : undefined
                            }
                        />
                    </>
                ) : (
                    <div className={styles.helptext}>
                        {i18n.t(
                            'Choose an input to get started adding program dimensions.'
                        )}
                    </div>
                )}
            </div>
        )
    } else if (inputType === OUTPUT_TYPE_TRACKED_ENTITY) {
        const filteredPrograms = data?.programs.programs.filter(
            ({ programType }) =>
                programType !== PROGRAM_TYPE_WITHOUT_REGISTRATION
        )
        const setSelectedProgramId = (programId) => {
            if (programId !== selectedProgramId) {
                const program = filteredPrograms?.find(
                    ({ id }) => id === programId
                )
                dispatch(tSetUiProgram({ program }))
            }
        }

        return (
            <div className={styles.container}>
                {isProgramSelectionComplete() ? (
                    <>
                        <div className={cx(styles.section, styles.bordered)}>
                            <ProgramSelect
                                programs={filteredPrograms}
                                selectedProgram={selectedProgram}
                                setSelectedProgramId={setSelectedProgramId}
                                prefix={i18n.t('Program')}
                            />
                        </div>
                        {selectedProgram && (
                            <>
                                <div>
                                    <ProgramDimensions />
                                </div>
                                <div className={styles.section}>
                                    <ProgramDimensionsFilter
                                        program={selectedProgram}
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                        dimensionType={dimensionType}
                                        setDimensionType={setDimensionType}
                                        stageFilter={stageFilter}
                                        setStageFilter={setStageFilter}
                                    />
                                </div>

                                <ProgramDataDimensionsList
                                    inputType={inputType}
                                    program={selectedProgram}
                                    dimensionType={dimensionType}
                                    searchTerm={debouncedSearchTerm}
                                    stageId={
                                        [
                                            OUTPUT_TYPE_ENROLLMENT,
                                            OUTPUT_TYPE_TRACKED_ENTITY,
                                        ].includes(inputType) &&
                                        dimensionType ===
                                            DIMENSION_TYPE_DATA_ELEMENT
                                            ? stageFilter
                                            : inputType === OUTPUT_TYPE_EVENT
                                            ? selectedStageId
                                            : undefined
                                    }
                                />
                            </>
                        )}
                    </>
                ) : (
                    <div className={styles.helptext}>
                        {i18n.t(
                            'Choose an input to get started adding program dimensions.'
                        )}
                    </div>
                )}
            </div>
        )
    }
}

ProgramDimensionsPanel.propTypes = {
    visible: PropTypes.bool.isRequired,
}

export { ProgramDimensionsPanel }
