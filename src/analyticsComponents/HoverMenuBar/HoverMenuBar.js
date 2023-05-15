import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { HoverMenuBarContext } from './HoverMenuBarContext.js'
import { useHoverMenuBarState } from './useHoverMenuBarState.js'

export const HoverMenuBar = ({ children }) => {
    const hoverMenuBarState = useHoverMenuBarState()
    const { closeMenu } = hoverMenuBarState
    const closeMenuWithEsc = useCallback(
        (event) => {
            if (event.keyCode === 27) {
                closeMenu()
            }
        },
        [closeMenu]
    )

    return (
        <HoverMenuBarContext.Provider value={hoverMenuBarState}>
            <div onKeyDown={closeMenuWithEsc}>
                {children}
                <style jsx>{`
                    display: flex;
                `}</style>
            </div>
        </HoverMenuBarContext.Provider>
    )
}

HoverMenuBar.propTypes = {
    children: PropTypes.node.isRequired,
}
