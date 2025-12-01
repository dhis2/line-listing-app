import { IconCross16 } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './DataSourceTabs.module.css'

export const DataSourceTabs = ({
    tabs,
    activeIndex,
    onTabClick,
    onTabClose,
    onAddClick,
}) => {
    // Check if active tab is a placeholder (new/unsaved tab)
    const activeTabIsPlaceholder = tabs[activeIndex]?.isPlaceholder

    // Hide tab bar completely when no tabs (launch screen)
    if (tabs.length === 0) {
        return null
    }

    return (
        <div className={styles.container}>
            <div className={styles.tabsWrapper}>
                {tabs.map((tab, index) => (
                    <div
                        key={
                            tab.isPlaceholder
                                ? 'placeholder'
                                : `${tab.type}-${tab.id}`
                        }
                        className={`${styles.tab} ${
                            index === activeIndex ? styles.active : ''
                        } ${tab.isPlaceholder ? styles.placeholder : ''}`}
                        onClick={() => onTabClick(index)}
                        data-test={`data-source-tab-${index}`}
                    >
                        <span className={styles.tabLabel}>
                            {tab.isPlaceholder
                                ? i18n.t('Choose a data source')
                                : tab.name}
                        </span>
                        <button
                            className={styles.closeButton}
                            onClick={(e) => {
                                e.stopPropagation()
                                onTabClose(index)
                            }}
                            aria-label={`Close ${
                                tab.isPlaceholder
                                    ? 'Choose a data source'
                                    : tab.name
                            } tab`}
                            data-test={`close-tab-${index}`}
                        >
                            <IconCross16 />
                        </button>
                    </div>
                ))}
                {!activeTabIsPlaceholder && (
                    <button
                        className={styles.addButton}
                        onClick={onAddClick}
                        aria-label="Add new data source"
                        data-test="add-data-source-tab"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 5l0 14" />
                            <path d="M5 12l14 0" />
                        </svg>

                        <span className={styles.addButtonLabel}>
                            Add data source
                        </span>
                    </button>
                )}
            </div>
        </div>
    )
}

DataSourceTabs.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            type: PropTypes.string,
            name: PropTypes.string,
            isPlaceholder: PropTypes.bool,
        })
    ).isRequired,
    activeIndex: PropTypes.number.isRequired,
    onTabClick: PropTypes.func.isRequired,
    onTabClose: PropTypes.func.isRequired,
    onAddClick: PropTypes.func.isRequired,
}
