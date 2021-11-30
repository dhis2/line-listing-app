import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import { InterpretationModal as AnalyticsInterpretationModal } from '../Interpretations/InterpretationModal/index.js'
import {
    useInterpretationQueryParams,
    removeInterpretationQueryParams,
} from './interpretationIdQueryParam.js'

const InterpretationModal = ({
    visualization,
    onResponseReceived,
    handleInterpretationUpdate,
}) => {
    const { interpretationId, initialFocus } = useInterpretationQueryParams()
    const isVisualizationLoading = useSelector(
        state => state.loader.isVisualizationLoading
    )
    const currentUser = useSelector(state => state.user)

    if (!interpretationId) {
        return null
    }

    return (
        <AnalyticsInterpretationModal
            currentUser={currentUser}
            handleInterpretationUpdate={handleInterpretationUpdate}
            initialFocus={initialFocus}
            interpretationId={interpretationId}
            isVisualizationLoading={isVisualizationLoading}
            onClose={removeInterpretationQueryParams}
            onResponseReceived={onResponseReceived}
            visualization={visualization}
        />
    )
}
InterpretationModal.propTypes = {
    handleInterpretationUpdate: PropTypes.func.isRequired,
    visualization: PropTypes.object.isRequired,
    onResponseReceived: PropTypes.func,
}
export { InterpretationModal }
