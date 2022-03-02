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
    [OPERATOR_GREATER_OR_EQUAL]: i18n.t('after and including'),
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
