import {
    DIMENSION_TYPE_PERIOD,
    DIMENSION_TYPE_ORGANISATION_UNIT,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    DIMENSION_ID_CREATED,
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_LAST_UPDATED,
    DIMENSION_ID_LAST_UPDATED_BY,
    DIMENSION_ID_REGISTRATION_OU,
    DIMENSION_ID_REGISTRATION_DATE,
    DIMENSION_TYPE_USER,
} from './dimensionConstants.js'
import { getDefaultOuMetadata } from './metadata.js'
import { OUTPUT_TYPE_TRACKED_ENTITY } from './visualization.js'

export const getCreatedDimension = () => ({
    [DIMENSION_ID_CREATED]: {
        id: DIMENSION_ID_CREATED,
        dimensionType: DIMENSION_TYPE_PERIOD,
        name: i18n.t('Registration date'),
    },
})

// Mock registration dimensions for tracked entities (prototype)
// These use unique IDs to distinguish from program enrollment dimensions
export const getRegistrationDimensions = () => ({
    [DIMENSION_ID_REGISTRATION_OU]: {
        id: DIMENSION_ID_REGISTRATION_OU,
        dimensionType: DIMENSION_TYPE_ORGANISATION_UNIT,
        name: i18n.t('Registration org. unit'),
    },
    [DIMENSION_ID_REGISTRATION_DATE]: {
        id: DIMENSION_ID_REGISTRATION_DATE,
        dimensionType: DIMENSION_TYPE_PERIOD,
        name: i18n.t('Registration date'),
    },
})

export const getMainDimensions = (inputType) => ({
    [DIMENSION_ID_LAST_UPDATED]: {
        id: DIMENSION_ID_LAST_UPDATED,
        dimensionType: DIMENSION_TYPE_PERIOD,
        name: i18n.t('Last updated on'),
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
