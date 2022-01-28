import i18n from '@dhis2/d2-i18n'
import { Button, IconInfo16, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { tSetCurrentFromUi } from '../../../actions/current.js'
import { acSetUiConditions } from '../../../actions/ui.js'
import {
    OPERATOR_IN,
    parseConditionsArrayToString,
    parseConditionsStringToArray,
} from '../../../modules/conditions.js'
import { sGetMetadata } from '../../../reducers/metadata.js'
import { sGetSettingsDisplayNameProperty } from '../../../reducers/settings.js'
import {
    sGetDimensionIdsFromLayout,
    sGetUiConditionsByDimension,
} from '../../../reducers/ui.js'
import DimensionModal from '../DimensionModal.js'
import {
    PhoneNumberCondition,
    CaseSensitiveAlphanumericCondition,
    LetterCondition,
} from './AlphanumericCondition.js'
import { BooleanCondition, TrueOnlyCondition } from './BooleanCondition.js'
import {
    DateCondition,
    DateTimeCondition,
    TimeCondition,
} from './DateCondition.js'
import NumericCondition from './NumericCondition.js'
import OptionSetCondition from './OptionSetCondition.js'
import OrgUnitCondition from './OrgUnitCondition.js'
import classes from './styles/ConditionsManager.module.css'

const VALUE_TYPE_NUMBER = 'NUMBER'
const VALUE_TYPE_UNIT_INTERVAL = 'UNIT_INTERVAL'
const VALUE_TYPE_PERCENTAGE = 'PERCENTAGE'
const VALUE_TYPE_INTEGER = 'INTEGER'
const VALUE_TYPE_INTEGER_POSITIVE = 'INTEGER_POSITIVE'
const VALUE_TYPE_INTEGER_NEGATIVE = 'INTEGER_NEGATIVE'
const VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE = 'INTEGER_ZERO_OR_POSITIVE'
const VALUE_TYPE_TEXT = 'TEXT'
const VALUE_TYPE_LONG_TEXT = 'LONG_TEXT'
const VALUE_TYPE_LETTER = 'LETTER'
const VALUE_TYPE_PHONE_NUMBER = 'PHONE_NUMBER'
const VALUE_TYPE_EMAIL = 'EMAIL'
const VALUE_TYPE_USERNAME = 'USERNAME'
const VALUE_TYPE_URL = 'URL'
const VALUE_TYPE_BOOLEAN = 'BOOLEAN'
const VALUE_TYPE_TRUE_ONLY = 'TRUE_ONLY'
const VALUE_TYPE_DATE = 'DATE'
const VALUE_TYPE_TIME = 'TIME'
const VALUE_TYPE_DATETIME = 'DATETIME'
const VALUE_TYPE_ORGANISATION_UNIT = 'ORGANISATION_UNIT'
const DIMENSION_TYPE_PROGRAM_INDICATOR = 'PROGRAM_INDICATOR'

const NUMERIC_TYPES = [
    VALUE_TYPE_NUMBER,
    VALUE_TYPE_UNIT_INTERVAL,
    VALUE_TYPE_PERCENTAGE,
    VALUE_TYPE_INTEGER,
    VALUE_TYPE_INTEGER_POSITIVE,
    VALUE_TYPE_INTEGER_NEGATIVE,
    VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
]

const SINGLETON_TYPES = [
    VALUE_TYPE_BOOLEAN,
    VALUE_TYPE_TRUE_ONLY,
    VALUE_TYPE_ORGANISATION_UNIT,
]

const EMPTY_CONDITION = ''

const ConditionsManager = ({
    conditions,
    isInLayout,
    onUpdate,
    dimension,
    onClose,
    setConditionsByDimension,
}) => {
    const valueType = VALUE_TYPE_INTEGER_POSITIVE //dimension.valueType
    const isProgramIndicator =
        dimension.dimensionType === DIMENSION_TYPE_PROGRAM_INDICATOR
    const isOptionSetCondition =
        valueType === VALUE_TYPE_TEXT && dimension.optionSet
    const canHaveLegendSets =
        NUMERIC_TYPES.includes(valueType) || isProgramIndicator

    const getInitConditions = () =>
        conditions.condition?.length
            ? parseConditionsStringToArray(conditions.condition)
            : null

    const getEmptyConditions = () =>
        SINGLETON_TYPES.includes(valueType) ||
        isOptionSetCondition ||
        conditions.legendSet
            ? [EMPTY_CONDITION]
            : []

    const [conditionsList, setConditionsList] = useState(
        getInitConditions() || getEmptyConditions()
    )

    const [selectedLegendSet, setSelectedLegendSet] = useState(
        conditions.legendSet
    )

    const addCondition = () =>
        setConditionsList([...conditionsList, EMPTY_CONDITION])

    const removeCondition = (conditionIndex) => {
        const filteredConditionsList = conditionsList.filter(
            (_, index) => index !== conditionIndex
        )
        setConditionsList(filteredConditionsList)
        if (
            selectedLegendSet &&
            !filteredConditionsList.some((condition) =>
                condition.includes(OPERATOR_IN)
            )
        ) {
            setSelectedLegendSet(null)
        }
    }

    const setCondition = (conditionIndex, value) =>
        setConditionsList(
            conditionsList.map((condition, index) =>
                index === conditionIndex ? value : condition
            )
        )

    const storeConditions = () =>
        setConditionsByDimension({
            inputCondition: parseConditionsArrayToString(
                conditionsList.filter(
                    (cnd) => cnd.length && cnd.slice(-1) !== ':'
                )
            ),
            dimension: dimension.id,
            legendSet: selectedLegendSet,
        })

    const primaryOnClick = () => {
        storeConditions()
        onUpdate()
        onClose()
    }

    const closeModal = () => {
        storeConditions()
        onClose()
    }

    const renderConditionsContent = () => {
        const getDividerContent = (index) =>
            conditionsList.length > 1 &&
            index < conditionsList.length - 1 && (
                <span className={classes.separator}>{i18n.t('and')}</span>
            )

        if (isOptionSetCondition) {
            return conditionsList.map((condition, index) => (
                <div key={index}>
                    <OptionSetCondition
                        condition={condition}
                        optionSetId={dimension.optionSet}
                        onChange={(value) => setCondition(index, value)}
                    />
                </div>
            ))
        }

        const renderNumericCondition = () => {
            const enableDecimalSteps = valueType === VALUE_TYPE_UNIT_INTERVAL

            return (
                (conditionsList.length && conditionsList) ||
                (selectedLegendSet && [''])
            ).map((condition, index) => (
                <div key={index}>
                    <NumericCondition
                        condition={condition}
                        onChange={(value) => setCondition(index, value)}
                        onRemove={() => removeCondition(index)}
                        numberOfConditions={
                            conditionsList.length || (selectedLegendSet ? 1 : 0)
                        }
                        legendSetId={selectedLegendSet}
                        onLegendSetChange={(value) =>
                            setSelectedLegendSet(value)
                        }
                        enableDecimalSteps={enableDecimalSteps}
                        dimension={dimension}
                    />
                    {getDividerContent(index)}
                </div>
            ))
        }

        if (isProgramIndicator) {
            return renderNumericCondition()
        }

        switch (valueType) {
            case VALUE_TYPE_NUMBER:
            case VALUE_TYPE_UNIT_INTERVAL:
            case VALUE_TYPE_PERCENTAGE:
            case VALUE_TYPE_INTEGER:
            case VALUE_TYPE_INTEGER_POSITIVE:
            case VALUE_TYPE_INTEGER_NEGATIVE:
            case VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE: {
                return renderNumericCondition()
            }
            case VALUE_TYPE_PHONE_NUMBER: {
                return conditionsList.map((condition, index) => (
                    <div key={index}>
                        <PhoneNumberCondition
                            condition={condition}
                            onChange={(value) => setCondition(index, value)}
                            onRemove={() => removeCondition(index)}
                        />
                        {getDividerContent(index)}
                    </div>
                ))
            }
            case VALUE_TYPE_LETTER: {
                return conditionsList.map((condition, index) => (
                    <div key={index}>
                        <LetterCondition
                            condition={condition}
                            onChange={(value) => setCondition(index, value)}
                            onRemove={() => removeCondition(index)}
                        />
                        {getDividerContent(index)}
                    </div>
                ))
            }
            case VALUE_TYPE_TEXT:
            case VALUE_TYPE_LONG_TEXT:
            case VALUE_TYPE_EMAIL:
            case VALUE_TYPE_USERNAME:
            case VALUE_TYPE_URL: {
                return conditionsList.map((condition, index) => (
                    <div key={index}>
                        <CaseSensitiveAlphanumericCondition
                            condition={condition}
                            onChange={(value) => setCondition(index, value)}
                            onRemove={() => removeCondition(index)}
                        />
                        {getDividerContent(index)}
                    </div>
                ))
            }
            case VALUE_TYPE_BOOLEAN: {
                return conditionsList.map((condition, index) => (
                    <div key={index}>
                        <BooleanCondition
                            condition={condition}
                            onChange={(value) => setCondition(index, value)}
                        />
                    </div>
                ))
            }
            case VALUE_TYPE_TRUE_ONLY: {
                return conditionsList.map((condition, index) => (
                    <div key={index}>
                        <TrueOnlyCondition
                            condition={condition}
                            onChange={(value) => setCondition(index, value)}
                        />
                    </div>
                ))
            }
            case VALUE_TYPE_DATE: {
                return conditionsList.map((condition, index) => (
                    <div key={index}>
                        <DateCondition
                            condition={condition}
                            onChange={(value) => setCondition(index, value)}
                            onRemove={() => removeCondition(index)}
                        />
                        {getDividerContent(index)}
                    </div>
                ))
            }
            case VALUE_TYPE_TIME: {
                return conditionsList.map((condition, index) => (
                    <div key={index}>
                        <TimeCondition
                            condition={condition}
                            onChange={(value) => setCondition(index, value)}
                            onRemove={() => removeCondition(index)}
                        />
                        {getDividerContent(index)}
                    </div>
                ))
            }
            case VALUE_TYPE_DATETIME: {
                return conditionsList.map((condition, index) => (
                    <div key={index}>
                        <DateTimeCondition
                            condition={condition}
                            onChange={(value) => setCondition(index, value)}
                            onRemove={() => removeCondition(index)}
                        />
                        {getDividerContent(index)}
                    </div>
                ))
            }
            case VALUE_TYPE_ORGANISATION_UNIT: {
                return conditionsList.map((condition, index) => (
                    <div key={index}>
                        <OrgUnitCondition
                            condition={condition}
                            onChange={(value) => setCondition(index, value)}
                        />
                    </div>
                ))
            }
        }
    }

    const disableAddButton =
        canHaveLegendSets &&
        (conditionsList.some((condition) => condition.includes(OPERATOR_IN)) ||
            selectedLegendSet)

    return dimension ? (
        <DimensionModal
            dataTest={'dialog-manager-modal'}
            isInLayout={isInLayout}
            onClose={closeModal}
            onUpdate={primaryOnClick}
            title={dimension.name}
        >
            <div>
                {!valueType && !isProgramIndicator ? (
                    <p className={classes.paragraph}>
                        {i18n.t(
                            "This dimension can't be filtered. All values will be shown."
                        )}
                    </p>
                ) : (
                    <p className={classes.paragraph}>
                        {i18n.t(
                            'Show items that meet the following conditions for this data item:'
                        )}
                    </p>
                )}
            </div>
            {(valueType || isProgramIndicator) && (
                <div className={classes.mainSection}>
                    {!conditionsList.length &&
                    !selectedLegendSet &&
                    !(
                        SINGLETON_TYPES.includes(valueType) ||
                        isOptionSetCondition
                    ) ? (
                        <p className={classes.paragraph}>
                            <span className={classes.infoIcon}>
                                <IconInfo16 />
                            </span>
                            {i18n.t(
                                'No conditions yet, so all values will be included. Add a condition to filter results.'
                            )}
                        </p>
                    ) : (
                        renderConditionsContent()
                    )}
                    {!(
                        SINGLETON_TYPES.includes(valueType) ||
                        isOptionSetCondition
                    ) && (
                        <Tooltip
                            content={i18n.t(
                                'Preset options can’t be combined with other conditions'
                            )}
                            placement="bottom"
                            closeDelay={200}
                        >
                            {({ onMouseOver, onMouseOut, ref }) => (
                                <span
                                    ref={ref}
                                    onMouseOver={() =>
                                        disableAddButton && onMouseOver()
                                    }
                                    onMouseOut={() =>
                                        disableAddButton && onMouseOut()
                                    }
                                    className={classes.tooltipReference}
                                >
                                    <Button
                                        type="button"
                                        small
                                        onClick={addCondition}
                                        dataTest={
                                            'conditions-manager-add-condition'
                                        }
                                        className={classes.addConditionButton}
                                        disabled={disableAddButton}
                                    >
                                        {conditionsList.length
                                            ? i18n.t('Add another condition')
                                            : i18n.t('Add a condition')}
                                    </Button>
                                </span>
                            )}
                        </Tooltip>
                    )}
                </div>
            )}
        </DimensionModal>
    ) : null
}

ConditionsManager.propTypes = {
    conditions: PropTypes.object.isRequired,
    dimension: PropTypes.object.isRequired,
    /* eslint-disable-next-line react/no-unused-prop-types */
    dimensionId: PropTypes.string.isRequired,
    isInLayout: PropTypes.bool.isRequired,
    legendSet: PropTypes.string,
    setConditionsByDimension: PropTypes.func,
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => ({
    dimension: sGetMetadata(state)[ownProps.dimensionId],
    isInLayout: sGetDimensionIdsFromLayout(state).includes(
        ownProps.dimensionId
    ),
    conditions: sGetUiConditionsByDimension(state, ownProps.dimensionId) || {},
    dimensionIdsInLayout: sGetDimensionIdsFromLayout(state),
    displayNameProp: sGetSettingsDisplayNameProperty(state),
})

const mapDispatchToProps = {
    onUpdate: tSetCurrentFromUi,
    setConditionsByDimension: acSetUiConditions,
}

export default connect(mapStateToProps, mapDispatchToProps)(ConditionsManager)
