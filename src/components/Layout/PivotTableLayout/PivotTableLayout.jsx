import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
} from '@dhis2/analytics'
import cx from 'classnames'
import React from 'react'
import DefaultAxis from '../DefaultLayout/DefaultAxis.jsx'
import defaultAxisStyles from '../DefaultLayout/styles/DefaultAxis.module.css'
import defaultLayoutStyles from '../DefaultLayout/styles/DefaultLayout.module.css'
import styles from './styles/PivotTableLayout.module.css'

const PivotTableLayout = () => (
    <div id="layout-ct" className={defaultLayoutStyles.ct}>
        <div className={styles.container}>
            {/* Left panel: Columns and Rows stacked */}
            <div className={styles.leftPanel}>
                <DefaultAxis
                    axisId={AXIS_ID_COLUMNS}
                    className={cx(
                        defaultLayoutStyles.filters,
                        defaultAxisStyles.axisContainerLeft
                    )}
                />
                <DefaultAxis
                    axisId={AXIS_ID_ROWS}
                    className={cx(
                        defaultLayoutStyles.filters,
                        defaultAxisStyles.axisContainerLeft,
                        styles.rowsAxis
                    )}
                />
            </div>

            {/* Right panel: Filter spanning full height */}
            <div className={styles.rightPanel}>
                <DefaultAxis
                    axisId={AXIS_ID_FILTERS}
                    className={defaultLayoutStyles.filters}
                />
            </div>
        </div>
    </div>
)

export default PivotTableLayout
