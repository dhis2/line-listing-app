import { IconCross16, IconAdd16 } from '@dhis2/ui'
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
    return (
        <div className={styles.container}>
            <div className={styles.tabsWrapper}>
                {tabs.map((tab, index) => (
                    <div
                        key={`${tab.type}-${tab.id}`}
                        className={`${styles.tab} ${
                            index === activeIndex ? styles.active : ''
                        }`}
                        onClick={() => onTabClick(index)}
                        data-test={`data-source-tab-${index}`}
                    >
                        <span className={styles.tabLabel}>{tab.name}</span>
                        <button
                            className={styles.closeButton}
                            onClick={(e) => {
                                e.stopPropagation()
                                onTabClose(index)
                            }}
                            aria-label={`Close ${tab.name} tab`}
                            data-test={`close-tab-${index}`}
                        >
                            <IconCross16 />
                        </button>
                    </div>
                ))}
                <button
                    className={styles.addButton}
                    onClick={onAddClick}
                    aria-label="Add new data source"
                    data-test="add-data-source-tab"
                >
                    <IconAdd16 />
                </button>
            </div>
        </div>
    )
}

DataSourceTabs.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    activeIndex: PropTypes.number.isRequired,
    onTabClick: PropTypes.func.isRequired,
    onTabClose: PropTypes.func.isRequired,
    onAddClick: PropTypes.func.isRequired,
}


