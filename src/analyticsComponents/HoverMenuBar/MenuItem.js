import { Popper } from '@dhis2-ui/popper'
import { Portal } from '@dhis2-ui/portal'
import { IconChevronRight24 } from '@dhis2/ui-icons'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import { Menu } from './Menu.js'
import styles from './MenuItem.styles.js'

const MenuItem = ({
    onClick,
    children,
    icon,
    className,
    destructive,
    disabled,
    dense,
    active,
    dataTest,
    label,
    showSubMenu,
    toggleSubMenu,
}) => {
    const menuItemRef = useRef()
    console.log(
        'should attach the toggle: ',
        !disabled && !!children && toggleSubMenu
    )

    return (
        <>
            <li
                className={cx(className, {
                    destructive,
                    disabled,
                    dense,
                    active: active || showSubMenu,
                    'with-chevron': children,
                })}
                ref={menuItemRef}
                data-test={dataTest}
                onClick={
                    !disabled && !children && onClick ? onClick : undefined
                }
                onMouseEnter={
                    !disabled && !!children && toggleSubMenu
                        ? toggleSubMenu
                        : undefined
                }
            >
                {icon && <span className="icon">{icon}</span>}

                <span className="label">{label}</span>

                {!!children && (
                    <span className="chevron">
                        <IconChevronRight24 />
                    </span>
                )}

                <style jsx>{styles}</style>
            </li>
            {children && showSubMenu && (
                <Portal>
                    <Popper placement="right-start" reference={menuItemRef}>
                        <Menu dense={dense}>{children}</Menu>
                    </Popper>
                </Portal>
            )}
        </>
    )
}

MenuItem.defaultProps = {
    dataTest: 'dhis2-uicore-menuitem',
}

MenuItem.propTypes = {
    active: PropTypes.bool,
    /**
     * Nested menu items can become submenus.
     * See `showSubMenu` and `toggleSubMenu` props, and 'Children' demo
     */
    children: PropTypes.node,
    className: PropTypes.string,
    dataTest: PropTypes.string,
    dense: PropTypes.bool,
    destructive: PropTypes.bool,
    disabled: PropTypes.bool,
    /** An icon for the left side of the menu item */
    icon: PropTypes.node,
    /** Text in the menu item */
    label: PropTypes.node,
    /** When true, nested menu items are shown in a Popper */
    showSubMenu: PropTypes.bool,
    /** On click, this function is called (without args) */
    toggleSubMenu: PropTypes.func,
    /** Click handler */
    onClick: PropTypes.func,
}

export { MenuItem }
