import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const UpdateButton = ({ onClick, disabled, ...props }) => {
    return (
        <Button
            {...props}
            onClick={onClick}
            disabled={disabled}
            type="button"
            primary
        >
            {i18n.t('Update')}
        </Button>
    )
}

UpdateButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
}

export default UpdateButton
