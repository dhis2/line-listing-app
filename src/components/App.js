import React from 'react'
import { connect } from 'react-redux'
import classes from './App.module.css'
import VisualizationOptionsManager from './VisualizationOptions/VisualizationOptionsManager'

const App = () => (
    <>
        <div className={`${classes.eventReportsApp} flex-ct flex-dir-col`}>
            <div className={`${classes.sectionToolbar} ${classes.flexCt}`}>
                <div className={classes.toolbarType}>{'vis type selector'}</div>
                <div
                    className={`${classes.toolbarMenubar} ${classes.flexGrow1}`}
                >
                    {'menubar'}
                    <VisualizationOptionsManager />
                </div>
            </div>
            <div
                className={`${classes.sectionMain} ${classes.flexGrow1} ${classes.flexCt}`}
            >
                <div className={classes.mainLeft}>{'dimension panel'}</div>
                <div
                    className={`${classes.mainCenter} ${classes.flexGrow1} ${classes.flexBasis0} ${classes.flexCt} ${classes.flexDirCol}`}
                >
                    <div className={classes.mainCenterLayout}>{'layout'}</div>
                    <div className={classes.mainCenterTitlebar}>
                        {'titlebar'}
                    </div>
                    <div
                        className={`${classes.mainCenterCanvas} ${classes.flexGrow1}`}
                    >
                        {'visualization'}
                    </div>
                </div>
            </div>
        </div>
    </>
)

const mapStateToProps = () => ({})

const mapDispatchToProps = {}

App.contextTypes = {}

App.childContextTypes = {}

App.propTypes = {}

export default connect(mapStateToProps, mapDispatchToProps)(App)
