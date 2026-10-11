import i18n from '@dhis2/d2-i18n'
import { IconSearch16, Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useDebounce } from '../../modules/utils.js'
import styles from './UnifiedSearch.module.css'

const CollapseIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M8 3V4H2V3H8Z" fill="#4A5768" />
        <path d="M8 6V7H2V6H8Z" fill="#4A5768" />
        <path d="M8 9V10H2V9H8Z" fill="#4A5768" />
        <path d="M8 12V13H2V12H8Z" fill="#4A5768" />
        <path
            d="M14.4141 4.70703L12.207 6.91406L10 4.70703L10.707 4L12.207 5.5L13.707 4L14.4141 4.70703Z"
            fill="#4A5768"
        />
        <path
            d="M14.4141 11.707L13.707 12.4141L12.207 10.9141L10.707 12.4141L10 11.707L12.207 9.5L14.4141 11.707Z"
            fill="#4A5768"
        />
    </svg>
)

const ExpandIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M8 3V4H2V3H8Z" fill="#4A5768" />
        <path d="M8 6V7H2V6H8Z" fill="#4A5768" />
        <path d="M8 9V10H2V9H8Z" fill="#4A5768" />
        <path d="M8 12V13H2V12H8Z" fill="#4A5768" />
        <path
            d="M14.4141 6.20703L12.207 4L10 6.20703L10.707 6.91406L12.207 5.41406L13.707 6.91406L14.4141 6.20703Z"
            fill="#4A5768"
        />
        <path
            d="M14.4141 10.207L13.707 9.5L12.207 11L10.707 9.5L10 10.207L12.207 12.4141L14.4141 10.207Z"
            fill="#4A5768"
        />
    </svg>
)

const UnifiedSearch = ({ onSearchChange, onCollapseAll, hasExpandedCards }) => {
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
                    title={
                        hasExpandedCards
                            ? i18n.t('Collapse all cards')
                            : i18n.t('Expand all cards')
                    }
                >
                    {hasExpandedCards ? <CollapseIcon /> : <ExpandIcon />}
                </button>
            </div>
        </div>
    )
}

UnifiedSearch.propTypes = {
    onSearchChange: PropTypes.func.isRequired,
    onCollapseAll: PropTypes.func.isRequired,
    hasExpandedCards: PropTypes.bool.isRequired,
}

export { UnifiedSearch }
