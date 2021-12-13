import i18n from '@dhis2/d2-i18n'
import {
    SingleSelectField,
    SingleSelectOption,
    Button,
    Input,
    Checkbox,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/Condition.module.css'

const NULL_VALUE = 'NV'
export const OPERATOR_EQUAL = 'EQ'
export const OPERATOR_NOT_EQUAL = '!EQ'
export const OPERATOR_CONTAINS = 'LIKE'
export const OPERATOR_NOT_CONTAINS = '!LIKE'
export const OPERATOR_EMPTY = `EQ:${NULL_VALUE}`
export const OPERATOR_NOT_EMPTY = `NE:${NULL_VALUE}`
export const OPERATOR_EQUAL_CASE_SENSITIVE = 'IEQ'
export const OPERATOR_NOT_EQUAL_CASE_SENSITIVE = '!IEQ'
export const OPERATOR_CONTAINS_CASE_SENSITIVE = 'ILIKE'
export const OPERATOR_NOT_CONTAINS_CASE_SENSITIVE = '!ILIKE'

const operators = {
    [OPERATOR_EQUAL]: i18n.t('exactly'),
    [OPERATOR_NOT_EQUAL]: i18n.t('is not'),
    [OPERATOR_CONTAINS]: i18n.t('contains'),
    [OPERATOR_NOT_CONTAINS]: i18n.t('does not contain'),
    [OPERATOR_EMPTY]: i18n.t('is empty / null'),
    [OPERATOR_NOT_EMPTY]: i18n.t('is not empty / not null'),
}

const AlphanumericCondition = ({
    condition,
    onChange,
    onRemove,
    allowCaseSensitive,
}) => {
    let operator, value

    if (condition.includes(NULL_VALUE)) {
        operator = condition
    } else {
        const parts = condition.split(':')
        operator = parts[0]
        value = parts[1]
    }

    const setOperator = (input) => {
        if (input.includes(NULL_VALUE)) {
            onChange(`${input}`)
        } else {
            onChange(`${input}:${value || ''}`)
        }
    }

    const setValue = (input) => {
        onChange(`${operator}:${input || ''}`)
    }

    const toggleCaseSensitive = (state) => {
        switch (operator) {
            case OPERATOR_EQUAL:
            case OPERATOR_EQUAL_CASE_SENSITIVE:
                setOperator(
                    state ? OPERATOR_EQUAL_CASE_SENSITIVE : OPERATOR_EQUAL
                )
                break
            case OPERATOR_NOT_EQUAL:
            case OPERATOR_NOT_EQUAL_CASE_SENSITIVE:
                setOperator(
                    state
                        ? OPERATOR_NOT_EQUAL_CASE_SENSITIVE
                        : OPERATOR_NOT_EQUAL
                )
                break
            case OPERATOR_CONTAINS:
            case OPERATOR_CONTAINS_CASE_SENSITIVE:
                setOperator(
                    state ? OPERATOR_CONTAINS_CASE_SENSITIVE : OPERATOR_CONTAINS
                )
                break
            case OPERATOR_NOT_CONTAINS:
            case OPERATOR_NOT_CONTAINS_CASE_SENSITIVE:
                setOperator(
                    state
                        ? OPERATOR_NOT_CONTAINS_CASE_SENSITIVE
                        : OPERATOR_NOT_CONTAINS
                )
                break
        }
    }

    const useGenericOperator = (operator) => {
        switch (operator) {
            case OPERATOR_EQUAL_CASE_SENSITIVE:
                return OPERATOR_EQUAL
            case OPERATOR_NOT_EQUAL_CASE_SENSITIVE:
                return OPERATOR_NOT_EQUAL
            case OPERATOR_CONTAINS_CASE_SENSITIVE:
                return OPERATOR_CONTAINS
            case OPERATOR_NOT_CONTAINS_CASE_SENSITIVE:
                return OPERATOR_NOT_CONTAINS
            default:
                return operator
        }
    }

    return (
        <div className={classes.container}>
            <SingleSelectField
                selected={useGenericOperator(operator)}
                inputWidth="180px"
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
                        checked={[
                            OPERATOR_EQUAL_CASE_SENSITIVE,
                            OPERATOR_NOT_EQUAL_CASE_SENSITIVE,
                            OPERATOR_CONTAINS_CASE_SENSITIVE,
                            OPERATOR_NOT_CONTAINS_CASE_SENSITIVE,
                        ].includes(operator)}
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

AlphanumericCondition.propTypes = {
    condition: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    allowCaseSensitive: PropTypes.bool,
}

export default AlphanumericCondition
