import PropTypes from 'prop-types'
import React, { forwardRef } from 'react'
import classes from './styles/MenuButton.module.css'

const MenuButton = forwardRef(({ children, disabled, onClick }, ref) => (
    <button
        ref={ref}
        className={classes.menuButton}
        disabled={disabled}
        onClick={onClick}
    >
        {children}
    </button>
))

MenuButton.displayName = 'MenuButton'

MenuButton.propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
}

export default MenuButton
