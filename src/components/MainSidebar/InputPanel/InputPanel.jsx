import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'
import { sGetUiDataSource } from '../../../reducers/ui.js'
import { DataSourceSelect } from './DataSourceSelect.jsx'
import styles from './InputPanel.module.css'

export const getLabelForInputType = (type) => {
    switch (type) {
        case OUTPUT_TYPE_EVENT:
            return i18n.t('Events')
        case OUTPUT_TYPE_ENROLLMENT:
            return i18n.t('Enrollments')
        case OUTPUT_TYPE_TRACKED_ENTITY:
            return i18n.t('Tracked entity')
        default:
            throw new Error('No input type specified')
    }
}

// Prototype: Recently used data sources (hardcoded for now)
const RECENT_DATA_SOURCES = [
    { id: 'program-IpHINAT79UW', name: 'Child Programme', type: 'program' },
    {
        id: 'program-WSGAb5XwJ3Y',
        name: 'Malaria case management',
        type: 'program',
    },
    { id: 'program-ur1Edk5Oe2n', name: 'TB program', type: 'program' },
    { id: 'tet-nEenWmSyUEp', name: 'Person', type: 'tet' },
    {
        id: 'program-M3xtLkYBlKI',
        name: 'Nutrition assessment',
        type: 'program',
    },
]

export const InputPanel = ({ visible }) => {
    const selectedDataSource = useSelector(sGetUiDataSource)
    const hasDataSource = selectedDataSource?.id && selectedDataSource?.type
    const selectRef = React.useRef(null)

    if (!visible) {
        return null
    }

    const handleRecentDataSourceClick = (sourceId) => {
        // Trigger selection via the DataSourceSelect component
        if (selectRef.current) {
            selectRef.current(sourceId)
        }
    }

    return (
        <div className={styles.container} data-test="input-panel">
            <div className={styles.section}>
                <div className={styles.row}>
                    <div className={styles.dropdownWrapper}>
                        <DataSourceSelect
                            noBorders={true}
                            onSelectRef={selectRef}
                        />
                    </div>
                </div>
                {!hasDataSource && (
                    <div className={styles.recentSection}>
                        <div className={styles.recentHeader}>
                            {i18n.t('Recently used data sources')}
                        </div>
                        <div className={styles.recentButtons}>
                            {RECENT_DATA_SOURCES.map((source) => (
                                <button
                                    key={source.id}
                                    className={styles.recentButton}
                                    onClick={() =>
                                        handleRecentDataSourceClick(source.id)
                                    }
                                >
                                    {source.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

InputPanel.propTypes = {
    visible: PropTypes.bool.isRequired,
}
