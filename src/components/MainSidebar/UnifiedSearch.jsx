import i18n from '@dhis2/d2-i18n'
import { IconSearch16, Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useDebounce } from '../../modules/utils.js'
import styles from './UnifiedSearch.module.css'

const UnifiedSearch = ({ onSearchChange, onCollapseAll }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const debouncedSearchTerm = useDebounce(searchTerm)

    React.useEffect(() => {
        onSearchChange(debouncedSearchTerm)
    }, [debouncedSearchTerm, onSearchChange])

    const isActive = isFocused || searchTerm.length > 0

    return (
        <div className={styles.container}>
            <div className={styles.searchRow}>
                <Input
                    value={searchTerm}
                    onChange={({ value }) => setSearchTerm(value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    dense
                    prefixIcon={<IconSearch16 />}
                    placeholder={i18n.t('Search all dimensions')}
                    type="search"
                    dataTest="unified-search-input"
                    className={isActive ? styles.active : styles.inactive}
                />
                <button
                    className={styles.ghostButton}
                    onClick={onCollapseAll}
                    data-test="collapse-all-cards-button"
                    title={i18n.t('Collapse all cards')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path d="M10.896 2H8.75V.75a.75.75 0 0 0-1.5 0V2H5.104a.25.25 0 0 0-.177.427l2.896 2.896a.25.25 0 0 0 .354 0l2.896-2.896A.25.25 0 0 0 10.896 2ZM8.75 15.25a.75.75 0 0 1-1.5 0V14H5.104a.25.25 0 0 1-.177-.427l2.896-2.896a.25.25 0 0 1 .354 0l2.896 2.896a.25.25 0 0 1-.177.427H8.75v1.25Zm-6.5-6.5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 6 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 12 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z"></path>
                    </svg>
                </button>
            </div>
        </div>
    )
}

UnifiedSearch.propTypes = {
    onSearchChange: PropTypes.func.isRequired,
    onCollapseAll: PropTypes.func.isRequired,
}

export { UnifiedSearch }
