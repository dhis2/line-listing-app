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
import { extractDimensionIdParts } from './dimensionIds.js'
import { getDefaultOrgUnitLabel } from './metadata.js'
import { PROGRAM_TYPE_WITHOUT_REGISTRATION } from './programTypes.js'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from './visualization.js'

const prefixDimensionId = (prefix, dimensionId) =>
    prefix ? `${prefix}.${dimensionId}` : dimensionId

export const getProgramDimensions = (programId) => ({
    [prefixDimensionId(programId, DIMENSION_ID_ORGUNIT)]: {
        id: prefixDimensionId(programId, DIMENSION_ID_ORGUNIT),
        dimensionType: DIMENSION_TYPE_ORGANISATION_UNIT,
        name: getDefaultOrgUnitLabel(),
    },
    [prefixDimensionId(programId, DIMENSION_ID_EVENT_STATUS)]: {
        id: prefixDimensionId(programId, DIMENSION_ID_EVENT_STATUS),
        dimensionType: DIMENSION_TYPE_STATUS,
        name: i18n.t('Event status'),
    },
    [prefixDimensionId(programId, DIMENSION_ID_PROGRAM_STATUS)]: {
        id: prefixDimensionId(programId, DIMENSION_ID_PROGRAM_STATUS),
        dimensionType: DIMENSION_TYPE_STATUS,
        name: i18n.t('Program status'),
    },
})

export const getIsProgramDimensionDisabled = ({
    dimensionId,
    inputType,
    programType,
}) => {
    const { dimensionId: id } = extractDimensionIdParts(dimensionId, inputType)
    if (id === DIMENSION_ID_PROGRAM_STATUS && inputType === OUTPUT_TYPE_EVENT) {
        if (!programType) {
            return true
        } else if (programType === PROGRAM_TYPE_WITHOUT_REGISTRATION) {
            return true
        }
    } else if (
        id === DIMENSION_ID_EVENT_STATUS &&
        [OUTPUT_TYPE_ENROLLMENT, OUTPUT_TYPE_TRACKED_ENTITY].includes(inputType)
    ) {
        return true
    }
    return false
}
