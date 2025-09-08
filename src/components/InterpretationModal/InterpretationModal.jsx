import { InterpretationModal as AnalyticsInterpretationModal } from '@dhis2/analytics'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { sGetVisualization } from '../../reducers/visualization.js'
import { ModalDownloadDropdown } from '../DownloadMenu/index.js'
import { VisualizationPluginWrapper } from '../Visualization/VisualizationPluginWrapper.jsx'
import {
    useInterpretationQueryParams,
    removeInterpretationQueryParams,
} from './interpretationIdQueryParam.js'

const InterpretationModal = () => {
    const { interpretationId, initialFocus } = useInterpretationQueryParams()
    const [isVisualizationLoading, setIsVisualizationLoading] = useState(false)
    const visualization = useSelector(sGetVisualization)

    useEffect(() => {
        setIsVisualizationLoading(!!interpretationId)
    }, [interpretationId])

    return interpretationId ? (
        <AnalyticsInterpretationModal
            downloadMenuComponent={ModalDownloadDropdown}
            initialFocus={initialFocus}
            interpretationId={interpretationId}
            isVisualizationLoading={isVisualizationLoading}
            onClose={removeInterpretationQueryParams}
            onResponsesReceived={() => setIsVisualizationLoading(false)}
            pluginComponent={VisualizationPluginWrapper}
            visualization={visualization}
        />
    ) : null
}

export { InterpretationModal }
