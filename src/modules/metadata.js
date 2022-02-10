import {
    USER_ORG_UNIT,
    USER_ORG_UNIT_CHILDREN,
    USER_ORG_UNIT_GRANDCHILDREN,
    DIMENSION_ID_ORGUNIT,
    getDimensionById,
    DIMENSION_ID_PERIOD,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { getMainDimensions } from './mainDimensions.js'
import { getTimeDimensions } from './timeDimensions.js'

const getOrganisationUnits = () => ({
    [USER_ORG_UNIT]: i18n.t('User organisation unit'),
    [USER_ORG_UNIT_CHILDREN]: i18n.t('User sub-units'),
    [USER_ORG_UNIT_GRANDCHILDREN]: i18n.t('User sub-x2-units'),
})

const getFixedDimensions = () => ({
    [DIMENSION_ID_ORGUNIT]: getDimensionById(DIMENSION_ID_ORGUNIT),
    [DIMENSION_ID_PERIOD]: getDimensionById(DIMENSION_ID_PERIOD),
})

export const getDefaultMetadata = () => ({
    ...getMainDimensions(),
    ...getTimeDimensions(),
    ...getFixedDimensions(),
    ...Object.entries({
        ...getOrganisationUnits(),
    }).reduce((acc, [key, value]) => ({ ...acc, [key]: { name: value } }), {}),
})
