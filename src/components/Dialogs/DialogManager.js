import { DIMENSION_ID_ORGUNIT } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acSetUiOpenDimensionModal } from '../../actions/ui.js'
import {
    DIMENSION_TYPE_CATEGORY,
    DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
    DIMENSION_TYPE_EVENT_STATUS,
    DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET,
    DIMENSION_TYPE_PROGRAM_STATUS,
} from '../../modules/dimensionTypes.js'
import { sGetMetadata } from '../../reducers/metadata.js'
import { sGetUiActiveModalDialog } from '../../reducers/ui.js'
import ConditionsManager from './Conditions/ConditionsManager.js'
import DynamicDimension from './DynamicDimension.js'
import FixedDimension from './FixedDimension.js'

const isDynamicDimension = (type) =>
    [
        DIMENSION_TYPE_CATEGORY,
        DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
        DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET,
    ].includes(type)

const DialogManager = ({ dimension, changeDialog }) => {
    const onClose = () => changeDialog(null)

    if (isDynamicDimension(dimension?.dimensionType)) {
        return <DynamicDimension dimension={dimension} onClose={onClose} />
    }
    switch (dimension?.id) {
        case DIMENSION_TYPE_PROGRAM_STATUS:
        case DIMENSION_TYPE_EVENT_STATUS:
        case DIMENSION_ID_ORGUNIT: {
            return <FixedDimension dimension={dimension} onClose={onClose} />
        }
        // TODO: case DIMENSION_ID_PERIOD:
        default: {
            return dimension?.id ? (
                <ConditionsManager dimension={dimension} onClose={onClose} />
            ) : null
        }
    }
}

DialogManager.propTypes = {
    changeDialog: PropTypes.func.isRequired,
    dimension: PropTypes.object.isRequired,
}

DialogManager.defaultProps = {
    rootOrgUnits: [],
}

const mapStateToProps = (state) => ({
    dimension: sGetMetadata(state)[sGetUiActiveModalDialog(state)],
})

export default connect(mapStateToProps, {
    changeDialog: acSetUiOpenDimensionModal,
})(DialogManager)
