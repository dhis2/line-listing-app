import PropTypes from 'prop-types'
import React from 'react'
import { DimensionsList } from '../DimensionsList/index.js'
import { useProgramDimensions } from './useProgramDimensions.js'

const ProgramDimensionsList = ({
    inputType,
    isSelected,
    program,
    stageId,
    searchTerm,
    dimensionType,
}) => {
    const { dimensions, loading, fetching, error, setIsListEndVisible } =
        useProgramDimensions({
            inputType,
            program,
            stageId,
            searchTerm,
            dimensionType,
        })

    return (
        <DimensionsList
            setIsListEndVisible={setIsListEndVisible}
            dimensions={dimensions}
            isSelected={isSelected}
            error={error}
            fetching={fetching}
            loading={loading}
            programName={program.name}
            searchTerm={searchTerm}
        />
    )
}

ProgramDimensionsList.propTypes = {
    inputType: PropTypes.string.isRequired,
    isSelected: PropTypes.func.isRequired,
    program: PropTypes.object.isRequired,
    dimensionType: PropTypes.string,
    searchTerm: PropTypes.string,
    stageId: PropTypes.string,
}

export { ProgramDimensionsList }
