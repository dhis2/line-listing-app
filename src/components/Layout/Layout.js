import React from 'react'
import LineListLayout from './LineListLayout/LineListLayout'

const LAYOUT_TYPE_LINE_LIST = 'LAYOUT_TYPE_LINE_LIST'

const componentMap = {
    [LAYOUT_TYPE_LINE_LIST]: LineListLayout,
}

const Layout = () => {
    const layoutType = LAYOUT_TYPE_LINE_LIST
    const LayoutComponent = componentMap[layoutType]

    return <LayoutComponent />
}

export default Layout
