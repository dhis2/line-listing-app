import React from 'react'
import { LAYOUT_TYPE_LINE_LIST } from '../../modules/layout'
import LineListLayout from './LineListLayout/LineListLayout'

const componentMap = {
    [LAYOUT_TYPE_LINE_LIST]: LineListLayout,
}

const Layout = () => {
    const layoutType = LAYOUT_TYPE_LINE_LIST
    const LayoutComponent = componentMap[layoutType]

    return <LayoutComponent />
}

export default Layout
