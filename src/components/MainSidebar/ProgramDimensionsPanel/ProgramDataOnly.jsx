import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import {
    DIMENSION_TYPE_ALL,
    DIMENSION_TYPE_DATA_ELEMENT,
} from '@dhis2/analytics'
import {
    sGetUiInputType,
    sGetUiProgramId,
    sGetUiEntityTypeId,
    sGetUiProgramStageId,
} from '../../../reducers/ui.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { useDebounce } from '../../../modules/utils.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'
import { ProgramDimensionsFilter } from './ProgramDimensionsFilter.jsx'
import { ProgramDataDimensionsList } from './ProgramDataDimensionsList.jsx'
import { useProgramDataDimensions } from './useProgramDataDimensions.js'
import styles from './ProgramDimensionsPanel.module.css'

const ProgramDataOnly = ({ searchTerm }) => {
    const inputType = useSelector(sGetUiInputType)
    const programId = useSelector(sGetUiProgramId)
    const entityTypeId = useSelector(sGetUiEntityTypeId)
    const selectedProgram = useSelector((state) =>
        sGetMetadataById(state, programId)
    )
    const selectedStageId = useSelector(sGetUiProgramStageId)

    const [stageFilter, setStageFilter] = useState()
    const [dimensionType, setDimensionType] = useState(DIMENSION_TYPE_ALL)
    const debouncedSearchTerm = useDebounce(searchTerm || '')

    // Check if program selection is complete based on input type
    const isProgramSelectionComplete = () => {
        if (inputType === OUTPUT_TYPE_EVENT) {
            return !!(selectedProgram && selectedStageId)
        } else if (inputType === OUTPUT_TYPE_ENROLLMENT) {
            return !!selectedProgram
        } else if (inputType === OUTPUT_TYPE_TRACKED_ENTITY) {
            return !!entityTypeId
        }
        return false
    }

    // Call the hook - it now has internal guards to prevent API calls when params are missing
    const {
        dimensions: programDataDimensions,
        loading,
        fetching,
        error,
        hasMore,
        loadMore,
    } = useProgramDataDimensions({
        inputType,
        trackedEntityTypeId: entityTypeId,
        program: selectedProgram,
        stageId:
            inputType === OUTPUT_TYPE_EVENT
                ? selectedStageId
                : inputType === OUTPUT_TYPE_ENROLLMENT &&
                  dimensionType === DIMENSION_TYPE_DATA_ELEMENT
                ? stageFilter
                : undefined,
        searchTerm: debouncedSearchTerm,
        dimensionType,
    })

    const hasProgramDataDimensions =
        isProgramSelectionComplete() &&
        programDataDimensions &&
        programDataDimensions.length > 0

    return (
        <div className={styles.container}>
            {isProgramSelectionComplete() && (
                <>
                    <div>
                        <ProgramDimensionsFilter
                            program={selectedProgram}
                            searchTerm={searchTerm || ''}
                            setSearchTerm={() => {}}
                            dimensionType={dimensionType}
                            setDimensionType={setDimensionType}
                            stageFilter={stageFilter}
                            setStageFilter={setStageFilter}
                            hasProgramDataDimensions={hasProgramDataDimensions}
                        />
                    </div>
                    <ProgramDataDimensionsList
                        dimensions={programDataDimensions}
                        loading={loading}
                        fetching={fetching}
                        error={error}
                        hasMore={hasMore}
                        onLoadMore={loadMore}
                        program={selectedProgram}
                        searchTerm={debouncedSearchTerm}
                    />
                </>
            )}
        </div>
    )
}

ProgramDataOnly.propTypes = {
    searchTerm: PropTypes.string,
}

export { ProgramDataOnly }
