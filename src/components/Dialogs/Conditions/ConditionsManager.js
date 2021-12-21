import i18n from '@dhis2/d2-i18n'
import { Button, IconInfo16, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { tSetCurrentFromUi } from '../../../actions/current.js'
import { tSetUiConditionsByDimension } from '../../../actions/ui.js'
import {
    OPERATOR_RANGE_SET,
    parseConditionsArrayToString,
    parseConditionsStringToArray,
} from '../../../modules/conditions.js'
import { sGetMetadata } from '../../../reducers/metadata.js'
import {
    sGetDimensionIdsFromLayout,
    sGetUiConditionsByDimension,
} from '../../../reducers/ui.js'
import DimensionModal from '../DimensionModal.js'
import AlphanumericCondition from './AlphanumericCondition.js'
import BooleanCondition from './BooleanCondition.js'
import {
    DateCondition,
    DateTimeCondition,
    TimeCondition,
} from './DateCondition.js'
import NumericCondition from './NumericCondition.js'
import classes from './styles/ConditionsManager.module.css'

const DIMENSION_TYPE_NUMBER = 'NUMBER'
const DIMENSION_TYPE_UNIT_INTERVAL = 'UNIT_INTERVAL'
const DIMENSION_TYPE_PERCENTAGE = 'PERCENTAGE'
const DIMENSION_TYPE_INTEGER = 'INTEGER'
const DIMENSION_TYPE_INTEGER_POSITIVE = 'INTEGER_POSITIVE'
const DIMENSION_TYPE_INTEGER_NEGATIVE = 'INTEGER_NEGATIVE'
const DIMENSION_TYPE_INTEGER_ZERO_OR_POSITIVE = 'INTEGER_ZERO_OR_POSITIVE'
const DIMENSION_TYPE_TEXT = 'TEXT'
const DIMENSION_TYPE_LONG_TEXT = 'LONG_TEXT'
const DIMENSION_TYPE_LETTER = 'LETTER'
const DIMENSION_TYPE_PHONE_NUMBER = 'PHONE_NUMBER'
const DIMENSION_TYPE_EMAIL = 'EMAIL'
const DIMENSION_TYPE_USERNAME = 'USERNAME'
const DIMENSION_TYPE_URL = 'URL'
const DIMENSION_TYPE_BOOLEAN = 'BOOLEAN'
const DIMENSION_TYPE_TRUE_ONLY = 'TRUE_ONLY'
const DIMENSION_TYPE_DATE = 'DATE'
const DIMENSION_TYPE_TIME = 'TIME'
const DIMENSION_TYPE_DATETIME = 'DATETIME'

const NUMERIC_TYPES = [
    DIMENSION_TYPE_NUMBER,
    DIMENSION_TYPE_UNIT_INTERVAL,
    DIMENSION_TYPE_PERCENTAGE,
    DIMENSION_TYPE_INTEGER,
    DIMENSION_TYPE_INTEGER_POSITIVE,
    DIMENSION_TYPE_INTEGER_NEGATIVE,
    DIMENSION_TYPE_INTEGER_ZERO_OR_POSITIVE,
]

const SINGLETON_TYPES = [DIMENSION_TYPE_BOOLEAN, DIMENSION_TYPE_TRUE_ONLY]

const EMPTY_CONDITION = ''

const ConditionsManager = ({
    conditions,
    isInLayout,
    onUpdate,
    dimension,
    onClose,
    setConditionsByDimension,
}) => {
    const dimensionType = DIMENSION_TYPE_TIME // TODO: Should be returned by the backend, e.g. NUMBER, INTEGER, PERCENTAGE

    const [conditionsList, setConditionsList] = useState(
        (conditions.condition?.length &&
            parseConditionsStringToArray(conditions.condition)) ||
            (!conditions.condition?.length &&
                SINGLETON_TYPES.includes(dimensionType) && [EMPTY_CONDITION]) ||
            (conditions.legendSet ? [EMPTY_CONDITION] : [])
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
                condition.includes(OPERATOR_RANGE_SET)
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
        setConditionsByDimension(
            parseConditionsArrayToString(
                conditionsList.filter(
                    (cnd) => cnd.length && cnd.slice(-1) !== ':'
                )
            ),
            dimension.id,
            selectedLegendSet
        )

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

        // TODO: DIMENSION_TYPE_TEXT + optionSet -> OptionSetCondition.js

        switch (dimensionType) {
            case DIMENSION_TYPE_NUMBER:
            case DIMENSION_TYPE_UNIT_INTERVAL:
            case DIMENSION_TYPE_PERCENTAGE:
            case DIMENSION_TYPE_INTEGER:
            case DIMENSION_TYPE_INTEGER_POSITIVE:
            case DIMENSION_TYPE_INTEGER_NEGATIVE:
            case DIMENSION_TYPE_INTEGER_ZERO_OR_POSITIVE: {
                const useDecimalSteps =
                    dimensionType === DIMENSION_TYPE_UNIT_INTERVAL
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
                                conditionsList.length ||
                                (selectedLegendSet ? 1 : 0)
                            }
                            legendSetId={selectedLegendSet}
                            onLegendSetChange={(value) =>
                                setSelectedLegendSet(value)
                            }
                            useDecimalSteps={useDecimalSteps}
                        />
                        {getDividerContent(index)}
                    </div>
                ))
            }
            case DIMENSION_TYPE_TEXT:
            case DIMENSION_TYPE_LONG_TEXT:
            case DIMENSION_TYPE_LETTER:
            case DIMENSION_TYPE_PHONE_NUMBER:
            case DIMENSION_TYPE_EMAIL:
            case DIMENSION_TYPE_USERNAME:
            case DIMENSION_TYPE_URL: {
                const allowCaseSensitive =
                    dimensionType !== DIMENSION_TYPE_PHONE_NUMBER
                return conditionsList.map((condition, index) => (
                    <div key={index}>
                        <AlphanumericCondition
                            condition={condition}
                            onChange={(value) => setCondition(index, value)}
                            onRemove={() => removeCondition(index)}
                            allowCaseSensitive={allowCaseSensitive}
                        />
                        {getDividerContent(index)}
                    </div>
                ))
            }
            case DIMENSION_TYPE_BOOLEAN:
            case DIMENSION_TYPE_TRUE_ONLY: {
                const showFalseOption = dimensionType === DIMENSION_TYPE_BOOLEAN
                return (conditionsList.length && conditionsList).map(
                    (condition, index) => (
                        <div key={index}>
                            <BooleanCondition
                                condition={condition}
                                onChange={(value) => setCondition(index, value)}
                                showFalseOption={showFalseOption}
                            />
                        </div>
                    )
                )
            }
            case DIMENSION_TYPE_DATE: {
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
            case DIMENSION_TYPE_TIME: {
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
            case DIMENSION_TYPE_DATETIME: {
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
        }
    }

    const disableAddButton =
        NUMERIC_TYPES.includes(dimensionType) &&
        (conditionsList.some((condition) =>
            condition.includes(OPERATOR_RANGE_SET)
        ) ||
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
                <p className={classes.paragraph}>
                    {i18n.t(
                        'Show items that meet the following conditions for this data item:'
                    )}
                </p>
            </div>
            <div className={classes.mainSection}>
                {!conditionsList.length &&
                !selectedLegendSet &&
                !SINGLETON_TYPES.includes(dimensionType) ? (
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
                {!SINGLETON_TYPES.includes(dimensionType) && (
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
})

const mapDispatchToProps = {
    onUpdate: tSetCurrentFromUi,
    setConditionsByDimension: tSetUiConditionsByDimension,
}

export default connect(mapStateToProps, mapDispatchToProps)(ConditionsManager)
