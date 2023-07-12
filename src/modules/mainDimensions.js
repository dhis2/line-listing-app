import { DIMENSION_TYPE_PERIOD } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_LAST_UPDATED,
    DIMENSION_ID_LAST_UPDATED_BY,
    DIMENSION_TYPE_USER,
} from './dimensionConstants.js'

export const getMainDimensions = () => ({
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

// TODO: Remove fn completely if it's obsolete?
export const getIsMainDimensionDisabled = () =>
    // {
    //     dimensionId,
    //     inputType,
    //     programType,
    // }
    {
        // if (
        //     dimensionId === DIMENSION_ID_PROGRAM_STATUS &&
        //     inputType === OUTPUT_TYPE_EVENT
        // ) {
        //     if (!programType) {
        //         return i18n.t('No program selected')
        //     } else if (programType === PROGRAM_TYPE_WITHOUT_REGISTRATION) {
        //         return i18n.t('Not applicable to event programs')
        //     }
        // } else if (
        //     dimensionId === DIMENSION_ID_EVENT_STATUS &&
        //     inputType === OUTPUT_TYPE_ENROLLMENT
        // ) {
        //     return i18n.t('Not applicable to enrollments')
        // }

        return false
    }
