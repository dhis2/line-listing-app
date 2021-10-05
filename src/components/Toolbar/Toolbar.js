import React from 'react'
import classes from '../App.module.css'
import { default as MenuBar } from './MenuBar'

const apiObjectName = 'eventReport' // TODO move to App?

export const Toolbar = () => {
    return (
        <div className={`${classes.sectionToolbar} ${classes.flexCt}`}>
            <div className={classes.toolbarType}>{'vis type selector'}</div>
            <MenuBar apiObjectName={apiObjectName} dataTest={'app-menubar'} />
        </div>
    )
}
