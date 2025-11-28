import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'

export const getLabelForInputType = (type) => {
    switch (type) {
        case OUTPUT_TYPE_EVENT:
            return i18n.t('Events')
        case OUTPUT_TYPE_ENROLLMENT:
            return i18n.t('Enrollments')
        case OUTPUT_TYPE_TRACKED_ENTITY:
            return i18n.t('Tracked entity')
        default:
            throw new Error('No input type specified')
    }
}

// InputPanel is now hidden - data source selection happens in the "New..." tab
export const InputPanel = ({ visible }) => {
    if (!visible) {
        return null
    }

    // Return null to hide the dropdown and recent data sources
    // Data source selection is now handled in the MainSidebar's "New..." tab
    return null
}

InputPanel.propTypes = {
    visible: PropTypes.bool.isRequired,
}
