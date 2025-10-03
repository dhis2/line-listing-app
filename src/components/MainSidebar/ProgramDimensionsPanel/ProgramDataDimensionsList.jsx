import PropTypes from 'prop-types'
import React from 'react'
import { DimensionsList } from '../DimensionsList/index.js'

const ProgramDataDimensionsList = ({
    dimensions = [],
    loading = false,
    fetching = false,
    error = null,
    setIsListEndVisible = () => {},
    program,
    searchTerm,
}) => {

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
            programName={program?.name}
            searchTerm={searchTerm}
            dataTest="program-dimensions-list"
        />
    )
}

ProgramDataDimensionsList.propTypes = {
    dimensions: PropTypes.array,
    loading: PropTypes.bool,
    fetching: PropTypes.bool,
    error: PropTypes.object,
    setIsListEndVisible: PropTypes.func,
    program: PropTypes.object,
    searchTerm: PropTypes.string,
}

export { ProgramDataDimensionsList }
