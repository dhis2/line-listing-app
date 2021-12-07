import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetVisualizationLoading } from '../../actions/loader.js'
import { ModalDownloadDropdown } from '../DownloadMenu/index.js'
import { InterpretationModal as AnalyticsInterpretationModal } from '../Interpretations/InterpretationModal/index.js'
import {
    useInterpretationQueryParams,
    removeInterpretationQueryParams,
} from './interpretationIdQueryParam.js'

const InterpretationModal = ({ visualization, onInterpretationUpdate }) => {
    const { interpretationId, initialFocus } = useInterpretationQueryParams()
    const [isVisualizationLoading, setIsVisualizationLoading] = useState(false)
    const currentUser = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const onClose = () => {
        removeInterpretationQueryParams()
        dispatch(acSetVisualizationLoading(false))
    }

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
            onClose={onClose}
            onResponseReceived={() => setIsVisualizationLoading(false)}
            visualization={visualization}
            downloadMenuComponent={ModalDownloadDropdown}
        />
    ) : null
}

InterpretationModal.propTypes = {
    visualization: PropTypes.object.isRequired,
    onInterpretationUpdate: PropTypes.func.isRequired,
}

export { InterpretationModal }
