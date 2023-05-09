import PropTypes from 'prop-types'
import React from 'react'
import { Toolbar } from '../../analyticsComponents/index.js'
import { default as VisualizationTypeSelector } from '../Toolbar/VisualizationTypeSelector/VisualizationTypeSelector.js'

export const ToolbarV2 = ({ onFileMenuAction }) => {
    onFileMenuAction
    return (
        <Toolbar>
            <Toolbar.Sidebar>
                <VisualizationTypeSelector />
            </Toolbar.Sidebar>
            <Toolbar.Main>Main content</Toolbar.Main>
            <Toolbar.Aside>Aside content</Toolbar.Aside>
        </Toolbar>
    )
}

ToolbarV2.propTypes = {
    onFileMenuAction: PropTypes.func.isRequired,
}
