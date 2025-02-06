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
import { ProgramDataDimensionsList } from './ProgramDataDimensionsList.jsx'
import { ProgramDimensions } from './ProgramDimensions.jsx'
import { ProgramDimensionsFilter } from './ProgramDimensionsFilter.jsx'
import styles from './ProgramDimensionsPanel.module.css'
import { ProgramSelect } from './ProgramSelect.jsx'

const ProgramDimensionsPanel = ({ visible }) => {
    const inputType = useSelector(sGetUiInputType)
    const selectedProgramId = useSelector(sGetUiProgramId)
    const selectedTrackedEntityTypeId = useSelector(sGetUiEntityTypeId)
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
            return !!selectedTrackedEntityTypeId
        }
    }

    useEffect(() => {
        setSearchTerm('')
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
                            stageId={stageId}
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
                        <div className={cx(styles.section, styles.bordered)}>
                            <ProgramSelect prefix={i18n.t('Program')} />
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
                                        dimensionType ===
                                        DIMENSION_TYPE_DATA_ELEMENT
                                            ? stageFilter
                                            : undefined
                                    }
                                    trackedEntityTypeId={
                                        selectedTrackedEntityTypeId
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
