import i18n from '@dhis2/d2-i18n'

// parse e.g. 'LT:25:GT:15' to ['LT:25', 'GT:15']
export const parseConditionsStringToArray = (conditionsString) =>
    conditionsString?.match(/[^:]+:[^:]+/g) || conditionsString || []

// parse e.g. ['LT:25', 'GT:15'] to 'LT:25:GT:15'
export const parseConditionsArrayToString = (conditionsArray) =>
    conditionsArray.join(':')

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

export const NUMERIC_OPERATORS = {
    [OPERATOR_EQUAL]: i18n.t('equal to (=)'),
    [OPERATOR_GREATER]: i18n.t('greater than (>)'),
    [OPERATOR_GREATER_OR_EQUAL]: i18n.t('greater than or equal to (≥)'),
    [OPERATOR_LESS]: i18n.t('less than (<)'),
    [OPERATOR_LESS_OR_EQUAL]: i18n.t('less than or equal to (≤)'),
    [OPERATOR_NOT_EQUAL]: i18n.t('not equal to (≠)'),
    [OPERATOR_EMPTY]: i18n.t('is empty / null'),
    [OPERATOR_NOT_EMPTY]: i18n.t('is not empty / not null'),
}

export const ALPHA_NUMERIC_OPERATORS = {
    [OPERATOR_EQUAL]: i18n.t('exactly'),
    [OPERATOR_NOT_EQUAL]: i18n.t('is not'),
    [OPERATOR_CONTAINS]: i18n.t('contains'),
    [OPERATOR_NOT_CONTAINS]: i18n.t('does not contain'),
    [OPERATOR_EMPTY]: i18n.t('is empty / null'),
    [OPERATOR_NOT_EMPTY]: i18n.t('is not empty / not null'),
}

export const DATE_OPERATORS = {
    [OPERATOR_EQUAL]: i18n.t('exactly'),
    [OPERATOR_NOT_EQUAL]: i18n.t('is not'),
    [OPERATOR_GREATER]: i18n.t('after'),
    [OPERATOR_GREATER_OR_EQUAL]: i18n.t('after or including'),
    [OPERATOR_LESS]: i18n.t('before'),
    [OPERATOR_LESS_OR_EQUAL]: i18n.t('before or including'),
    [OPERATOR_EMPTY]: i18n.t('is empty / null'),
    [OPERATOR_NOT_EMPTY]: i18n.t('is not empty / not null'),
}

export const BOOLEAN_VALUES = {
    [TRUE_VALUE]: i18n.t('Yes'),
    [FALSE_VALUE]: i18n.t('No'),
    [NULL_VALUE]: i18n.t('Not answered'),
}

export const VALUE_TYPE_NUMBER = 'NUMBER'
export const VALUE_TYPE_UNIT_INTERVAL = 'UNIT_INTERVAL'
export const VALUE_TYPE_PERCENTAGE = 'PERCENTAGE'
export const VALUE_TYPE_INTEGER = 'INTEGER'
export const VALUE_TYPE_INTEGER_POSITIVE = 'INTEGER_POSITIVE'
export const VALUE_TYPE_INTEGER_NEGATIVE = 'INTEGER_NEGATIVE'
export const VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE = 'INTEGER_ZERO_OR_POSITIVE'
export const VALUE_TYPE_TEXT = 'TEXT'
export const VALUE_TYPE_LONG_TEXT = 'LONG_TEXT'
export const VALUE_TYPE_LETTER = 'LETTER'
export const VALUE_TYPE_PHONE_NUMBER = 'PHONE_NUMBER'
export const VALUE_TYPE_EMAIL = 'EMAIL'
export const VALUE_TYPE_USERNAME = 'USERNAME'
export const VALUE_TYPE_URL = 'URL'
export const VALUE_TYPE_BOOLEAN = 'BOOLEAN'
export const VALUE_TYPE_TRUE_ONLY = 'TRUE_ONLY'
export const VALUE_TYPE_DATE = 'DATE'
export const VALUE_TYPE_TIME = 'TIME'
export const VALUE_TYPE_DATETIME = 'DATETIME'
export const VALUE_TYPE_ORGANISATION_UNIT = 'ORGANISATION_UNIT'

export const API_TIME_DIVIDER = '.'
export const UI_TIME_DIVIDER = ':'
export const API_DATETIME_DIVIDER = 'T'
export const UI_DATETIME_DIVIDER = ' '

export const prefixOperator = (operator, isCaseSensitive) => {
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

export const unprefixOperator = (operator) => {
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
        case VALUE_TYPE_URL: {
            return ALPHA_NUMERIC_OPERATORS
        }
        case VALUE_TYPE_DATE:
        case VALUE_TYPE_TIME:
        case VALUE_TYPE_DATETIME: {
            return DATE_OPERATORS
        }
        case VALUE_TYPE_NUMBER:
        case VALUE_TYPE_UNIT_INTERVAL:
        case VALUE_TYPE_PERCENTAGE:
        case VALUE_TYPE_INTEGER:
        case VALUE_TYPE_INTEGER_POSITIVE:
        case VALUE_TYPE_INTEGER_NEGATIVE:
        case VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE:
        case VALUE_TYPE_PHONE_NUMBER:
        default: {
            return NUMERIC_OPERATORS
        }
    }
}

const parseCondition = (conditionItem) =>
    conditionItem.split(':').pop().split(';')

export const getConditions = ({
    conditions = {},
    metadata = {},
    dimension = {},
}) => {
    const conditionsList = parseConditionsStringToArray(conditions.condition)

    if (conditions.legendSet) {
        if (!conditionsList?.length) {
            return [metadata[conditions.legendSet]?.name]
        } else {
            const legends = parseCondition(conditionsList[0])
            const allLegends = metadata[conditions.legendSet]?.legends
            const legendNames = legends.map(
                (legend) => allLegends.find((l) => l.id === legend).name
            )
            return legendNames
        }
    }

    if (dimension.optionSet && conditionsList[0]?.startsWith(OPERATOR_IN)) {
        const items = parseCondition(conditionsList[0])
        const itemNames = items.map(
            (code) =>
                Object.values(metadata).find((item) => item.code === code).name
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
        const valueNames = values.map((value) => BOOLEAN_VALUES[value])
        return valueNames
    }

    if (
        dimension.valueType === VALUE_TYPE_ORGANISATION_UNIT &&
        conditionsList[0]?.startsWith(OPERATOR_EQUAL)
    ) {
        const ous = parseCondition(conditionsList[0])
        const ouNames = ous.map((ou) => metadata[ou]?.name)
        return ouNames
    }

    const operators = getOperatorsByValueType(dimension.valueType)

    const parsedConditions = conditionsList.map((condition) => {
        let operator, value

        if (condition.includes(NULL_VALUE)) {
            operator = condition
        } else {
            const parts = condition.split(':')
            operator = unprefixOperator(parts[0])
            value = parts[1]
        }

        if (
            [VALUE_TYPE_TIME, VALUE_TYPE_DATETIME].includes(dimension.valueType)
        ) {
            value = value.replaceAll(API_TIME_DIVIDER, UI_TIME_DIVIDER)
        }
        if (dimension.valueType === VALUE_TYPE_DATETIME) {
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
