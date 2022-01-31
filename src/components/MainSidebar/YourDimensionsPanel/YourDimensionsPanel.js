import i18n from '@dhis2/d2-i18n'
import { Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useDebounce } from '../../../modules/utils.js'
import { DimensionsList } from '../DimensionsList/index.js'
import { useYourDimensions } from './useYourDimensions.js'
import styles from './YourDimensionsPanel.module.css'

const YourDimensionsPanel = ({ visible, isSelected }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm)
    const { loading, fetching, error, dimensions, setIsListEndVisible } =
        useYourDimensions({
            visible,
            searchTerm: debouncedSearchTerm,
        })

    if (!visible) {
        return null
    }

    return (
        <>
            <div className={styles.search}>
                <Input
                    value={searchTerm}
                    onChange={({ value }) => setSearchTerm(value)}
                    dense
                    placeholder={i18n.t('Search your dimensions')}
                />
            </div>
            <DimensionsList
                setIsListEndVisible={setIsListEndVisible}
                dimensions={dimensions}
                error={error}
                fetching={fetching}
                loading={loading}
                searchTerm={debouncedSearchTerm}
                isSelected={isSelected}
            />
        </>
    )
}

YourDimensionsPanel.propTypes = {
    isSelected: PropTypes.func.isRequired,
    visible: PropTypes.bool,
}

export { YourDimensionsPanel }
