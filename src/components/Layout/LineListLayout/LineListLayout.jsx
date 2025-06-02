import { AXIS_ID_COLUMNS, AXIS_ID_FILTERS } from '@dhis2/analytics'
import cx from 'classnames'
import React from 'react'
import DefaultAxis from '../DefaultLayout/DefaultAxis.jsx'
import defaultAxisStyles from '../DefaultLayout/styles/DefaultAxis.module.css'
import defaultLayoutStyles from '../DefaultLayout/styles/DefaultLayout.module.css'
import lineListLayoutStyles from './styles/LineListLayout.module.css'

const Layout = () => (
    <div id="layout-ct" className={defaultLayoutStyles.ct}>
        <div
            id="axis-group-1"
            className={cx(
                defaultLayoutStyles.axisGroup,
                lineListLayoutStyles.axisGroupLeft
            )}
        >
            <DefaultAxis
                axisId={AXIS_ID_COLUMNS}
                className={cx(
                    defaultLayoutStyles.filters,
                    defaultAxisStyles.axisContainerLeft
                )}
            />
        </div>
        <div
            id="axis-group-2"
            className={cx(
                defaultLayoutStyles.axisGroup,
                lineListLayoutStyles.axisGroupRight
            )}
        >
            <DefaultAxis
                axisId={AXIS_ID_FILTERS}
                className={defaultLayoutStyles.filters}
            />
        </div>
    </div>
)

export default Layout
