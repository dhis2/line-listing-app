import {
    DIMENSION_ID_ORGUNIT,
    DIMENSION_TYPE_ORGANISATION_UNIT,
    USER_ORG_UNIT,
    USER_ORG_UNIT_CHILDREN,
    USER_ORG_UNIT_GRANDCHILDREN,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { formatDimensionId } from './dimensionId.js'
import { getMainDimensions, getCreatedDimension } from './mainDimensions.js'
import { getProgramDimensions } from './programDimensions.js'
import { getTimeDimensions, getTimeDimensionName } from './timeDimensions.js'
import { OUTPUT_TYPE_TRACKED_ENTITY, getStatusNames } from './visualization.js'

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
    ...getCreatedDimension(),
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

export const getDefaultOuMetadata = (inputType) => ({
    [DIMENSION_ID_ORGUNIT]: {
        id: DIMENSION_ID_ORGUNIT,
        dimensionType: DIMENSION_TYPE_ORGANISATION_UNIT,
        name: getDefaultOrgUnitLabel(inputType),
    },
})

export const getDefaultOrgUnitLabel = (inputType) => {
    if (inputType === OUTPUT_TYPE_TRACKED_ENTITY) {
        return i18n.t('Registration org. unit')
    } else {
        return i18n.t('Organisation unit')
    }
}

export const getProgramAsMetadata = (program) => ({
    ...(program.programStages || []).reduce((acc, stage) => {
        acc[stage.id] = stage
        return acc
    }, {}),
    [program.id]: program,
})

export const getDynamicTimeDimensionsMetadata = (
    program,
    stage,
    inputType
) => ({
    ...Object.values(getTimeDimensions()).reduce((acc, dimension) => {
        const id = formatDimensionId({
            dimensionId: dimension.id,
            programId: program?.id,
            outputType: inputType,
        })

        acc[id] = {
            id,
            dimensionType: dimension.dimensionType,
            name: getTimeDimensionName(dimension, program, stage),
        }
        return acc
    }, {}),
})

export const isPopulatedObject = (input) => {
    if (input && typeof input === 'object' && !Array.isArray(input)) {
        for (const prop in input) {
            if (Object.hasOwn(input, prop)) {
                return true
            }
        }
    }
    return false
}

export const transformMetaDataResponseObject = (metaDataResponseObject) =>
    Object.entries(metaDataResponseObject)
        .filter(
            ([item]) =>
                ![
                    USER_ORG_UNIT,
                    USER_ORG_UNIT_CHILDREN,
                    USER_ORG_UNIT_GRANDCHILDREN,
                    DIMENSION_ID_ORGUNIT,
                ].includes(item)
        )
        .reduce((obj, [id, item]) => {
            obj[id] = {
                id,
                name: item.name || item.displayName,
                displayName: item.displayName,
                dimensionType: item.dimensionType || item.dimensionItemType,
                code: item.code,
            }

            return obj
        }, {})
