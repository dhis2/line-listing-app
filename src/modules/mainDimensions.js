import { DIMENSION_ID_ORGUNIT } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    DIMENSION_TYPE_OU,
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_PROGRAM_STATUS,
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_LAST_UPDATED_BY,
    DIMENSION_TYPE_STATUS,
    DIMENSION_TYPE_USER,
} from './dimensionConstants.js'
import { PROGRAM_TYPE_WITHOUT_REGISTRATION } from './programTypes.js'
import { OUTPUT_TYPE_ENROLLMENT } from './visualization.js'

export const getMainDimensions = () => ({
    [DIMENSION_ID_ORGUNIT]: {
        id: DIMENSION_ID_ORGUNIT,
        dimensionType: DIMENSION_TYPE_OU,
        name: i18n.t('Organisation unit'),
    },
    [DIMENSION_ID_PROGRAM_STATUS]: {
        id: DIMENSION_ID_PROGRAM_STATUS,
        dimensionType: DIMENSION_TYPE_STATUS,
        name: i18n.t('Program status'),
    },
    [DIMENSION_ID_EVENT_STATUS]: {
        id: DIMENSION_ID_EVENT_STATUS,
        dimensionType: DIMENSION_TYPE_STATUS,
        name: i18n.t('Event status'),
    },
    [DIMENSION_ID_CREATED_BY]: {
        id: DIMENSION_ID_CREATED_BY,
        dimensionType: DIMENSION_TYPE_USER,
        name: i18n.t('Created by'),
    },
    [DIMENSION_ID_LAST_UPDATED_BY]: {
        id: DIMENSION_ID_LAST_UPDATED_BY,
        dimensionType: DIMENSION_TYPE_USER,
        name: i18n.t('Last updated by'),
    },
})

export const getIsMainDimensionDisabled = ({
    dimensionId,
    inputType,
    programType,
}) => {
    if (dimensionId === DIMENSION_ID_PROGRAM_STATUS) {
        return !programType || programType === PROGRAM_TYPE_WITHOUT_REGISTRATION
    } else if (dimensionId === DIMENSION_ID_EVENT_STATUS) {
        return !programType || inputType === OUTPUT_TYPE_ENROLLMENT
    } else {
        return false
    }
}
