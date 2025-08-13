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
    CASE_INSENSITIVE_PREFIX,
    OPERATOR_NOT_EMPTY,
    OPERATOR_EMPTY,
    addCaseSensitivePrefix,
    removeCaseSensitivePrefix,
    checkIsCaseSensitive,
    getAlphaNumericOperators,
} from '../../../modules/conditions.js'
import classes from './styles/Condition.module.css'

const BaseCondition = ({
    condition,
    onChange,
    onRemove,
    allowCaseSensitive,
    valueClassName,
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
        operator = removeCaseSensitivePrefix(parts[0])
        value = parts[1]
    }

    const setOperator = (input) => {
        if (input.includes(NULL_VALUE)) {
            onChange(`${input}`)
        } else {
            onChange(
                `${addCaseSensitivePrefix(input, isCaseSensitive)}:${
                    value || ''
                }`
            )
        }
    }

    const setValue = (input) => {
        onChange(
            `${addCaseSensitivePrefix(operator, isCaseSensitive)}:${
                input || ''
            }`
        )
    }

    const toggleCaseSensitive = (cs) => {
        onChange(`${addCaseSensitivePrefix(operator, cs)}:${value || ''}`)
    }

    return (
        <div className={classes.container} data-test={'alphanumeric-condition'}>
            <SingleSelectField
                selected={operator}
                placeholder={i18n.t('Choose a condition type')}
                dense
                onChange={({ selected }) => setOperator(selected)}
                className={classes.operatorSelect}
            >
                {Object.entries(getAlphaNumericOperators()).map(
                    ([key, value]) => (
                        <SingleSelectOption
                            key={key}
                            value={key}
                            label={value}
                            dataTest="alphanumeric-condition-type"
                        />
                    )
                )}
            </SingleSelectField>
            {operator && !operator.includes(NULL_VALUE) && (
                <Input
                    value={value}
                    type="text"
                    onChange={({ value }) => setValue(value)}
                    className={valueClassName || classes.textInput}
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
                        dataTest="condition-case-sensitive-checkbox"
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
    valueClassName: PropTypes.object,
}

export const PhoneNumberCondition = (props) => (
    <BaseCondition valueClassName={classes.phoneNumberInput} {...props} />
)

export const LetterCondition = (props) => (
    <BaseCondition
        valueClassName={classes.letterInput}
        allowCaseSensitive={true}
        {...props}
    />
)

export const CaseSensitiveAlphanumericCondition = (props) => (
    <BaseCondition allowCaseSensitive={true} {...props} />
)
