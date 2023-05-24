import PropTypes from 'prop-types'
import React from 'react'
import { Toolbar as AnalyticsToolbar } from '../../analyticsComponents/index.js'
import { AppLogo } from './AppLogo.js'
import { InterpretationsAndDetailsToggler } from './InterpretationsAndDetailsToggler.js'
import { MenuBar } from './MenuBar.js'
import { UpdateButton } from './UpdateButton.js'

export const Toolbar = ({ onFileMenuAction }) => (
    <AnalyticsToolbar>
        <AppLogo />
        <AnalyticsToolbar.Main>
            <UpdateButton />
            <MenuBar onFileMenuAction={onFileMenuAction} />
        </AnalyticsToolbar.Main>
        <InterpretationsAndDetailsToggler />
    </AnalyticsToolbar>
)

Toolbar.propTypes = {
    onFileMenuAction: PropTypes.func.isRequired,
}
