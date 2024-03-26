import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption, Button, Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    NULL_VALUE,
    UI_TIME_DIVIDER,
    API_TIME_DIVIDER,
    getDateOperators,
} from '../../../modules/conditions.js'
import classes from './styles/Condition.module.css'

const TYPE_DATE = 'date'
const TYPE_DATETIME = 'datetime-local'
const TYPE_TIME = 'time'

const BaseCondition = ({ condition, onChange, onRemove, type, max }) => {
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
        onChange(
            `${operator}:${
                input?.replaceAll(UI_TIME_DIVIDER, API_TIME_DIVIDER) || ''
            }`
        )
    }

    return (
        <div className={classes.container}>
            <SingleSelectField
                selected={operator}
                placeholder={i18n.t('Choose a condition type')}
                dense
                onChange={({ selected }) => setOperator(selected)}
                className={classes.operatorSelect}
            >
                {Object.entries(getDateOperators()).map(([key, value]) => (
                    <SingleSelectOption
                        key={key}
                        value={key}
                        label={value}
                        dataTest="date-condition-type"
                    />
                ))}
            </SingleSelectField>
            {operator && !operator.includes(NULL_VALUE) && (
                <Input
                    value={value?.replaceAll(API_TIME_DIVIDER, UI_TIME_DIVIDER)}
                    type={type}
                    onChange={({ value }) => setValue(value)}
                    className={classes.dateInput}
                    max={max}
                    dense
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
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    max: PropTypes.string,
}

export const DateCondition = (props) => (
    <BaseCondition type={TYPE_DATE} max="9999-12-31" {...props} />
)

export const DateTimeCondition = (props) => (
    <BaseCondition type={TYPE_DATETIME} max="9999-12-31T23:59:59" {...props} />
)

export const TimeCondition = (props) => (
    <BaseCondition type={TYPE_TIME} {...props} />
)
