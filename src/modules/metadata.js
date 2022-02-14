import {
    USER_ORG_UNIT,
    USER_ORG_UNIT_CHILDREN,
    USER_ORG_UNIT_GRANDCHILDREN,
    DIMENSION_ID_ORGUNIT,
    getDimensionById,
    DIMENSION_ID_PERIOD,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { sGetUiProgramId } from '../reducers/ui.js'
import { getMainDimensions } from './mainDimensions.js'
import {
    getTimeDimensions,
    getTimeDimensionName,
    getDefaulTimeDimensionsMetadata,
} from './timeDimensions.js'

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
    ...getDefaulTimeDimensionsMetadata(),
    ...getFixedDimensions(),
    ...Object.entries({
        ...getOrganisationUnits(),
    }).reduce((acc, [key, value]) => ({ ...acc, [key]: { name: value } }), {}),
})

const removeProgramAndStagesFromMetadata = (state) => {
    const idsToRemove = new Set()
    const programId = sGetUiProgramId(state)

    if (programId) {
        idsToRemove.add(programId)

        const programStages = state.metadata[programId]?.programStages
        if (programStages) {
            programStages.forEach(({ id }) => {
                idsToRemove.add(id)
            })
        }
    }

    return {
        // reset time dimension names as well
        ...getDefaulTimeDimensionsMetadata(),
        ...Object.entries(state.metadata).reduce((acc, [key, value]) => {
            if (!idsToRemove.has(key)) {
                acc[key] = value
            }
            return acc
        }, {}),
    }
}

export const updateMetadataOnInputChange = (state) =>
    removeProgramAndStagesFromMetadata(state)

export const updateMetadataOnProgramChange = (program, state) => ({
    ...removeProgramAndStagesFromMetadata(state),
    ...program.programStages.reduce((acc, stage) => {
        acc[stage.id] = stage
        return acc
    }, {}),
    [program.id]: program,
})

export const updateMetadataOnStageChange = (stage, program, state) => ({
    ...state.metadata,
    ...Object.values(getTimeDimensions()).reduce((acc, dimension) => {
        acc[dimension.id] = {
            id: dimension.id,
            dimensionType: dimension.dimensionType,
            name: getTimeDimensionName(dimension, program, stage),
        }
        return acc
    }),
})
