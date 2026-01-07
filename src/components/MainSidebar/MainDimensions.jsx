import { DIMENSION_TYPE_PERIOD } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { IconFolder16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { DIMENSION_TYPE_USER } from '../../modules/dimensionConstants.js'
import { useMainDimensions } from '../../reducers/ui.js'
import { DimensionsList } from './DimensionsList/index.js'
import { useSelectedDimensions } from './SelectedDimensionsContext.jsx'

// Type filter constants (must match MainSidebar)
const TYPE_FILTER_PERIODS = 'PERIODS'

// Helper function to check if a dimension matches the type filter
// MainDimensions contains: Last updated on (PERIOD), Created by (USER), Last updated by (USER)
const matchesTypeFilter = (dimension, typeFilter) => {
    // If no filter selected, show all
    if (!typeFilter) return true

    const dimensionType = dimension.dimensionType

    switch (typeFilter) {
        case TYPE_FILTER_PERIODS:
            return dimensionType === DIMENSION_TYPE_PERIOD
        // MainDimensions doesn't contain org units, statuses, data elements,
        // program attributes, program indicators, categories, or category option group sets
        default:
            return false
    }
}

export const MainDimensions = ({ searchTerm, typeFilter, onEmptyStateChange }) => {
    const mainDimensions = useMainDimensions()
    const { getIsDimensionSelected } = useSelectedDimensions()

    // Filter dimensions based on search term and type filter
    const filteredDimensions = React.useMemo(() => {
        let filtered = mainDimensions

        // Apply search term filter
        if (searchTerm) {
            filtered = filtered.filter((dimension) =>
                dimension.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Apply type filter
        filtered = filtered.filter((dimension) =>
            matchesTypeFilter(dimension, typeFilter)
        )

        return filtered
    }, [mainDimensions, searchTerm, typeFilter])

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
            hasMore={false}
            onLoadMore={() => {}}
            dataTest="main-dimensions-list"
        />
    )
}

MainDimensions.propTypes = {
    onEmptyStateChange: PropTypes.func,
    searchTerm: PropTypes.string,
    typeFilter: PropTypes.string,
}
