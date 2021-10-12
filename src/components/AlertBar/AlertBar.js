import { AlertBar as UiAlertBar } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acClearAlertBar } from '../../actions/alertbar'
import { sGetAlertBar } from '../../reducers/alertbar'
import classes from './styles/AlertBar.module.css'

export const ALERT_TYPE_ERROR = 'error'
export const ALERT_TYPE_SUCCESS = 'success'
export const ALERT_TYPE_WARNING = 'warning'

export const AlertBar = ({ config, onClose }) => {
    const { type, message, duration } = config

    return message ? (
        <div className={classes.container}>
            <UiAlertBar
                duration={duration}
                critical={type === ALERT_TYPE_ERROR}
                success={type === ALERT_TYPE_SUCCESS}
                warning={type === ALERT_TYPE_WARNING}
                permanent={
                    type === ALERT_TYPE_ERROR || type === ALERT_TYPE_WARNING
                }
                onHidden={onClose}
            >
                {message}
            </UiAlertBar>
        </div>
    ) : null
}

AlertBar.propTypes = {
    config: PropTypes.object,
    onClose: PropTypes.func,
}

const mapStateToProps = state => ({
    config: sGetAlertBar(state),
})

const mapDispatchToProps = {
    onClose: acClearAlertBar,
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertBar)
