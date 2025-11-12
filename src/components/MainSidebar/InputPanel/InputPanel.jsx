import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'
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

export const InputPanel = ({ visible }) => {
    if (!visible) {
        return null
    }

    return (
        <div className={styles.container} data-test="input-panel">
            <div className={styles.section}>
                <div className={styles.row}>
                    <div className={styles.dropdownWrapper}>
                        <DataSourceSelect noBorders={true} />
                    </div>
                </div>
            </div>
        </div>
    )
}

InputPanel.propTypes = {
    visible: PropTypes.bool.isRequired,
}
