import { IconChevronUp16, IconChevronDown16, colors } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetShowExpandedLayoutPanel } from '../../actions/ui.js'
import { LAYOUT_TYPE_LINE_LIST } from '../../modules/layout.js'
import { sGetUiShowExpandedLayoutPanel } from '../../reducers/ui.js'
import LineListLayout from './LineListLayout/LineListLayout.js'
import classes from './styles/Layout.module.css'

const componentMap = {
    [LAYOUT_TYPE_LINE_LIST]: LineListLayout,
}

const Layout = () => {
    const isExpanded = useSelector((state) =>
        sGetUiShowExpandedLayoutPanel(state)
    )
    const dispatch = useDispatch()
    const toggleExpanded = () =>
        dispatch(acSetShowExpandedLayoutPanel(!isExpanded))

    const layoutType = LAYOUT_TYPE_LINE_LIST
    const LayoutComponent = componentMap[layoutType]

    const ButtonIcon = isExpanded ? IconChevronUp16 : IconChevronDown16

    return (
        <div className={classes.container}>
            <div
                className={cx(classes.overflowContainer, {
                    [classes.expanded]: isExpanded,
                })}
            >
                <LayoutComponent />
            </div>
            <button className={classes.button} onClick={toggleExpanded}>
                <ButtonIcon color={colors.grey700} />
            </button>
        </div>
    )
}

export default Layout
