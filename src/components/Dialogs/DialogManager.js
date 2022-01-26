import { DIMENSION_ID_ORGUNIT } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acSetUiOpenDimensionModal } from '../../actions/ui.js'
import { sGetUiActiveModalDialog } from '../../reducers/ui.js'
import ConditionsManager from './Conditions/ConditionsManager.js'
import FixedDimension from './FixedDimension.js'

export const DialogManager = ({ dialogId, changeDialog }) => {
    switch (dialogId) {
        case DIMENSION_ID_ORGUNIT: {
            return (
                <FixedDimension
                    dimensionId={dialogId}
                    onClose={() => changeDialog(null)}
                />
            )
        }
        // TODO: case DIMENSION_ID_PERIOD:
        default: {
            return (
                dialogId && (
                    <ConditionsManager
                        dimensionId={dialogId}
                        onClose={() => changeDialog(null)}
                    />
                )
            )
        }
    }
}

DialogManager.propTypes = {
    changeDialog: PropTypes.func.isRequired,
    dialogId: PropTypes.string,
}

DialogManager.defaultProps = {
    dialogId: null,
    rootOrgUnits: [],
}

const mapStateToProps = (state) => ({
    dialogId: sGetUiActiveModalDialog(state),
})

export default connect(mapStateToProps, {
    changeDialog: acSetUiOpenDimensionModal,
})(DialogManager)
