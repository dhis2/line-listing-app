import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import IconButton from '../../IconButton/IconButton.jsx'
import styles from './DimensionItemButton.module.css'

const DimensionItemButton = ({ onClick, icon, dataTest }) => {
    return (
        <div className={cx(styles.hidden, styles.wrapper)} data-test={dataTest}>
            <IconButton onClick={onClick}>{icon}</IconButton>
        </div>
    )
}

DimensionItemButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    icon: PropTypes.object,
}

export { DimensionItemButton }
