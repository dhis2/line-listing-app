import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { GenericError } from '../../assets/ErrorIcons.jsx'
import { genericErrorTitle, isVisualizationError } from '../../modules/error.js'
import { sGetLoadError } from '../../reducers/loader.js'
import styles from './styles/StartScreen.module.css'

const StartScreen = ({ error }) => {
    if (!error) {
        return null
    }

    return (
        <div className={styles.outer}>
            <div className={styles.inner}>
                <div
                    className={styles.errorContainer}
                    data-test={'error-container'}
                >
                    {isVisualizationError(error) ? (
                        <>
                            <div className={styles.errorIcon}>
                                {error.icon()}
                            </div>
                            <p className={styles.errorTitle}>{error.title}</p>
                            <p className={styles.errorDescription}>
                                {error.description}
                            </p>
                        </>
                    ) : (
                        <>
                            <div className={styles.errorIcon}>
                                {GenericError()}
                            </div>
                            <p className={styles.errorTitle}>
                                {genericErrorTitle}
                            </p>
                            <p className={styles.errorDescription}>
                                {error.message || error}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

StartScreen.propTypes = {
    error: PropTypes.object,
}

const mapStateToProps = (state) => ({
    error: sGetLoadError(state),
})

export default connect(mapStateToProps)(StartScreen)
