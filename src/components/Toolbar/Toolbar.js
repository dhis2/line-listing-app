import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import classes from '../App.module.css'
import { default as MenuBar } from './MenuBar/MenuBar.js'
import { default as VisualizationTypeSelector } from './VisualizationTypeSelector/VisualizationTypeSelector.js'

export const Toolbar = ({ onShare }) => {
    return (
        <div className={cx(classes.sectionToolbar, classes.flexCt)}>
            <VisualizationTypeSelector />
            <div className={cx(classes.toolbarMenubar, classes.flexGrow1)}>
                <MenuBar onShare={onShare} />
            </div>
        </div>
    )
}

Toolbar.propTypes = {
    onShare: PropTypes.func.isRequired,
}
