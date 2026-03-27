import { IconChevronUp16, IconChevronDown16, colors } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetShowExpandedLayoutPanel } from '../../actions/ui.js'
import { LAYOUT_TYPE_LINE_LIST } from '../../modules/layout.js'
import {
    sGetUiLayoutPanelHidden,
    sGetUiShowExpandedLayoutPanel,
    sGetUiDataSourceId,
} from '../../reducers/ui.js'
import LineListLayout from './LineListLayout/LineListLayout.jsx'
import classes from './styles/Layout.module.css'

const componentMap = {
    [LAYOUT_TYPE_LINE_LIST]: LineListLayout,
}

const Layout = () => {
    const isExpanded = useSelector((state) =>
        sGetUiShowExpandedLayoutPanel(state)
    )
    const isHidden = useSelector(sGetUiLayoutPanelHidden)
    const dataSourceId = useSelector(sGetUiDataSourceId)
    const dispatch = useDispatch()
    const toggleExpanded = () =>
        dispatch(acSetShowExpandedLayoutPanel(!isExpanded))

    const layoutType = LAYOUT_TYPE_LINE_LIST
    const LayoutComponent = componentMap[layoutType]

    const ButtonIcon = isExpanded ? IconChevronUp16 : IconChevronDown16

    // Hide layout if no data source is selected or if manually hidden
    const shouldHideLayout = isHidden || !dataSourceId

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
