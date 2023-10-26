import {
    USER_ORG_UNIT,
    USER_ORG_UNIT_CHILDREN,
    USER_ORG_UNIT_GRANDCHILDREN,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { getMainDimensions } from './mainDimensions.js'
import { getProgramDimensions } from './programDimensions.js'
import { getTimeDimensions, getTimeDimensionName } from './timeDimensions.js'
import { getStatusNames } from './visualization.js'

const formatObject = (object) =>
    Object.entries(object).reduce(
        (obj, [key, value]) => ({ ...obj, [key]: { name: value } }),
        {}
    )

const getOrganisationUnits = () => ({
    [USER_ORG_UNIT]: i18n.t('User organisation unit'),
    [USER_ORG_UNIT_CHILDREN]: i18n.t('User sub-units'),
    [USER_ORG_UNIT_GRANDCHILDREN]: i18n.t('User sub-x2-units'),
})

export const getDefaultMetadata = () => ({
    ...getMainDimensions(),
    ...getProgramDimensions(),
    ...getDefaultTimeDimensionsMetadata(),
    ...formatObject(getOrganisationUnits()),
    ...formatObject(getStatusNames()),
})

export const getDefaultTimeDimensionsMetadata = () => {
    return Object.values(getTimeDimensions()).reduce(
        (acc, { id, name, dimensionType }) => {
            acc[id] = {
                id,
                name,
                dimensionType,
            }
            return acc
        },
        {}
    )
}

export const getProgramAsMetadata = (program) => ({
    ...program.programStages.reduce((acc, stage) => {
        acc[stage.id] = stage
        return acc
    }, {}),
    [program.id]: program,
})

export const getDynamicTimeDimensionsMetadata = (program, stage) => ({
    ...Object.values(getTimeDimensions()).reduce((acc, dimension) => {
        acc[dimension.id] = {
            id: dimension.id,
            dimensionType: dimension.dimensionType,
            name: getTimeDimensionName(dimension, program, stage),
        }
        return acc
    }, {}),
})
