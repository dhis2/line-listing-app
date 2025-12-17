import i18n from '@dhis2/d2-i18n'
import {
    IconSearch16,
    IconFilter16,
    Input,
    IconChevronDown16,
    IconCross16,
    FlyoutMenu,
    MenuItem,
    Layer,
    Popper,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
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

// Placeholder 16px icon for mode toggle (TODO: replace with actual icon)
const ModeToggleIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M14 2V7H2V2H14ZM3 6H13V3H3V6Z" fill="#4A5768" />
        <path d="M14 8V13H2V8H14ZM3 12H13V9H3V12Z" fill="#4A5768" />
        <path d="M4 4H6V5H4V4Z" fill="#4A5768" />
        <path d="M4 10H6V11H4V10Z" fill="#4A5768" />
        <path d="M8 4H12V5H8V4Z" fill="#4A5768" />
        <path d="M8 10H12V11H8V10Z" fill="#4A5768" />
    </svg>
)

const UnifiedSearch = ({
    onSearchChange,
    onCollapseAll,
    hasExpandedCards,
    viewMode,
    onViewModeChange,
    typeFilter,
    onTypeFilterChange,
    showModeToggle,
    showTypeFilter,
    isScrolled,
}) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const [isModeMenuOpen, setIsModeMenuOpen] = useState(false)
    const [isTypeFilterMenuOpen, setIsTypeFilterMenuOpen] = useState(false)
    const debouncedSearchTerm = useDebounce(searchTerm)

    const modeButtonRef = useRef(null)
    const typeFilterButtonRef = useRef(null)

    React.useEffect(() => {
        onSearchChange(debouncedSearchTerm)
    }, [debouncedSearchTerm, onSearchChange])

    const isActive = isFocused || searchTerm.length > 0

    const handleModeMenuToggle = () => {
        setIsModeMenuOpen(!isModeMenuOpen)
    }

    const handleTypeFilterMenuToggle = () => {
        setIsTypeFilterMenuOpen(!isTypeFilterMenuOpen)
    }

    const handleModeSelect = (mode) => {
        onViewModeChange(mode)
        setIsModeMenuOpen(false)
    }

    const handleTypeFilterSelect = (filterValue) => {
        onTypeFilterChange(filterValue)
        setIsTypeFilterMenuOpen(false)
    }

    const handleClearFilter = () => {
        onTypeFilterChange(null)
        setIsTypeFilterMenuOpen(false)
    }

    const getTypeFilterLabel = (filterValue) => {
        const labels = {
            ORG_UNITS: i18n.t('Org units'),
            PERIODS: i18n.t('Periods'),
            STATUSES: i18n.t('Statuses'),
            DATA_ELEMENTS: i18n.t('Data elements'),
            PROGRAM_ATTRIBUTES: i18n.t('Program attributes'),
            PROGRAM_INDICATORS: i18n.t('Program indicators'),
            CATEGORIES: i18n.t('Categories'),
            CATEGORY_OPTION_GROUP_SETS: i18n.t('Category option group sets'),
        }
        return labels[filterValue] || filterValue
    }

    const hasFilter = typeFilter !== null

    return (
        <div
            className={`${styles.container} ${
                isScrolled ? styles.scrolled : ''
            }`}
        >
            <div className={styles.searchRow}>
                <Input
                    value={searchTerm}
                    onChange={({ value }) => setSearchTerm(value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    dense
                    prefixIcon={<IconSearch16 />}
                    placeholder={i18n.t('Search')}
                    type="search"
                    dataTest="unified-search-input"
                    className={isActive ? styles.active : styles.inactive}
                />

                {/* Type filter: dropdown button or applied filter chip */}
                {showTypeFilter && (
                    <>
                        {!hasFilter ? (
                            /* No filter applied - show dropdown button */
                            <button
                                ref={typeFilterButtonRef}
                                className={styles.filterDropdownButton}
                                onClick={handleTypeFilterMenuToggle}
                                data-test="type-filter-button"
                                title={i18n.t('Filter by type')}
                            >
                                <IconFilter16 />
                                <span className={styles.filterButtonText}>
                                    {i18n.t('Filter')}
                                </span>
                            </button>
                        ) : (
                            /* Filter applied - show chip */
                            <div
                                ref={typeFilterButtonRef}
                                className={styles.filterChip}
                                data-test="type-filter-chip"
                            >
                                <button
                                    className={styles.filterChipLabel}
                                    onClick={handleTypeFilterMenuToggle}
                                    title={i18n.t('Change filter')}
                                >
                                    <IconFilter16 />
                                    <span
                                        className={styles.filterChipLabelText}
                                    >
                                        {getTypeFilterLabel(typeFilter)}
                                    </span>
                                </button>
                                <button
                                    className={styles.filterChipClear}
                                    onClick={handleClearFilter}
                                    title={i18n.t('Clear filter')}
                                    data-test="type-filter-clear"
                                >
                                    <IconCross16 />
                                </button>
                            </div>
                        )}

                        {isTypeFilterMenuOpen && (
                            <Layer
                                onBackdropClick={() =>
                                    setIsTypeFilterMenuOpen(false)
                                }
                            >
                                <Popper
                                    reference={typeFilterButtonRef.current}
                                    placement="bottom-end"
                                >
                                    <FlyoutMenu dense>
                                        <MenuItem
                                            label={i18n.t('Org units')}
                                            onClick={() =>
                                                handleTypeFilterSelect(
                                                    'ORG_UNITS'
                                                )
                                            }
                                            active={typeFilter === 'ORG_UNITS'}
                                            dataTest="type-filter-org-units"
                                        />
                                        <MenuItem
                                            label={i18n.t('Periods')}
                                            onClick={() =>
                                                handleTypeFilterSelect(
                                                    'PERIODS'
                                                )
                                            }
                                            active={typeFilter === 'PERIODS'}
                                            dataTest="type-filter-periods"
                                        />
                                        <MenuItem
                                            label={i18n.t('Statuses')}
                                            onClick={() =>
                                                handleTypeFilterSelect(
                                                    'STATUSES'
                                                )
                                            }
                                            active={typeFilter === 'STATUSES'}
                                            dataTest="type-filter-statuses"
                                        />
                                        <MenuItem
                                            label={i18n.t('Data elements')}
                                            onClick={() =>
                                                handleTypeFilterSelect(
                                                    'DATA_ELEMENTS'
                                                )
                                            }
                                            active={
                                                typeFilter === 'DATA_ELEMENTS'
                                            }
                                            dataTest="type-filter-data-elements"
                                        />
                                        <MenuItem
                                            label={i18n.t('Program attributes')}
                                            onClick={() =>
                                                handleTypeFilterSelect(
                                                    'PROGRAM_ATTRIBUTES'
                                                )
                                            }
                                            active={
                                                typeFilter ===
                                                'PROGRAM_ATTRIBUTES'
                                            }
                                            dataTest="type-filter-program-attributes"
                                        />
                                        <MenuItem
                                            label={i18n.t('Program indicators')}
                                            onClick={() =>
                                                handleTypeFilterSelect(
                                                    'PROGRAM_INDICATORS'
                                                )
                                            }
                                            active={
                                                typeFilter ===
                                                'PROGRAM_INDICATORS'
                                            }
                                            dataTest="type-filter-program-indicators"
                                        />
                                        <MenuItem
                                            label={i18n.t('Categories')}
                                            onClick={() =>
                                                handleTypeFilterSelect(
                                                    'CATEGORIES'
                                                )
                                            }
                                            active={typeFilter === 'CATEGORIES'}
                                            dataTest="type-filter-categories"
                                        />
                                        <MenuItem
                                            label={i18n.t(
                                                'Category option group sets'
                                            )}
                                            onClick={() =>
                                                handleTypeFilterSelect(
                                                    'CATEGORY_OPTION_GROUP_SETS'
                                                )
                                            }
                                            active={
                                                typeFilter ===
                                                'CATEGORY_OPTION_GROUP_SETS'
                                            }
                                            dataTest="type-filter-category-option-group-sets"
                                        />
                                    </FlyoutMenu>
                                </Popper>
                            </Layer>
                        )}
                    </>
                )}

                {/* Mode toggle button */}
                {showModeToggle && (
                    <>
                        <button
                            ref={modeButtonRef}
                            className={styles.ghostButton}
                            onClick={handleModeMenuToggle}
                            data-test="mode-toggle-button"
                            title={
                                viewMode === 'BY_TYPE'
                                    ? i18n.t('Group by data type')
                                    : i18n.t('Group by program configuration')
                            }
                        >
                            <ModeToggleIcon />
                        </button>

                        {isModeMenuOpen && (
                            <Layer
                                onBackdropClick={() => setIsModeMenuOpen(false)}
                            >
                                <Popper
                                    reference={modeButtonRef.current}
                                    placement="bottom-end"
                                >
                                    <FlyoutMenu dense>
                                        <MenuItem
                                            label={i18n.t('Group by data type')}
                                            onClick={() =>
                                                handleModeSelect('BY_TYPE')
                                            }
                                            active={viewMode === 'BY_TYPE'}
                                            dataTest="mode-option-by-type"
                                        />
                                        <MenuItem
                                            label={i18n.t(
                                                'Group by program configuration'
                                            )}
                                            onClick={() =>
                                                handleModeSelect(
                                                    'PROGRAM_CONFIG'
                                                )
                                            }
                                            active={
                                                viewMode === 'PROGRAM_CONFIG'
                                            }
                                            dataTest="mode-option-program-config"
                                        />
                                    </FlyoutMenu>
                                </Popper>
                            </Layer>
                        )}
                    </>
                )}

                {/* Collapse/Expand all button */}
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
    hasExpandedCards: PropTypes.bool.isRequired,
    onCollapseAll: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    isScrolled: PropTypes.bool,
    onTypeFilterChange: PropTypes.func,
    onViewModeChange: PropTypes.func,
    showModeToggle: PropTypes.bool,
    showTypeFilter: PropTypes.bool,
    typeFilter: PropTypes.string,
    viewMode: PropTypes.string,
}

export { UnifiedSearch }
