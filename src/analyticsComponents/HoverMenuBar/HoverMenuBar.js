import PropTypes from 'prop-types'
import React from 'react'
import { HoverMenuBarContext } from './HoverMenuBarContext.js'
import { useHoverMenuBarState } from './useHoverMenuBarState.js'

export const HoverMenuBar = ({ children }) => {
    const hoverMenuBarState = useHoverMenuBarState()

    return (
        <HoverMenuBarContext.Provider value={hoverMenuBarState}>
            {children}
        </HoverMenuBarContext.Provider>
    )
}

HoverMenuBar.propTypes = {
    children: PropTypes.node.isRequired,
}
