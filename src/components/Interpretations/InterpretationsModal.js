import PropTypes from 'prop-types'
import React from 'react'
import { useInterpretationIdQueryParam } from './useInterpretationIdQueryParam'

const InterpretationsModal = ({ visualization }) => {
    const interpretationId = useInterpretationIdQueryParam(visualization)

    if (!interpretationId) {
        return null
    }

    return <h1>Now show the modal</h1>
}

InterpretationsModal.propTypes = {
    visualization: PropTypes.object,
}

export { InterpretationsModal }
