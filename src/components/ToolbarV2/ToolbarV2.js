import PropTypes from 'prop-types'
import React from 'react'
import { Toolbar } from '../../analyticsComponents/index.js'

export const ToolbarV2 = ({ onFileMenuAction }) => {
    onFileMenuAction
    return (
        <Toolbar>
            <Toolbar.Sidebar>Sidebar content</Toolbar.Sidebar>
            <Toolbar.Main>Main content</Toolbar.Main>
            <Toolbar.Aside>Aside content</Toolbar.Aside>
        </Toolbar>
    )
}

ToolbarV2.propTypes = {
    onFileMenuAction: PropTypes.func.isRequired,
}
