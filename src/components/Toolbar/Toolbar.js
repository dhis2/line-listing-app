import { Toolbar as AnalyticsToolbar } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { AppLogo } from './AppLogo.js'
import { InterpretationsAndDetailsToggler } from './InterpretationsAndDetailsToggler.js'
import { MenuBar } from './MenuBar.js'
import { UpdateButton } from './UpdateButton.js'

export const Toolbar = ({ onFileMenuAction }) => (
    <AnalyticsToolbar>
        <AppLogo />
        <UpdateButton />
        <MenuBar onFileMenuAction={onFileMenuAction} />
        <InterpretationsAndDetailsToggler />
    </AnalyticsToolbar>
)

Toolbar.propTypes = {
    onFileMenuAction: PropTypes.func.isRequired,
}
