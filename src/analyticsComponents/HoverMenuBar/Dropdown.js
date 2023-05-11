import { Card } from '@dhis2-ui/card'
import { Popper } from '@dhis2-ui/popper'
import { Portal } from '@dhis2-ui/portal'
import PropTypes from 'prop-types'
import React from 'react'
import menuButtonStyles from '../MenuButton.styles.js'
import { useHoverMenubarDropdown } from './useHoverMenubarDropdown.js'

export const Dropdown = ({ children, label, disabled }) => {
    const { buttonRef, closeMenu, isOpen, onClick, onMouseOver } =
        useHoverMenubarDropdown()

    return (
        <>
            <button
                ref={buttonRef}
                onClick={onClick}
                disabled={disabled}
                onMouseOver={onMouseOver}
            >
                {label}
                <style jsx>{menuButtonStyles}</style>
            </button>
            {isOpen && (
                <Portal>
                    <Popper placement="bottom-start" reference={buttonRef}>
                        <Card>
                            {/* Support render props for children that need access to the full dropdown state. One example is menu items that call `event.preventDefault()` in
                            their `onClick` handler: these will need to call
                            `closeMenu` themselves because the click event will
                            not bubble up to the document. */}
                            {typeof children === 'function'
                                ? children({
                                      closeMenu,
                                      isOpen,
                                      onClick,
                                      onMouseOver,
                                  })
                                : children}
                        </Card>
                    </Popper>
                </Portal>
            )}
        </>
    )
}

Dropdown.propTypes = {
    children: PropTypes.node.isRequired,
    label: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
}
