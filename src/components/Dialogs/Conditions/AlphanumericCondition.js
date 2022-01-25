import i18n from '@dhis2/d2-i18n'
import {
    SingleSelectField,
    SingleSelectOption,
    Button,
    Input,
    Checkbox,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import {
    NULL_VALUE,
    OPERATOR_CONTAINS,
    OPERATOR_EMPTY,
    OPERATOR_EQUAL,
    OPERATOR_NOT_CONTAINS,
    OPERATOR_NOT_EMPTY,
    OPERATOR_NOT_EQUAL,
    CASE_INSENSITIVE_PREFIX,
    NOT_PREFIX,
} from '../../../modules/conditions.js'
import classes from './styles/Condition.module.css'

const operators = {
    [OPERATOR_EQUAL]: i18n.t('exactly'),
    [OPERATOR_NOT_EQUAL]: i18n.t('is not'),
    [OPERATOR_CONTAINS]: i18n.t('contains'),
    [OPERATOR_NOT_CONTAINS]: i18n.t('does not contain'),
    [OPERATOR_EMPTY]: i18n.t('is empty / null'),
    [OPERATOR_NOT_EMPTY]: i18n.t('is not empty / not null'),
}

const prefixOperator = (operator, isCaseSensitive) => {
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

const unprefixOperator = (operator) => {
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

const checkIsCaseSensitive = (operator) => {
    if (operator[0] === NOT_PREFIX) {
        // !LIKE, !ILIKE, !EQ, !IEQ
        return operator[1] !== CASE_INSENSITIVE_PREFIX
    } else {
        // LIKE, ILIKE, EQ, IEQ
        return operator[0] !== CASE_INSENSITIVE_PREFIX
    }
}

const BaseCondition = ({
    condition,
    onChange,
    onRemove,
    allowCaseSensitive,
}) => {
    let operator, value, isCaseSensitive

    useEffect(() => {
        if (!condition?.length) {
            onChange(`${CASE_INSENSITIVE_PREFIX}:`)
        }
    }, [condition])

    if (condition.includes(NULL_VALUE)) {
        operator = condition
    } else {
        const parts = condition.split(':')
        isCaseSensitive = checkIsCaseSensitive(parts[0])
        operator = unprefixOperator(parts[0])
        value = parts[1]
    }

    const setOperator = (input) => {
        if (input.includes(NULL_VALUE)) {
            onChange(`${input}`)
        } else {
            onChange(`${prefixOperator(input, isCaseSensitive)}:${value || ''}`)
        }
    }

    const setValue = (input) => {
        onChange(`${prefixOperator(operator, isCaseSensitive)}:${input || ''}`)
    }

    const toggleCaseSensitive = (cs) => {
        onChange(`${prefixOperator(operator, cs)}:${value || ''}`)
    }

    return (
        <div className={classes.container}>
            <SingleSelectField
                selected={operator}
                placeholder={i18n.t('Choose a condition type')}
                dense
                onChange={({ selected }) => setOperator(selected)}
            >
                {Object.keys(operators).map((key) => (
                    <SingleSelectOption
                        key={key}
                        value={key}
                        label={operators[key]}
                    />
                ))}
            </SingleSelectField>
            {operator && !operator.includes(NULL_VALUE) && (
                <Input
                    value={value}
                    type="text"
                    onChange={({ value }) => setValue(value)}
                    width="150px"
                    dense
                />
            )}
            {allowCaseSensitive &&
                ![OPERATOR_EMPTY, OPERATOR_NOT_EMPTY].includes(operator) && (
                    <Checkbox
                        checked={isCaseSensitive}
                        label={i18n.t('Case sensitive')}
                        onChange={({ checked }) => toggleCaseSensitive(checked)}
                        dense
                        className={classes.caseSensitiveCheckbox}
                    />
                )}
            <Button
                type="button"
                small
                secondary
                onClick={onRemove}
                className={classes.removeButton}
            >
                {i18n.t('Remove')}
            </Button>
        </div>
    )
}

BaseCondition.propTypes = {
    condition: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    allowCaseSensitive: PropTypes.bool,
}

export const AlphanumericCondition = (props) => <BaseCondition {...props} />

export const CaseSensitiveAlphanumericCondition = (props) => (
    <BaseCondition allowCaseSensitive={true} {...props} />
)
