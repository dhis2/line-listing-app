import { Toolbar as AnalyticsToolbar } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'

import { InterpretationsAndDetailsToggler } from './InterpretationsAndDetailsToggler.jsx'
import { MenuBar } from './MenuBar.jsx'
import { UpdateButton } from './UpdateButton.jsx'

export const Toolbar = ({ onFileMenuAction }) => (
    <AnalyticsToolbar>
        <UpdateButton />
        <MenuBar onFileMenuAction={onFileMenuAction} />
        <InterpretationsAndDetailsToggler />
    </AnalyticsToolbar>
)

Toolbar.propTypes = {
    onFileMenuAction: PropTypes.func.isRequired,
}
