import PropTypes from 'prop-types'
import React from 'react'
import { PROGRAM_DIMENSIONS } from '../../DndContext.js'
import LoadingMask from '../../LoadingMask/LoadingMask.js'
import { DimensionsList } from '../DimensionsList/index.js'
import { useProgramDimensions } from './useProgramDimensions.js'

const ProgramDimensionsList = ({
    inputType,
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

    if (loading) {
        return <LoadingMask />
    }

    const draggableDimensions = dimensions.map((dimension) => ({
        draggableId: `${PROGRAM_DIMENSIONS}-${dimension.id}`,
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
            listId={PROGRAM_DIMENSIONS}
        />
    )
}

ProgramDimensionsList.propTypes = {
    inputType: PropTypes.string.isRequired,
    program: PropTypes.object.isRequired,
    dimensionType: PropTypes.string,
    searchTerm: PropTypes.string,
    stageId: PropTypes.string,
}

export { ProgramDimensionsList }
