import i18n from '@dhis2/d2-i18n'
import { IconFolder16 } from '@dhis2/ui'
import React from 'react'
import { useMainDimensions } from '../../reducers/ui.js'
import { DimensionsList } from './DimensionsList/index.js'
import { useSelectedDimensions } from './SelectedDimensionsContext.jsx'

export const MainDimensions = ({ searchTerm, onEmptyStateChange }) => {
    const mainDimensions = useMainDimensions()
    const { getIsDimensionSelected } = useSelectedDimensions()
    
    // Filter dimensions based on search term
    const filteredDimensions = React.useMemo(() => {
        if (!searchTerm) return mainDimensions
        return mainDimensions.filter(dimension => 
            dimension.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [mainDimensions, searchTerm])

    // Check if empty and notify parent
    const isEmpty = filteredDimensions.length === 0
    React.useEffect(() => {
        if (onEmptyStateChange) {
            onEmptyStateChange(isEmpty)
        }
    }, [isEmpty, onEmptyStateChange])

    const draggableDimensions = filteredDimensions.map((dimension) => ({
        draggableId: `main-${dimension.id}`,
        ...dimension,
    }))

    return (
        <DimensionsList
            dimensions={draggableDimensions}
            loading={false}
            fetching={false}
            error={null}
            setIsListEndVisible={() => {}}
            dataTest="main-dimensions-list"
        />
    )
}
