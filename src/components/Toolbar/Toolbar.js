import React from 'react'
import classes from '../App.module.css'
import { default as MenuBar } from './MenuBar/MenuBar'
import { default as VisualizationTypeSelector } from './VisualizationTypeSelector/VisualizationTypeSelector'

const apiObjectName = 'eventReport' // TODO move to App?

export const Toolbar = () => {
    return (
        <div className={`${classes.sectionToolbar} ${classes.flexCt}`}>
            <VisualizationTypeSelector />
            <MenuBar apiObjectName={apiObjectName} dataTest={'app-menubar'} />
        </div>
    )
}
