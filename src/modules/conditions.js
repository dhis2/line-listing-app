import {
    VALUE_TYPE_NUMBER,
    VALUE_TYPE_UNIT_INTERVAL,
    VALUE_TYPE_PERCENTAGE,
    VALUE_TYPE_INTEGER,
    VALUE_TYPE_INTEGER_POSITIVE,
    VALUE_TYPE_INTEGER_NEGATIVE,
    VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
    VALUE_TYPE_TEXT,
    VALUE_TYPE_LONG_TEXT,
    VALUE_TYPE_LETTER,
    VALUE_TYPE_PHONE_NUMBER,
    VALUE_TYPE_EMAIL,
    VALUE_TYPE_USERNAME,
    VALUE_TYPE_URL,
    VALUE_TYPE_BOOLEAN,
    VALUE_TYPE_TRUE_ONLY,
    VALUE_TYPE_DATE,
    VALUE_TYPE_TIME,
    VALUE_TYPE_DATETIME,
    VALUE_TYPE_ORGANISATION_UNIT,
    formatValue,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
    ouIdHelper,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { formatDimensionId } from './dimensionId.js'

// parse e.g. 'LT:25:GT:15' to ['LT:25', 'GT:15']
export const parseConditionsStringToArray = (conditionsString) =>
    conditionsString?.match(/[^:]+:[^:]+/g) || conditionsString || []

// parse e.g. ['LT:25', 'GT:15'] to 'LT:25:GT:15'
export const parseConditionsArrayToString = (conditionsArray) =>
    conditionsArray.join(':')

export const parseCondition = (conditionItem) =>
    conditionItem.split(':').pop().split(';')

export const NULL_VALUE = 'NV'
export const TRUE_VALUE = '1'
export const FALSE_VALUE = '0'
export const OPERATOR_EQUAL = 'EQ'
export const OPERATOR_GREATER = 'GT'
export const OPERATOR_GREATER_OR_EQUAL = 'GE'
export const OPERATOR_LESS = 'LT'
export const OPERATOR_LESS_OR_EQUAL = 'LE'
export const OPERATOR_NOT_EQUAL = '!EQ'
export const OPERATOR_EMPTY = `EQ:${NULL_VALUE}`
export const OPERATOR_NOT_EMPTY = `NE:${NULL_VALUE}`
export const OPERATOR_IN = 'IN'
export const OPERATOR_CONTAINS = 'LIKE'
export const OPERATOR_NOT_CONTAINS = '!LIKE'
export const CASE_INSENSITIVE_PREFIX = 'I'
export const NOT_PREFIX = '!'

export const getNumericOperators = () => ({
    [OPERATOR_EQUAL]: i18n.t('equal to (=)'),
    [OPERATOR_GREATER]: i18n.t('greater than (>)'),
    [OPERATOR_GREATER_OR_EQUAL]: i18n.t('greater than or equal to (≥)'),
    [OPERATOR_LESS]: i18n.t('less than (<)'),
    [OPERATOR_LESS_OR_EQUAL]: i18n.t('less than or equal to (≤)'),
    [OPERATOR_NOT_EQUAL]: i18n.t('not equal to (≠)'),
    [OPERATOR_EMPTY]: i18n.t('is empty / null'),
    [OPERATOR_NOT_EMPTY]: i18n.t('is not empty / not null'),
})

export const getAlphaNumericOperators = () => ({
    [OPERATOR_EQUAL]: i18n.t('exactly'),
    [OPERATOR_NOT_EQUAL]: i18n.t('is not'),
    [OPERATOR_CONTAINS]: i18n.t('contains'),
    [OPERATOR_NOT_CONTAINS]: i18n.t('does not contain'),
    [OPERATOR_EMPTY]: i18n.t('is empty / null'),
    [OPERATOR_NOT_EMPTY]: i18n.t('is not empty / not null'),
})

export const getDateOperators = () => ({
    [OPERATOR_EQUAL]: i18n.t('exactly'),
    [OPERATOR_NOT_EQUAL]: i18n.t('is not'),
    [OPERATOR_GREATER]: i18n.t('after'),
    [OPERATOR_GREATER_OR_EQUAL]: i18n.t('after or including'),
    [OPERATOR_LESS]: i18n.t('before'),
    [OPERATOR_LESS_OR_EQUAL]: i18n.t('before or including'),
    [OPERATOR_EMPTY]: i18n.t('is empty / null'),
    [OPERATOR_NOT_EMPTY]: i18n.t('is not empty / not null'),
})

export const getBooleanValues = () => ({
    [TRUE_VALUE]: i18n.t('Yes'),
    [FALSE_VALUE]: i18n.t('No'),
    [NULL_VALUE]: i18n.t('Not answered'),
})

export const API_TIME_DIVIDER = '.'
export const UI_TIME_DIVIDER = ':'
export const API_DATETIME_DIVIDER = 'T'
export const UI_DATETIME_DIVIDER = ' '

export const addCaseSensitivePrefix = (operator, isCaseSensitive) => {
    if (isCaseSensitive) {
        // e.g. LIKE -> LIKE
        return operator
    } else {
        if (operator[0] === NOT_PREFIX) {
            // e.g. !LIKE -> !ILIKE
            return `${NOT_PREFIX}${CASE_INSENSITIVE_PREFIX}${operator.substring(
                1
            )}`
        } else {
            // e.g. LIKE -> ILIKE
            return `${CASE_INSENSITIVE_PREFIX}${operator}`
        }
    }
}

export const removeCaseSensitivePrefix = (operator) => {
    const isCaseSensitive = checkIsCaseSensitive(operator)
    if (isCaseSensitive) {
        // e.g. LIKE -> LIKE, !LIKE -> !LIKE
        return operator
    } else {
        if (operator[0] === NOT_PREFIX) {
            // e.g. !ILIKE -> !LIKE
            return `${NOT_PREFIX}${operator.substring(2)}`
        } else {
            // e.g. ILIKE -> LIKE
            return `${operator.substring(1)}`
        }
    }
}

// TODO - in practice this function isn't used for the 'IN' operator
// but if it were the result would be wrong. The function
// should probably control for the allowed operators and throw if the
// operator isn't one of the allowed ones.
export const checkIsCaseSensitive = (operator) => {
    if (operator[0] === NOT_PREFIX) {
        // !LIKE, !ILIKE, !EQ, !IEQ
        return operator[1] !== CASE_INSENSITIVE_PREFIX
    } else {
        // LIKE, ILIKE, EQ, IEQ
        return operator[0] !== CASE_INSENSITIVE_PREFIX
    }
}

const getOperatorsByValueType = (valueType) => {
    switch (valueType) {
        case VALUE_TYPE_LETTER:
        case VALUE_TYPE_TEXT:
        case VALUE_TYPE_LONG_TEXT:
        case VALUE_TYPE_EMAIL:
        case VALUE_TYPE_USERNAME:
        case VALUE_TYPE_URL:
        case VALUE_TYPE_PHONE_NUMBER: {
            return getAlphaNumericOperators()
        }
        case VALUE_TYPE_DATE:
        case VALUE_TYPE_TIME:
        case VALUE_TYPE_DATETIME: {
            return getDateOperators()
        }
        case VALUE_TYPE_NUMBER:
        case VALUE_TYPE_UNIT_INTERVAL:
        case VALUE_TYPE_PERCENTAGE:
        case VALUE_TYPE_INTEGER:
        case VALUE_TYPE_INTEGER_POSITIVE:
        case VALUE_TYPE_INTEGER_NEGATIVE:
        case VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE:
        default: {
            return getNumericOperators()
        }
    }
}

const lookupOptionSetOptionMetadata = (optionSetId, code, metaData) => {
    const optionSetMetaData = metaData?.[optionSetId]

    return optionSetMetaData
        ? optionSetMetaData.options?.find((option) => option.code === code)
        : undefined
}
const getOuLevelOrGroupName = (ouId, metaData) =>
    ouIdHelper.hasGroupPrefix(ouId) || ouIdHelper.hasLevelPrefix(ouId)
        ? metaData[ouIdHelper.removePrefix(ouId)]?.name
        : undefined

export const getConditionsTexts = ({
    conditions = {},
    metadata = {},
    dimension = {},
    formatValueOptions = {},
}) => {
    const conditionsList = parseConditionsStringToArray(conditions.condition)

    if (conditions.legendSet) {
        if (!conditionsList?.length) {
            return [metadata[conditions.legendSet]?.name]
        } else {
            const legends = parseCondition(conditionsList[0])
            const allLegends = metadata[conditions.legendSet]?.legends || []

            const legendNames = legends.map(
                (legend) => allLegends.find((l) => l.id === legend)?.name
            )
            return legendNames
        }
    }

    if (dimension.optionSet && conditionsList[0]?.startsWith(OPERATOR_IN)) {
        const items = parseCondition(conditionsList[0])

        const itemNames = items.map(
            (code) =>
                lookupOptionSetOptionMetadata(
                    dimension.optionSet,
                    code,
                    metadata
                )?.name
        )
        return itemNames
    }

    if (
        [VALUE_TYPE_BOOLEAN, VALUE_TYPE_TRUE_ONLY].includes(
            dimension.valueType
        ) &&
        conditionsList[0]?.startsWith(OPERATOR_IN)
    ) {
        const values = parseCondition(conditionsList[0])
        const valueNames = values.map((value) => getBooleanValues()[value])
        return valueNames
    }

    if (
        dimension.valueType === VALUE_TYPE_ORGANISATION_UNIT &&
        (conditionsList[0]?.startsWith(OPERATOR_EQUAL) ||
            conditionsList[0]?.startsWith(OPERATOR_IN))
    ) {
        const ouIds = parseCondition(conditionsList[0])
        const ouNames = ouIds.map(
            (ouId) =>
                metadata[ouId]?.name ??
                getOuLevelOrGroupName(ouId, metadata) ??
                // Default to showing the ID, but this should never happen
                ouId
        )
        return ouNames
    }

    const operators = getOperatorsByValueType(dimension.valueType)

    const parsedConditions = conditionsList.map((condition) => {
        let operator, value

        if (condition.includes(NULL_VALUE)) {
            operator = condition
        } else {
            const parts = condition.split(':')
            const valueType =
                dimension.dimensionType === DIMENSION_TYPE_PROGRAM_INDICATOR
                    ? VALUE_TYPE_NUMBER
                    : dimension.valueType
            operator = removeCaseSensitivePrefix(parts[0])
            value = formatValue(parts[1], valueType, formatValueOptions)
        }

        if (
            value &&
            [VALUE_TYPE_TIME, VALUE_TYPE_DATETIME].includes(dimension.valueType)
        ) {
            value = value.replaceAll(API_TIME_DIVIDER, UI_TIME_DIVIDER)
        }
        if (value && dimension.valueType === VALUE_TYPE_DATETIME) {
            value = value.replaceAll(API_DATETIME_DIVIDER, UI_DATETIME_DIVIDER)
        }

        const operatorName = operators[operator]
        const capitalCaseOperatorName =
            operatorName[0].toUpperCase() + operatorName.substring(1)
        return value
            ? `${capitalCaseOperatorName}: ${value}`
            : capitalCaseOperatorName
    })

    return parsedConditions
}

export const getConditionsFromVisualization = (vis) =>
    [...vis.columns, ...vis.rows, ...vis.filters]
        .filter((item) => item.filter || item.legendSet)
        .reduce(
            (acc, key) => ({
                ...acc,
                [formatDimensionId({
                    dimensionId: key.dimension,
                    programStageId: key.programStage?.id,
                    programId: key.program?.id,
                    outputType: vis.outputType,
                })]: {
                    condition: key.filter,
                    legendSet: key.legendSet?.id,
                },
            }),
            {}
        )
