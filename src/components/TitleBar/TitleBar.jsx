import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
    STATE_UNSAVED,
    STATE_SAVED,
    STATE_DIRTY,
    getVisualizationState,
} from '../../modules/visualization.js'
import { sGetCurrent } from '../../reducers/current.js'
import { sGetVisualization } from '../../reducers/visualization.js'
import { sGetUi } from '../../reducers/ui.js'
import { ExpandedVisualizationCanvasToggle } from './ExpandedVisualizationCanvasToggle.jsx'
import classes from './styles/TitleBar.module.css'

export const getTitleUnsaved = () => i18n.t('Unsaved visualization')
export const getTitleDirty = () => i18n.t('Unsaved changes')

const defaultTitleClasses = `${classes.cell} ${classes.title}`

const getTitleText = (titleState, visualization) => {
    switch (titleState) {
        case STATE_UNSAVED:
            return getTitleUnsaved()
        case STATE_SAVED:
        case STATE_DIRTY:
            return visualization.displayName
        default:
            return ''
    }
}

const getCustomTitleClasses = (titleState) =>
    titleState === STATE_UNSAVED ? classes.titleUnsaved : ''

const getSuffix = (titleState) =>
    titleState === STATE_DIRTY ? (
        <div
            className={cx(classes.titleDirty, classes.suffix)}
        >{` ${getTitleDirty()}`}</div>
    ) : (
        ''
    )

export const TitleBar = ({ titleState, titleText }) => {
    const titleClasses = `${defaultTitleClasses} ${getCustomTitleClasses(
        titleState
    )}`

    return titleText ? (
        <div data-test="titlebar" className={classes.titleBar}>
            {/* <div className={classes.buttonContainer}>
                <ExpandedVisualizationCanvasToggle />
            </div> */}
            <div className={classes.titleContainer}>
                <div className={titleClasses}>
                    {titleText}
                    {getSuffix(titleState)}
                </div>
            </div>
        </div>
    ) : null
}

TitleBar.propTypes = {
    titleState: PropTypes.string,
    titleText: PropTypes.string,
}

const mapStateToProps = (state) => ({
    current: sGetCurrent(state),
    visualization: sGetVisualization(state),
    ui: sGetUi(state),
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { visualization, current, ui } = stateProps
    const titleState = getVisualizationState(visualization, current, ui)
    return {
        ...dispatchProps,
        ...ownProps,
        titleState: titleState,
        titleText: getTitleText(titleState, visualization),
    }
}

export default connect(mapStateToProps, null, mergeProps)(TitleBar)
