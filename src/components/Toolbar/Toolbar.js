import cx from 'classnames'
import React from 'react'
import classes from '../App.module.css'
import { default as MenuBar } from './MenuBar/MenuBar'
import { default as VisualizationTypeSelector } from './VisualizationTypeSelector/VisualizationTypeSelector'

const apiObjectName = 'eventReport' // TODO move to App?

export const Toolbar = () => {
    return (
        <div className={cx(classes.sectionToolbar, classes.flexCt)}>
            <VisualizationTypeSelector />
            <div className={cx(classes.toolbarMenubar, classes.flexGrow1)}>
                <MenuBar
                    apiObjectName={apiObjectName}
                    dataTest={'app-menubar'}
                />
            </div>
        </div>
    )
}
