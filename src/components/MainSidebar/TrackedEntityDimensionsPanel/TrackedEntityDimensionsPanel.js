import { useCachedDataQuery } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { useDebounce } from '../../../modules/utils.js'
import { sGetUiEntityTypeId } from '../../../reducers/ui.js'
import { DimensionsList } from '../DimensionsList/index.js'
import styles from './TrackedEntityDimensionsPanel.module.css'
import { useTrackedEntityDimensions } from './useTrackedEntityDimensions.js'

const TrackedEntityDimensionsPanel = ({ visible }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const selectedEntityTypeId = useSelector(sGetUiEntityTypeId)
    const debouncedSearchTerm = useDebounce(searchTerm)
    const { currentUser } = useCachedDataQuery()
    const { loading, fetching, error, dimensions, setIsListEndVisible } =
        useTrackedEntityDimensions({
            visible,
            searchTerm: debouncedSearchTerm,
            nameProp:
                currentUser.settings[
                    DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY
                ],
            id: selectedEntityTypeId,
        })

    if (!visible) {
        return null
    }

    const draggableDimensions = dimensions.map((dimension) => ({
        draggableId: `tracked-entity-${dimension.id}`,
        ...dimension,
    }))

    return (
        <>
            <div className={styles.search}>
                <Input
                    value={searchTerm}
                    onChange={({ value }) => setSearchTerm(value)}
                    dense
                    placeholder={i18n.t('Search dimensions')}
                    type={'search'}
                    dataTest={'search-te-dimension-input'}
                />
            </div>
            <DimensionsList
                setIsListEndVisible={setIsListEndVisible}
                dimensions={draggableDimensions}
                error={error}
                fetching={fetching}
                loading={loading}
                searchTerm={debouncedSearchTerm}
                dataTest="tracked-entity-dimensions"
            />
        </>
    )
}

TrackedEntityDimensionsPanel.propTypes = {
    visible: PropTypes.bool,
}

export { TrackedEntityDimensionsPanel }
