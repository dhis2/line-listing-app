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

const YourDimensionsPanel = ({ visible }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm)
    const { currentUser } = useCachedDataQuery()
    const { loading, fetching, error, dimensions, setIsListEndVisible } =
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

    const draggableDimensions = dimensions.map((dimension) => ({
        draggableId: `your-${dimension.id}`,
        ...dimension,
    }))

    return (
        <>
            <div className={styles.search}>
                <Input
                    value={searchTerm}
                    onChange={({ value }) => setSearchTerm(value)}
                    dense
                    placeholder={i18n.t('Search your dimensions')}
                    type="search"
                    dataTest="search-dimension-input"
                />
            </div>
            <DimensionsList
                setIsListEndVisible={setIsListEndVisible}
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
}

export { YourDimensionsPanel }
