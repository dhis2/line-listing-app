import { useCachedDataQuery } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { useDebounce } from '../../../modules/utils.js'
import { DimensionsList } from '../DimensionsList/index.js'
import { useYourDimensions } from './useYourDimensions.js'
import styles from './YourDimensionsPanel.module.css'

const YourDimensionsPanel = ({
    visible,
    searchTerm: externalSearchTerm,
    onEmptyStateChange,
}) => {
    const debouncedSearchTerm = useDebounce(externalSearchTerm || '')
    const { currentUser } = useCachedDataQuery()
    const { loading, fetching, error, dimensions, hasMore, loadMore } =
        useYourDimensions({
            visible,
            searchTerm: debouncedSearchTerm,
            nameProp:
                currentUser.settings[
                    DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY
                ],
        })

    if (!visible) {
        return null
    }

    // Check if empty and notify parent
    const isEmpty = !loading && !fetching && dimensions.length === 0
    React.useEffect(() => {
        if (onEmptyStateChange) {
            onEmptyStateChange(isEmpty)
        }
    }, [isEmpty, onEmptyStateChange])

    const draggableDimensions = dimensions.map((dimension) => ({
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
    visible: PropTypes.bool,
    searchTerm: PropTypes.string,
    onEmptyStateChange: PropTypes.func,
}

export { YourDimensionsPanel }
