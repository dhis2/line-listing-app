import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import { sGetUiEntityTypeId } from '../../../reducers/ui.js'
import { DataSourceSelect } from './DataSourceSelect.jsx'
import { TrackedEntityTypeSelect } from './TrackedEntityTypeSelect.jsx'
import styles from './InputPanel.module.css'

export const InputPanel = ({ visible }) => {
    const selectedEntityTypeId = useSelector(sGetUiEntityTypeId)

    if (!visible) {
        return null
    }

    return (
        <div className={styles.container} data-test="input-panel">
            <div className={styles.section}>
                <div className={styles.row}>
                    <TrackedEntityTypeSelect />
                    <div className={styles.dropdownWrapper}>
                        <DataSourceSelect
                            trackedEntityTypeId={selectedEntityTypeId}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

InputPanel.propTypes = {
    visible: PropTypes.bool.isRequired,
}
