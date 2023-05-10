import PropTypes from 'prop-types'
import React from 'react'
import { Toolbar } from '../../analyticsComponents/index.js'
import { AppLogo } from './AppLogo.js'
import { InterpretationsAndDetailsToggler } from './InterpretationsAndDetailsToggler.js'
import { UpdateButton } from './UpdateButton.js'

export const ToolbarV2 = ({ onFileMenuAction }) => {
    onFileMenuAction
    return (
        <Toolbar>
            <AppLogo />
            <Toolbar.Main>
                <UpdateButton />
            </Toolbar.Main>
            <InterpretationsAndDetailsToggler />
        </Toolbar>
    )
}

ToolbarV2.propTypes = {
    onFileMenuAction: PropTypes.func.isRequired,
}
