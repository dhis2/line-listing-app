import i18n from '@dhis2/d2-i18n'
import {
    DIMENSION_TYPE_OU,
    DIMENSION_TYPE_CREATED_BY,
    DIMENSION_TYPE_PROGRAM_STATUS,
    DIMENSION_TYPE_EVENT_STATUS,
    DIMENSION_TYPE_LAST_UPDATED_BY,
} from './dimensionTypes.js'

export const MAIN_DIMENSIONS = {
    [DIMENSION_TYPE_OU]: {
        id: DIMENSION_TYPE_OU,
        dimensionType: DIMENSION_TYPE_OU,
        name: i18n.t('Organisation unit'),
    },
    [DIMENSION_TYPE_PROGRAM_STATUS]: {
        id: DIMENSION_TYPE_PROGRAM_STATUS,
        dimensionType: DIMENSION_TYPE_PROGRAM_STATUS,
        name: i18n.t('Program status'),
    },
    [DIMENSION_TYPE_EVENT_STATUS]: {
        id: DIMENSION_TYPE_EVENT_STATUS,
        dimensionType: DIMENSION_TYPE_EVENT_STATUS,
        name: i18n.t('Event status'),
    },
    [DIMENSION_TYPE_CREATED_BY]: {
        id: DIMENSION_TYPE_CREATED_BY,
        dimensionType: DIMENSION_TYPE_CREATED_BY,
        name: i18n.t('Created by'),
    },
    [DIMENSION_TYPE_LAST_UPDATED_BY]: {
        id: DIMENSION_TYPE_LAST_UPDATED_BY,
        dimensionType: DIMENSION_TYPE_LAST_UPDATED_BY,
        name: i18n.t('Last updated by'),
    },
}
