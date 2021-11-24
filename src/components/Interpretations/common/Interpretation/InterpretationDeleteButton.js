import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconDelete16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { MessageIconButton } from '../index.js'

const mutation = {
    resource: 'interpretations',
    id: ({ id }) => id,
    type: 'delete',
}

const InterpretationDeleteButton = ({ id, refresh }) => {
    const [remove, { loading }] = useDataMutation(mutation, {
        onComplete: refresh,
        variables: { id },
    })
    return (
        <MessageIconButton
            tooltipContent={i18n.t('Delete')}
            iconComponent={IconDelete16}
            onClick={event => {
                event.stopPropagation()
                remove()
            }}
            disabled={loading}
        />
    )
}

InterpretationDeleteButton.propTypes = {
    id: PropTypes.string.isRequired,
    refresh: PropTypes.func.isRequired,
}

export { InterpretationDeleteButton }
