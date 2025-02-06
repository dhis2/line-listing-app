import {
    useCachedDataQuery,
    InterpretationModal as AnalyticsInterpretationModal,
} from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { sGetVisualization } from '../../reducers/visualization.js'
import { ModalDownloadDropdown } from '../DownloadMenu/index.js'
import { Visualization } from '../Visualization/Visualization.jsx'
import {
    useInterpretationQueryParams,
    removeInterpretationQueryParams,
} from './interpretationIdQueryParam.js'

const InterpretationModal = ({ onInterpretationUpdate }) => {
    const { interpretationId, initialFocus } = useInterpretationQueryParams()
    const [isVisualizationLoading, setIsVisualizationLoading] = useState(false)
    const visualization = useSelector(sGetVisualization)
    const { currentUser } = useCachedDataQuery()

    useEffect(() => {
        setIsVisualizationLoading(!!interpretationId)
    }, [interpretationId])

    return interpretationId ? (
        <AnalyticsInterpretationModal
            currentUser={currentUser}
            onInterpretationUpdate={onInterpretationUpdate}
            initialFocus={initialFocus}
            interpretationId={interpretationId}
            isVisualizationLoading={isVisualizationLoading}
            onClose={removeInterpretationQueryParams}
            onResponsesReceived={() => setIsVisualizationLoading(false)}
            visualization={visualization}
            downloadMenuComponent={ModalDownloadDropdown}
            pluginComponent={Visualization}
        />
    ) : null
}

InterpretationModal.propTypes = {
    onInterpretationUpdate: PropTypes.func.isRequired,
}

export { InterpretationModal }
