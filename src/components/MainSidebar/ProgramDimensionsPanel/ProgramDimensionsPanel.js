import {
    DIMENSION_TYPE_ALL,
    DIMENSION_TYPE_DATA_ELEMENT,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../../modules/utils.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
} from '../../../modules/visualization.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import {
    sGetUiInputType,
    sGetUiProgramId,
    sGetUiProgramStageId,
} from '../../../reducers/ui.js'
import { ProgramDataDimensionsList } from './ProgramDataDimensionsList.js'
import { ProgramDimensions } from './ProgramDimensions.js'
import { ProgramDimensionsFilter } from './ProgramDimensionsFilter.js'
import styles from './ProgramDimensionsPanel.module.css'

const ProgramDimensionsPanel = ({ visible }) => {
    const inputType = useSelector(sGetUiInputType)
    const selectedProgramId = useSelector(sGetUiProgramId)
    const selectedProgram = useSelector((state) =>
        sGetMetadataById(state, selectedProgramId)
    )
    const selectedStageId = useSelector(sGetUiProgramStageId)

    const [searchTerm, setSearchTerm] = useState('')
    const [stageFilter, setStageFilter] = useState()
    const [dimensionType, setDimensionType] = useState(DIMENSION_TYPE_ALL)
    const debouncedSearchTerm = useDebounce(searchTerm)
    const isProgramSelectionComplete =
        inputType === OUTPUT_TYPE_EVENT
            ? selectedProgram && selectedStageId
            : !!selectedProgram

    useEffect(() => {
        setSearchTerm('')
        setDimensionType(DIMENSION_TYPE_ALL)
        setStageFilter()
    }, [inputType, selectedProgramId, selectedStageId])

    if (!visible) {
        return null
    }

    return (
        <div className={styles.container}>
            {isProgramSelectionComplete ? (
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
                            inputType === OUTPUT_TYPE_ENROLLMENT &&
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
}

ProgramDimensionsPanel.propTypes = {
    visible: PropTypes.bool.isRequired,
}

export { ProgramDimensionsPanel }
