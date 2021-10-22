import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/MenuButton.module.css'

const MenuButton = ({ children, disabled, onClick }) => (
    <button
        className={classes.menuButton}
        disabled={disabled}
        onClick={onClick}
    >
        {children}
    </button>
)

MenuButton.propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
}

export default MenuButton
