import {
    DIMENSION_ID_ORGUNIT,
    DIMENSION_TYPE_ORGANISATION_UNIT,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_TYPE_STATUS,
    DIMENSION_ID_PROGRAM_STATUS,
} from './dimensionConstants.js'
import { PROGRAM_TYPE_WITHOUT_REGISTRATION } from './programTypes.js'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from './visualization.js'

export const getProgramDimensions = () => ({
    [DIMENSION_ID_ORGUNIT]: {
        id: DIMENSION_ID_ORGUNIT,
        dimensionType: DIMENSION_TYPE_ORGANISATION_UNIT,
        name: i18n.t('Organisation unit'),
    },
    [DIMENSION_ID_EVENT_STATUS]: {
        id: DIMENSION_ID_EVENT_STATUS,
        dimensionType: DIMENSION_TYPE_STATUS,
        name: i18n.t('Event status'),
    },
    [DIMENSION_ID_PROGRAM_STATUS]: {
        id: DIMENSION_ID_PROGRAM_STATUS,
        dimensionType: DIMENSION_TYPE_STATUS,
        name: i18n.t('Program status'),
    },
})

export const getIsProgramDimensionDisabled = ({
    dimensionId,
    inputType,
    programType,
}) => {
    if (
        dimensionId === DIMENSION_ID_PROGRAM_STATUS &&
        inputType === OUTPUT_TYPE_EVENT
    ) {
        if (!programType) {
            return true
        } else if (programType === PROGRAM_TYPE_WITHOUT_REGISTRATION) {
            return true
        }
    } else if (
        dimensionId === DIMENSION_ID_EVENT_STATUS &&
        [OUTPUT_TYPE_ENROLLMENT, OUTPUT_TYPE_TRACKED_ENTITY].includes(inputType)
    ) {
        return true
    }
    return false
}
