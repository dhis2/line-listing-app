import PropTypes from 'prop-types'
import React from 'react'
import { DimensionsList } from '../DimensionsList/index.js'
import { useProgramDataDimensions } from './useProgramDataDimensions.js'

const ProgramDataDimensionsList = ({
    inputType,
    program,
    stageId,
    searchTerm,
    dimensionType,
}) => {
    const { dimensions, loading, fetching, error, setIsListEndVisible } =
        useProgramDataDimensions({
            inputType,
            program,
            stageId,
            searchTerm,
            dimensionType,
        })

    const draggableDimensions = dimensions.map((dimension) => ({
        draggableId: `program-${dimension.id}`,
        ...dimension,
    }))

    return (
        <DimensionsList
            setIsListEndVisible={setIsListEndVisible}
            dimensions={draggableDimensions}
            error={error}
            fetching={fetching}
            loading={loading}
            programName={program.name}
            searchTerm={searchTerm}
            dataTest="program-dimensions-list"
        />
    )
}

ProgramDataDimensionsList.propTypes = {
    inputType: PropTypes.string.isRequired,
    program: PropTypes.object.isRequired,
    dimensionType: PropTypes.string,
    searchTerm: PropTypes.string,
    stageId: PropTypes.string,
}

export { ProgramDataDimensionsList }
