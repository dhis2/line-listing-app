import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    SingleSelectField,
    SingleSelectOption,
    Button,
    Input,
    MultiSelectField,
    MultiSelectOption,
    MenuDivider,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { apiFetchLegendSetById } from '../../../api/legendSets.js'
import {
    OPERATOR_EQUAL,
    OPERATOR_GREATER,
    OPERATOR_GREATER_OR_EQUAL,
    OPERATOR_LESS,
    OPERATOR_LESS_OR_EQUAL,
    OPERATOR_NOT_EQUAL,
    OPERATOR_EMPTY,
    OPERATOR_NOT_EMPTY,
    OPERATOR_IN,
} from '../../../modules/conditions.js'
import classes from './styles/Condition.module.css'

const NULL_VALUE = 'NV'

const operators = {
    [OPERATOR_EQUAL]: i18n.t('equal to (=)'),
    [OPERATOR_GREATER]: i18n.t('greater than (>)'),
    [OPERATOR_GREATER_OR_EQUAL]: i18n.t('greater than or equal to (≥)'),
    [OPERATOR_LESS]: i18n.t('less than (<)'),
    [OPERATOR_LESS_OR_EQUAL]: i18n.t('less than or equal to (≤)'),
    [OPERATOR_NOT_EQUAL]: i18n.t('not equal to (≠)'),
    [OPERATOR_EMPTY]: i18n.t('is empty / null'),
    [OPERATOR_NOT_EMPTY]: i18n.t('is not empty / not null'),
}

const NumericCondition = ({
    condition,
    onChange,
    onRemove,
    legendSetId,
    availableLegendSets,
    numberOfConditions,
    onLegendSetChange,
    enableDecimalSteps,
}) => {
    let operator, value

    const [legendSet, setLegendSet] = useState()

    const dataEngine = useDataEngine()

    if (condition.includes(NULL_VALUE)) {
        operator = condition
    } else if (legendSetId && !condition) {
        operator = OPERATOR_IN
    } else {
        const parts = condition.split(':')
        operator = parts[0]
        value = parts[1]
    }

    const setOperator = (input) => {
        if (input.includes(NULL_VALUE)) {
            onChange(`${input}`)
        } else if (input === OPERATOR_IN || operator === OPERATOR_IN) {
            onChange(`${input}:`)
        } else {
            onChange(`${input}:${value || ''}`)
        }
        if (!input.includes(OPERATOR_IN) && legendSetId) {
            onLegendSetChange()
        }
    }

    useEffect(() => {
        const fetchLegendSet = async () => {
            const result = await apiFetchLegendSetById({
                dataEngine,
                id: legendSetId,
            })
            setLegendSet(result)
        }
        if (availableLegendSets && legendSetId) {
            fetchLegendSet()
        }
    }, [legendSetId])

    const setValue = (input) => onChange(`${operator}:${input || ''}`)

    return (
        <div className={classes.container}>
            <SingleSelectField
                selected={operator}
                placeholder={i18n.t('Choose a condition type')}
                dense
                onChange={({ selected }) => setOperator(selected)}
                className={classes.operatorSelect}
            >
                {Object.keys(operators).map((key) => (
                    <SingleSelectOption
                        key={key}
                        value={key}
                        label={operators[key]}
                    />
                ))}
                {availableLegendSets && <MenuDivider dense />}
                {availableLegendSets && (
                    <SingleSelectOption
                        key={OPERATOR_IN}
                        value={OPERATOR_IN}
                        label={i18n.t('is one of preset options')}
                        disabled={numberOfConditions > 1}
                    />
                )}
            </SingleSelectField>
            {operator &&
                !operator.includes(NULL_VALUE) &&
                operator !== OPERATOR_IN && (
                    <Input
                        value={value}
                        type="number"
                        onChange={({ value }) => setValue(value)}
                        className={classes.numbericInput}
                        dense
                        step={enableDecimalSteps ? '0.1' : '1'}
                    />
                )}
            {operator === OPERATOR_IN &&
                availableLegendSets &&
                ((legendSetId && legendSet) || !legendSetId) && (
                    <>
                        <SingleSelectField
                            className={classes.legendSetSelect}
                            selected={legendSet?.id}
                            placeholder={i18n.t('Choose a set of options')}
                            dense
                            onChange={({ selected }) => {
                                onLegendSetChange(selected)
                                setValue(null)
                            }}
                            empty={i18n.t(
                                'No preset option sets for this data item'
                            )}
                        >
                            {availableLegendSets.map((item) => (
                                <SingleSelectOption
                                    key={item.id}
                                    value={item.id}
                                    label={item.name}
                                />
                            ))}
                        </SingleSelectField>
                        {legendSet?.legends && (
                            <MultiSelectField
                                onChange={({ selected }) =>
                                    setValue(selected.join(';'))
                                }
                                selected={
                                    (value?.length && value.split(';')) || []
                                }
                                dense
                                className={classes.legendSelect}
                            >
                                {legendSet.legends
                                    .sort((a, b) => a.startValue - b.startValue)
                                    .map((legend) => (
                                        <MultiSelectOption
                                            key={legend.id}
                                            value={legend.id}
                                            label={legend.name}
                                        />
                                    ))}
                            </MultiSelectField>
                        )}
                    </>
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

NumericCondition.propTypes = {
    condition: PropTypes.string.isRequired,
    numberOfConditions: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onLegendSetChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    availableLegendSets: PropTypes.array,
    enableDecimalSteps: PropTypes.bool,
    legendSetId: PropTypes.string,
}

export default NumericCondition
