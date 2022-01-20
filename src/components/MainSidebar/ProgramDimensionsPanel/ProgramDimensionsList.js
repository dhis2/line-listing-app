import PropTypes from 'prop-types'
import React from 'react'
import { DimensionsList } from '../DimensionsList/index.js'
import { useProgramDimensions } from './useProgramDimensions.js'

const ProgramDimensionsList = ({
    inputType,
    programId,
    programName,
    stageId,
    searchTerm,
    dimensionType,
}) => {
    const { dimensions, loading, fetching, error, setIsListEndVisible } =
        useProgramDimensions({
            inputType,
            programId,
            stageId,
            searchTerm,
            dimensionType,
        })

    return (
        <DimensionsList
            setIsListEndVisible={setIsListEndVisible}
            dimensions={dimensions}
            error={error}
            fetching={fetching}
            loading={loading}
            programName={programName}
            searchTerm={searchTerm}
        />
    )
}

ProgramDimensionsList.propTypes = {
    inputType: PropTypes.string.isRequired,
    programId: PropTypes.string.isRequired,
    programName: PropTypes.string.isRequired,
    dimensionType: PropTypes.string,
    searchTerm: PropTypes.string,
    stageId: PropTypes.string,
}

export { ProgramDimensionsList }
