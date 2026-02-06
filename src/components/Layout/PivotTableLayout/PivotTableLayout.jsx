import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
} from '@dhis2/analytics'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import DefaultAxis from '../DefaultLayout/DefaultAxis.jsx'
import defaultAxisStyles from '../DefaultLayout/styles/DefaultAxis.module.css'
import defaultLayoutStyles from '../DefaultLayout/styles/DefaultLayout.module.css'
import styles from './styles/PivotTableLayout.module.css'

const PivotTableLayout = ({ isCompletelyBlankState }) => (
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
                    isCompletelyBlankState={isCompletelyBlankState}
                />
                <DefaultAxis
                    axisId={AXIS_ID_ROWS}
                    className={cx(
                        defaultLayoutStyles.filters,
                        defaultAxisStyles.axisContainerLeft,
                        styles.rowsAxis,
                        { [styles.hiddenBorder]: isCompletelyBlankState }
                    )}
                    isCompletelyBlankState={isCompletelyBlankState}
                />
            </div>

            {/* Right panel: Filter spanning full height */}
            <div
                className={cx(styles.rightPanel, {
                    [styles.hiddenBorder]: isCompletelyBlankState,
                })}
            >
                <DefaultAxis
                    axisId={AXIS_ID_FILTERS}
                    className={defaultLayoutStyles.filters}
                    isCompletelyBlankState={isCompletelyBlankState}
                />
            </div>
        </div>
    </div>
)

PivotTableLayout.propTypes = {
    isCompletelyBlankState: PropTypes.bool,
}

export default PivotTableLayout
