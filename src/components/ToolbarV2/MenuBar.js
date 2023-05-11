import PropTypes from 'prop-types'
import React from 'react'
import { HoverMenuBar } from '../../analyticsComponents/index.js'

const BigColoredDiv = ({ color }) => (
    <div
        style={{
            backgroundColor: color,
            color: 'white',
            width: 200,
            height: 400,
        }}
    >
        A big {color} div
    </div>
)

BigColoredDiv.propTypes = {
    color: PropTypes.string.isRequired,
}

export const MenuBar = ({ onFileMenuAction }) => {
    console.log('onFileMenuAciton', onFileMenuAction)

    return (
        <HoverMenuBar>
            <HoverMenuBar.Dropdown label="Label red">
                <BigColoredDiv color="red" />
            </HoverMenuBar.Dropdown>
            <HoverMenuBar.Dropdown label="Label green">
                <BigColoredDiv color="green" />
            </HoverMenuBar.Dropdown>
            <HoverMenuBar.Dropdown label="Label blue" disabled>
                <BigColoredDiv color="blue" />
            </HoverMenuBar.Dropdown>
            <HoverMenuBar.Dropdown label="Label magenta">
                <BigColoredDiv color="magenta" />
            </HoverMenuBar.Dropdown>
        </HoverMenuBar>
    )
}
MenuBar.propTypes = {
    onFileMenuAction: PropTypes.func.isRequired,
}
