import { IconChevronUp16, IconChevronDown16, colors } from '@dhis2/ui'
import { VIS_TYPE_LINE_LIST, VIS_TYPE_PIVOT_TABLE } from '@dhis2/analytics'
import cx from 'classnames'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetShowExpandedLayoutPanel } from '../../actions/ui.js'
import {
    LAYOUT_TYPE_LINE_LIST,
    LAYOUT_TYPE_PIVOT_TABLE,
} from '../../modules/layout.js'
import {
    sGetUiLayoutPanelHidden,
    sGetUiShowExpandedLayoutPanel,
    sGetUiType,
} from '../../reducers/ui.js'
import LineListLayout from './LineListLayout/LineListLayout.jsx'
import PivotTableLayout from './PivotTableLayout/PivotTableLayout.jsx'
import classes from './styles/Layout.module.css'

const componentMap = {
    [LAYOUT_TYPE_LINE_LIST]: LineListLayout,
    [LAYOUT_TYPE_PIVOT_TABLE]: PivotTableLayout,
}

const Layout = () => {
    const isExpanded = useSelector((state) =>
        sGetUiShowExpandedLayoutPanel(state)
    )
    const isHidden = useSelector(sGetUiLayoutPanelHidden)
    const visualizationType = useSelector(sGetUiType)
    const dispatch = useDispatch()
    const toggleExpanded = () =>
        dispatch(acSetShowExpandedLayoutPanel(!isExpanded))

    // Map visualization type to layout type
    const layoutType =
        visualizationType === VIS_TYPE_PIVOT_TABLE
            ? LAYOUT_TYPE_PIVOT_TABLE
            : LAYOUT_TYPE_LINE_LIST
    const LayoutComponent = componentMap[layoutType]

    const ButtonIcon = isExpanded ? IconChevronUp16 : IconChevronDown16

    // Hide layout only when manually hidden
    const shouldHideLayout = isHidden

    return (
        <div
            className={cx(classes.container, {
                [classes.hidden]: shouldHideLayout,
            })}
            data-test="layout-container"
        >
            <div
                className={cx(classes.overflowContainer, {
                    [classes.expanded]: isExpanded,
                })}
            >
                <LayoutComponent />
            </div>
            {/* <button
                className={classes.button}
                onClick={toggleExpanded}
                data-test="layout-height-toggle"
            >
                <ButtonIcon color={colors.grey700} />
            </button> */}
        </div>
    )
}

export default Layout
