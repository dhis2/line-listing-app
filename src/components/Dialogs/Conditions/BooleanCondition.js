import { Checkbox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    OPERATOR_IN,
    NULL_VALUE,
    TRUE_VALUE,
    FALSE_VALUE,
    BOOLEAN_VALUES,
} from '../../../modules/conditions.js'
import classes from './styles/Condition.module.css'

const BaseCondition = ({ condition, onChange, showFalseOption }) => {
    const parts = condition.split(':')
    const values = parts[1] || ''

    const onCheckboxChange = (input, checked) => {
        const currentValues = values.length ? values.split(';') : []
        if (checked) {
            setValues([...currentValues, input].join(';'))
        } else {
            setValues(currentValues.filter((v) => v !== input).join(';'))
        }
    }

    const setValues = (input) => {
        onChange(`${OPERATOR_IN}:${input || ''}`)
    }

    return (
        <div className={classes.container}>
            <Checkbox
                checked={values.includes(TRUE_VALUE)}
                label={BOOLEAN_VALUES[TRUE_VALUE]}
                onChange={({ checked }) =>
                    onCheckboxChange(TRUE_VALUE, checked)
                }
                dense
                className={classes.checkboxOption}
            />
            {showFalseOption && (
                <Checkbox
                    checked={values.includes(FALSE_VALUE)}
                    label={BOOLEAN_VALUES[FALSE_VALUE]}
                    onChange={({ checked }) =>
                        onCheckboxChange(FALSE_VALUE, checked)
                    }
                    dense
                    className={classes.checkboxOption}
                />
            )}
            <Checkbox
                checked={values.includes(NULL_VALUE)}
                label={BOOLEAN_VALUES[NULL_VALUE]}
                onChange={({ checked }) =>
                    onCheckboxChange(NULL_VALUE, checked)
                }
                dense
                className={classes.checkboxOption}
            />
        </div>
    )
}

BaseCondition.propTypes = {
    condition: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    showFalseOption: PropTypes.boolean,
}

export const BooleanCondition = (props) => (
    <BaseCondition showFalseOption={true} {...props} />
)

export const TrueOnlyCondition = (props) => <BaseCondition {...props} />
