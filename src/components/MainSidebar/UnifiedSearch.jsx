import i18n from '@dhis2/d2-i18n'
import { Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useDebounce } from '../../modules/utils.js'
import styles from './UnifiedSearch.module.css'

const UnifiedSearch = ({ onSearchChange }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const debouncedSearchTerm = useDebounce(searchTerm)

    React.useEffect(() => {
        onSearchChange(debouncedSearchTerm)
    }, [debouncedSearchTerm, onSearchChange])

    const isActive = isFocused || searchTerm.length > 0

    return (
        <div className={styles.container}>
            <Input
                value={searchTerm}
                onChange={({ value }) => setSearchTerm(value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                dense
                placeholder={i18n.t('Search all dimensions')}
                type="search"
                dataTest="unified-search-input"
                className={isActive ? styles.active : styles.inactive}
            />
        </div>
    )
}

UnifiedSearch.propTypes = {
    onSearchChange: PropTypes.func.isRequired,
}

export { UnifiedSearch }
