import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useProgramDimensions } from '../../../reducers/ui.js'
import { DimensionsList } from '../DimensionsList/index.js'
import { useSelectedDimensions } from '../SelectedDimensionsContext.jsx'

export const ProgramDimensions = ({ searchTerm }) => {
    const programDimensions = useProgramDimensions()
    const { getIsDimensionSelected } = useSelectedDimensions()

    if (!programDimensions) {
        return null
    }

    // Filter dimensions based on search term
    const filteredDimensions = React.useMemo(() => {
        if (!searchTerm) return programDimensions
        return programDimensions.filter((dimension) =>
            dimension.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [programDimensions, searchTerm])

    // Hide component if no results after filtering
    if (filteredDimensions.length === 0) {
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
            hasMore={false}
            onLoadMore={() => {}}
            dataTest="program-dimensions-list"
        />
    )
}
