import React from 'react'
import PropTypes from 'prop-types'
import { useProgramDimensions } from '../../../reducers/ui.js'
import { DimensionsList } from '../DimensionsList/index.js'
import { useSelectedDimensions } from '../SelectedDimensionsContext.jsx'

const ProgramDimensionsOnly = ({ searchTerm, onEmptyStateChange }) => {
    const programDimensions = useProgramDimensions()
    const { getIsDimensionSelected } = useSelectedDimensions()

    // Filter dimensions based on search term
    const filteredDimensions = React.useMemo(() => {
        if (!programDimensions) return []
        if (!searchTerm) return programDimensions
        return programDimensions.filter(dimension => 
            dimension.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [programDimensions, searchTerm])

    // Check if empty and notify parent
    const isEmpty = !programDimensions || filteredDimensions.length === 0
    React.useEffect(() => {
        if (onEmptyStateChange) {
            onEmptyStateChange(isEmpty)
        }
    }, [isEmpty, onEmptyStateChange])

    if (!programDimensions || filteredDimensions.length === 0) {
        return null
    }

    const draggableDimensions = filteredDimensions.map((dimension) => ({
        draggableId: `program-${dimension.id}`,
        ...dimension,
    }))

    return (
        <DimensionsList
            dimensions={draggableDimensions}
            loading={false}
            fetching={false}
            error={null}
            setIsListEndVisible={() => {}}
            dataTest="program-dimensions-only-list"
        />
    )
}

ProgramDimensionsOnly.propTypes = {
    searchTerm: PropTypes.string,
    onEmptyStateChange: PropTypes.func,
}

export { ProgramDimensionsOnly }
