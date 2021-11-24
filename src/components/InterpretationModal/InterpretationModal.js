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
    onInterpretationUpdated,
}) => {
    const interpretationId = useInterpretationIdQueryParam()
    const isVisualizationLoading = useSelector(
        state => state.loader.isVisualizationLoading
    )
    const currentUser = useSelector(state => state.user)
    const onClose = () => {
        // This will cause the interpretation to refresh whenever the modal is closed
        // We probably want more fine grained control but this is OK for a POC
        onInterpretationUpdated()
        removeInterpretationIdQueryParam()
    }

    return (
        <AnalyticsInterpretationModal
            visualization={visualization}
            onResponseReceived={onResponseReceived}
            interpretationId={interpretationId}
            isVisualizationLoading={isVisualizationLoading}
            currentUser={currentUser}
            onClose={onClose}
        />
    )
}
InterpretationModal.propTypes = {
    visualization: PropTypes.object.isRequired,
    onInterpretationUpdated: PropTypes.func.isRequired,
    onResponseReceived: PropTypes.func,
}
export { InterpretationModal }
