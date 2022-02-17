import { DIMENSION_ID_ORGUNIT } from '@dhis2/analytics'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiOpenDimensionModal } from '../../actions/ui.js'
import {
    DIMENSION_TYPE_CATEGORY,
    DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
    DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET,
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

const DialogManager = () => {
    const dispatch = useDispatch()
    const dimension = useSelector(
        (state) => sGetMetadata(state)[sGetUiActiveModalDialog(state)]
    )

    const onClose = () => dispatch(acSetUiOpenDimensionModal(null))

    if (isDynamicDimension(dimension?.dimensionType)) {
        return <DynamicDimension dimension={dimension} onClose={onClose} />
    }
    switch (dimension?.id) {
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

export default DialogManager
