import PropTypes from 'prop-types'
import React from 'react'
import { DimensionsList } from '../DimensionsList/index.js'

const ProgramDataDimensionsList = ({
    dimensions = [],
    loading = false,
    fetching = false,
    error = null,
    hasMore = false,
    onLoadMore = () => {},
    program,
    searchTerm,
}) => {
    const draggableDimensions = dimensions.map((dimension) => ({
        draggableId: `program-${dimension.id}`,
        ...dimension,
    }))

    return (
        <DimensionsList
            onLoadMore={onLoadMore}
            hasMore={hasMore}
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
    error: PropTypes.object,
    fetching: PropTypes.bool,
    hasMore: PropTypes.bool,
    loading: PropTypes.bool,
    onLoadMore: PropTypes.func,
    program: PropTypes.object,
    searchTerm: PropTypes.string,
}

export { ProgramDataDimensionsList }
