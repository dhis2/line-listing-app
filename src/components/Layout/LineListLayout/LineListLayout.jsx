import { AXIS_ID_COLUMNS, AXIS_ID_FILTERS } from '@dhis2/analytics'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import DefaultAxis from '../DefaultLayout/DefaultAxis.jsx'
import defaultAxisStyles from '../DefaultLayout/styles/DefaultAxis.module.css'
import defaultLayoutStyles from '../DefaultLayout/styles/DefaultLayout.module.css'
import HorizontalResizablePanel from './HorizontalResizablePanel.jsx'
import lineListLayoutStyles from './styles/LineListLayout.module.css'

const Layout = ({ isCompletelyBlankState }) => (
    <div id="layout-ct" className={defaultLayoutStyles.ct}>
        <HorizontalResizablePanel
            defaultWidthPercent={70}
            minWidth={200}
            isCompletelyBlankState={isCompletelyBlankState}
            leftPanel={
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
                        isCompletelyBlankState={isCompletelyBlankState}
                    />
                </div>
            }
            rightPanel={
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
                        isCompletelyBlankState={isCompletelyBlankState}
                    />
                </div>
            }
        />
    </div>
)

Layout.propTypes = {
    isCompletelyBlankState: PropTypes.bool,
}

export default Layout
