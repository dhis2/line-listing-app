import {
    DIMENSION_TYPE_CATEGORY,
    DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
    DIMENSION_TYPE_ORGANISATION_UNIT,
    DIMENSION_TYPE_PERIOD,
    DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET,
} from '@dhis2/analytics'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiOpenDimensionModal } from '../../actions/ui.js'
import { DIMENSION_TYPE_STATUS } from '../../modules/dimensionConstants.js'
import { sGetMetadata } from '../../reducers/metadata.js'
import { sGetUiActiveModalDialog } from '../../reducers/ui.js'
import ConditionsManager from './Conditions/ConditionsManager.jsx'
import DynamicDimension from './DynamicDimension.jsx'
import FixedDimension from './FixedDimension.jsx'
import PeriodDimension from './PeriodDimension/index.js'

const DialogManager = () => {
    const dispatch = useDispatch()
    const dimension = useSelector(
        (state) => sGetMetadata(state)[sGetUiActiveModalDialog(state)]
    )

    const onClose = () => dispatch(acSetUiOpenDimensionModal(null))

    if (!dimension?.id) {
        return null
    }
    switch (dimension.dimensionType) {
        case DIMENSION_TYPE_CATEGORY:
        case DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET:
        case DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET:
            return <DynamicDimension dimension={dimension} onClose={onClose} />

        case DIMENSION_TYPE_PERIOD:
            return <PeriodDimension dimension={dimension} onClose={onClose} />

        case DIMENSION_TYPE_STATUS:
        case DIMENSION_TYPE_ORGANISATION_UNIT:
            return <FixedDimension dimension={dimension} onClose={onClose} />

        default:
            return <ConditionsManager dimension={dimension} onClose={onClose} />
    }
}

export default DialogManager
