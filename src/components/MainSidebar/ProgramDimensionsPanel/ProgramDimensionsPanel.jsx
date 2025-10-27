import {
    DIMENSION_TYPE_ALL,
    DIMENSION_TYPE_DATA_ELEMENT,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../../../modules/programTypes.js'
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
import { useProgramDimensions } from '../../../reducers/ui.js'
import { ProgramDataDimensionsList } from './ProgramDataDimensionsList.jsx'
import { ProgramDimensions } from './ProgramDimensions.jsx'
import { ProgramDimensionsFilter } from './ProgramDimensionsFilter.jsx'
import styles from './ProgramDimensionsPanel.module.css'
import { ProgramSelect } from './ProgramSelect.jsx'
import { useProgramDataDimensions } from './useProgramDataDimensions.js'

const ProgramDimensionsPanel = ({
    visible,
    searchTerm: externalSearchTerm,
}) => {
    const inputType = useSelector(sGetUiInputType)
    const selectedProgramId = useSelector(sGetUiProgramId)
    const selectedTrackedEntityTypeId = useSelector(sGetUiEntityTypeId)
    const selectedProgram = useSelector((state) =>
        sGetMetadataById(state, selectedProgramId)
    )
    const selectedStageId = useSelector(sGetUiProgramStageId)

    const [stageFilter, setStageFilter] = useState()
    const [dimensionType, setDimensionType] = useState(DIMENSION_TYPE_ALL)
    const debouncedSearchTerm = useDebounce(externalSearchTerm || '')

    // Get program dimensions to check if they have results
    const programDimensions = useProgramDimensions()

    // Check if ProgramDimensions has results
    const hasProgramDimensions = React.useMemo(() => {
        if (!programDimensions) return false
        if (!externalSearchTerm) return programDimensions.length > 0
        return programDimensions.some((dimension) =>
            dimension.name
                .toLowerCase()
                .includes(externalSearchTerm.toLowerCase())
        )
    }, [programDimensions, externalSearchTerm])

    // Get program data dimensions to check if they have results
    const {
        dimensions: programDataDimensions,
        loading: programDataLoading,
        fetching: programDataFetching,
        error: programDataError,
        setIsListEndVisible: programDataSetIsListEndVisible,
    } = useProgramDataDimensions({
        inputType,
        trackedEntityTypeId: selectedTrackedEntityTypeId,
        program: selectedProgram,
        stageId:
            inputType === OUTPUT_TYPE_EVENT
                ? selectedStageId
                : [OUTPUT_TYPE_ENROLLMENT, OUTPUT_TYPE_TRACKED_ENTITY].includes(
                      inputType
                  ) && dimensionType === DIMENSION_TYPE_DATA_ELEMENT
                ? stageFilter
                : undefined,
        searchTerm: debouncedSearchTerm,
        dimensionType,
    })

    // Check if ProgramDataDimensionsList has results
    const hasProgramDataDimensions =
        programDataDimensions && programDataDimensions.length > 0

    // Show divider only if both sections have results
    const showDivider = hasProgramDimensions && hasProgramDataDimensions
    const isProgramSelectionComplete = () => {
        if (inputType === OUTPUT_TYPE_EVENT) {
            return selectedProgram && selectedStageId
        } else if (inputType === OUTPUT_TYPE_ENROLLMENT) {
            return !!selectedProgram
        } else if (inputType === OUTPUT_TYPE_TRACKED_ENTITY) {
            return !!selectedTrackedEntityTypeId
        }
    }

    useEffect(() => {
        setDimensionType(DIMENSION_TYPE_ALL)
        setStageFilter()
    }, [inputType, selectedProgramId, selectedStageId])

    if (!visible) {
        return null
    }

    if ([OUTPUT_TYPE_EVENT, OUTPUT_TYPE_ENROLLMENT].includes(inputType)) {
        let stageId
        if (
            inputType === OUTPUT_TYPE_ENROLLMENT &&
            dimensionType === DIMENSION_TYPE_DATA_ELEMENT
        ) {
            stageId = stageFilter
        } else if (inputType === OUTPUT_TYPE_EVENT) {
            stageId = selectedStageId
        }
        return (
            <div className={styles.container}>
                {isProgramSelectionComplete() ? (
                    <>
                        <div>
                            <ProgramDimensions
                                searchTerm={externalSearchTerm}
                            />
                        </div>
                        {showDivider && <div className={styles.divider}></div>}
                        <div>
                            <ProgramDimensionsFilter
                                program={selectedProgram}
                                searchTerm={externalSearchTerm || ''}
                                setSearchTerm={() => {}}
                                dimensionType={dimensionType}
                                setDimensionType={setDimensionType}
                                stageFilter={stageFilter}
                                setStageFilter={setStageFilter}
                                showProgramAttribute={
                                    selectedProgram.programType ===
                                    PROGRAM_TYPE_WITH_REGISTRATION
                                }
                                hasProgramDataDimensions={
                                    hasProgramDataDimensions
                                }
                            />
                        </div>

                        <ProgramDataDimensionsList
                            dimensions={programDataDimensions}
                            loading={programDataLoading}
                            fetching={programDataFetching}
                            error={programDataError}
                            setIsListEndVisible={programDataSetIsListEndVisible}
                            program={selectedProgram}
                            searchTerm={debouncedSearchTerm}
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
        return (
            <div className={styles.container}>
                {isProgramSelectionComplete() ? (
                    <>
                        <div>
                            <ProgramSelect prefix={i18n.t('Program')} />
                        </div>
                        {selectedProgram && (
                            <>
                                <div>
                                    <ProgramDimensions
                                        searchTerm={externalSearchTerm}
                                    />
                                </div>
                                {showDivider && (
                                    <div className={styles.divider}></div>
                                )}
                                <div className={styles.section}>
                                    <ProgramDimensionsFilter
                                        program={selectedProgram}
                                        searchTerm={externalSearchTerm || ''}
                                        setSearchTerm={() => {}}
                                        dimensionType={dimensionType}
                                        setDimensionType={setDimensionType}
                                        stageFilter={stageFilter}
                                        setStageFilter={setStageFilter}
                                        showProgramAttribute={
                                            selectedProgram.programType ===
                                            PROGRAM_TYPE_WITH_REGISTRATION
                                        }
                                        hasProgramDataDimensions={
                                            hasProgramDataDimensions
                                        }
                                    />
                                </div>

                                <ProgramDataDimensionsList
                                    dimensions={programDataDimensions}
                                    loading={programDataLoading}
                                    fetching={programDataFetching}
                                    error={programDataError}
                                    setIsListEndVisible={
                                        programDataSetIsListEndVisible
                                    }
                                    program={selectedProgram}
                                    searchTerm={debouncedSearchTerm}
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
    searchTerm: PropTypes.string,
}

export { ProgramDimensionsPanel }
