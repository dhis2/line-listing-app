import { useCachedDataQuery } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useMemo } from 'react'
import { CARD_TYPE_OTHER } from '../../../modules/paginationConfig.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { useDebounce } from '../../../modules/utils.js'
import { usePaginationConfig } from '../../PaginationConfigContext.jsx'
import { DimensionsList } from '../DimensionsList/index.js'
import { useYourDimensions } from './useYourDimensions.js'
import styles from './YourDimensionsPanel.module.css'

// Type filter constants (must match MainSidebar)
const TYPE_FILTER_CATEGORY_OPTION_GROUP_SETS = 'CATEGORY_OPTION_GROUP_SETS'

// Helper function to check if a dimension matches the type filter
// YourDimensionsPanel contains: ORGANISATION_UNIT_GROUP_SET dimensions
const matchesTypeFilter = (dimension, typeFilter) => {
    // If no filter selected, show all
    if (!typeFilter) return true

    // YourDimensionsPanel only contains ORGANISATION_UNIT_GROUP_SET dimensions
    // which correspond to the CATEGORY_OPTION_GROUP_SETS filter type
    // (both are "group set" type dimensions)
    switch (typeFilter) {
        case TYPE_FILTER_CATEGORY_OPTION_GROUP_SETS:
            // ORGANISATION_UNIT_GROUP_SET dimensions match this filter
            return dimension.dimensionType === 'ORGANISATION_UNIT_GROUP_SET'
        // YourDimensionsPanel doesn't contain org units, periods, statuses,
        // data elements, program attributes, program indicators, or categories
        default:
            return false
    }
}

const YourDimensionsPanel = ({
    visible,
    searchTerm: externalSearchTerm,
    typeFilter,
    onEmptyStateChange,
}) => {
    const debouncedSearchTerm = useDebounce(externalSearchTerm || '')
    const { currentUser } = useCachedDataQuery()
    const { getPageSize } = usePaginationConfig()
    const pageSize = getPageSize(CARD_TYPE_OTHER)
    const { loading, fetching, error, dimensions, hasMore, loadMore } =
        useYourDimensions({
            visible,
            searchTerm: debouncedSearchTerm,
            nameProp:
                currentUser.settings[
                    DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY
                ],
            pageSize,
        })

    if (!visible) {
        return null
    }

    // Filter dimensions based on type filter
    const filteredDimensions = useMemo(() => {
        if (!dimensions) return []
        return dimensions.filter((dimension) =>
            matchesTypeFilter(dimension, typeFilter)
        )
    }, [dimensions, typeFilter])

    // Check if empty and notify parent
    const isEmpty = !loading && !fetching && filteredDimensions.length === 0
    React.useEffect(() => {
        if (onEmptyStateChange) {
            onEmptyStateChange(isEmpty)
        }
    }, [isEmpty, onEmptyStateChange])

    const draggableDimensions = filteredDimensions.map((dimension) => ({
        draggableId: `your-${dimension.id}`,
        ...dimension,
    }))

    return (
        <>
            <DimensionsList
                onLoadMore={loadMore}
                hasMore={hasMore}
                dimensions={draggableDimensions}
                error={error}
                fetching={fetching}
                loading={loading}
                searchTerm={debouncedSearchTerm}
                dataTest="your-dimensions-list"
            />
        </>
    )
}

YourDimensionsPanel.propTypes = {
    onEmptyStateChange: PropTypes.func,
    searchTerm: PropTypes.string,
    typeFilter: PropTypes.string,
    visible: PropTypes.bool,
}

export { YourDimensionsPanel }
