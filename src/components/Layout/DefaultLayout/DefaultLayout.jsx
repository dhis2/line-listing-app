import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    VIS_TYPE_PIVOT_TABLE,
} from '@dhis2/analytics'
import cx from 'classnames'
import React from 'react'
import DefaultAxis from './DefaultAxis.jsx'
import defaultAxisStyles from './styles/DefaultAxis.module.css'
import defaultLayoutStyles from './styles/DefaultLayout.module.css'

const Layout = () => (
    <div id="layout-ct" className={defaultLayoutStyles.ct}>
        <div
            id="axis-group-1"
            className={cx(
                defaultLayoutStyles.axisGroup,
                defaultLayoutStyles.axisGroupLeft
            )}
        >
            <DefaultAxis
                axisId={AXIS_ID_COLUMNS}
                className={cx(
                    defaultLayoutStyles.columns,
                    defaultAxisStyles.axisContainerLeft
                )}
                visType={VIS_TYPE_PIVOT_TABLE}
            />
            <DefaultAxis
                axisId={AXIS_ID_ROWS}
                className={cx(
                    defaultLayoutStyles.rows,
                    defaultAxisStyles.axisContainerLeft
                )}
                visType={VIS_TYPE_PIVOT_TABLE}
            />
        </div>
        <div
            id="axis-group-2"
            className={cx(
                defaultLayoutStyles.axisGroup,
                defaultLayoutStyles.axisGroupRight
            )}
        >
            <DefaultAxis
                axisId={AXIS_ID_FILTERS}
                className={defaultLayoutStyles.filters}
                visType={VIS_TYPE_PIVOT_TABLE}
            />
        </div>
    </div>
)

Layout.displayName = 'Layout'

export default Layout
