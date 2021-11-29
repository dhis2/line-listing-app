import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import { InterpretationModal as AnalyticsInterpretationModal } from '../Interpretations/InterpretationModal/index.js'
import {
    useInterpretationIdQueryParam,
    removeInterpretationIdQueryParam,
} from './interpretationIdQueryParam.js'
/**
 * TODO: When the interpretation modal is moved to analytics,
 * this component needs to remain in the app
 */
//
const InterpretationModal = ({
    visualization,
    onResponseReceived,
    handleInterpretationUpdate,
}) => {
    const interpretationId = useInterpretationIdQueryParam()
    const isVisualizationLoading = useSelector(
        state => state.loader.isVisualizationLoading
    )
    const currentUser = useSelector(state => state.user)

    if (!interpretationId) {
        return null
    }

    return (
        <AnalyticsInterpretationModal
            visualization={visualization}
            onResponseReceived={onResponseReceived}
            interpretationId={interpretationId}
            isVisualizationLoading={isVisualizationLoading}
            currentUser={currentUser}
            onClose={removeInterpretationIdQueryParam}
            handleInterpretationUpdate={handleInterpretationUpdate}
        />
    )
}
InterpretationModal.propTypes = {
    handleInterpretationUpdate: PropTypes.func.isRequired,
    visualization: PropTypes.object.isRequired,
    onResponseReceived: PropTypes.func,
}
export { InterpretationModal }
