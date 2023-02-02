import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import IconButton from '../../IconButton/IconButton.js'
import styles from './DimensionActionButton.module.css'

const DimensionActionButton = ({ onClick, icon }) => {
    return (
        <div className={cx(styles.hidden)}>
            <IconButton onClick={onClick}>{icon}</IconButton>
        </div>
    )
}

DimensionActionButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.object,
}

export { DimensionActionButton }
