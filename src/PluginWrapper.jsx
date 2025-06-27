import { DashboardPluginWrapper } from '@dhis2/analytics'
import React from 'react'
import { VisualizationPluginWrapper } from './components/Visualization/VisualizationPluginWrapper.jsx'
import './locales/index.js'

const PluginWrapper = (props) => (
    <DashboardPluginWrapper {...props}>
        {(props) => <VisualizationPluginWrapper {...props} />}
    </DashboardPluginWrapper>
)

export default PluginWrapper
