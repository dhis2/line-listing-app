import i18n from '@dhis2/d2-i18n'
import { Button, IconInfo16, Tooltip, TabBar, Tab } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { acSetUiConditions } from '../../../actions/ui.js'
import {
    OPERATOR_IN,
    parseConditionsArrayToString,
    parseConditionsStringToArray,
    VALUE_TYPE_NUMBER,
    VALUE_TYPE_UNIT_INTERVAL,
    VALUE_TYPE_PERCENTAGE,
    VALUE_TYPE_INTEGER,
    VALUE_TYPE_INTEGER_POSITIVE,
    VALUE_TYPE_INTEGER_NEGATIVE,
    VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
    VALUE_TYPE_TEXT,
    VALUE_TYPE_LONG_TEXT,
    VALUE_TYPE_LETTER,
    VALUE_TYPE_PHONE_NUMBER,
    VALUE_TYPE_EMAIL,
    VALUE_TYPE_USERNAME,
    VALUE_TYPE_URL,
    VALUE_TYPE_BOOLEAN,
    VALUE_TYPE_TRUE_ONLY,
    VALUE_TYPE_DATE,
    VALUE_TYPE_TIME,
    VALUE_TYPE_DATETIME,
    VALUE_TYPE_ORGANISATION_UNIT,
} from '../../../modules/conditions.js'
import {
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
} from '../../../modules/dimensionConstants.js'
import { OUTPUT_TYPE_ENROLLMENT } from '../../../modules/visualization.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { sGetSettingsDisplayNameProperty } from '../../../reducers/settings.js'
import {
    sGetDimensionIdsFromLayout,
    sGetUiConditionsByDimension,
    sGetUiInputType,
} from '../../../reducers/ui.js'
import DimensionModal from '../DimensionModal.js'
import commonClasses from '../styles/Common.module.css'
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
import RepeatableEvents from './RepeatableEvents.js'
import classes from './styles/ConditionsManager.module.css'

const TAB_CONDITIONS = 'CONDITIONS'
const TAB_REPEATABLE_EVENTS = 'REPEATABLE_EVENTS'

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

const SUPPORTED_TYPES = [
    VALUE_TYPE_NUMBER,
    VALUE_TYPE_UNIT_INTERVAL,
    VALUE_TYPE_PERCENTAGE,
    VALUE_TYPE_INTEGER,
    VALUE_TYPE_INTEGER_POSITIVE,
    VALUE_TYPE_INTEGER_NEGATIVE,
    VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
    VALUE_TYPE_TEXT,
    VALUE_TYPE_LONG_TEXT,
    VALUE_TYPE_LETTER,
    VALUE_TYPE_PHONE_NUMBER,
    VALUE_TYPE_EMAIL,
    VALUE_TYPE_USERNAME,
    VALUE_TYPE_URL,
    VALUE_TYPE_BOOLEAN,
    VALUE_TYPE_TRUE_ONLY,
    VALUE_TYPE_DATE,
    VALUE_TYPE_TIME,
    VALUE_TYPE_DATETIME,
    VALUE_TYPE_ORGANISATION_UNIT,
]

const EMPTY_CONDITION = ''

const ConditionsManager = ({
    conditions,
    inputType,
    isInLayout,
    dimension,
    stage,
    onClose,
    setConditionsByDimension,
}) => {
    const [currentTab, setCurrentTab] = useState(TAB_CONDITIONS)
    const valueType = dimension.valueType
    const isProgramIndicator =
        dimension.dimensionType === DIMENSION_TYPE_PROGRAM_INDICATOR
    const isOptionSetCondition = dimension.optionSet
    const canHaveLegendSets =
        NUMERIC_TYPES.includes(valueType) || isProgramIndicator
    const isSupported =
        SUPPORTED_TYPES.includes(valueType) || isProgramIndicator

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

    const isRepeatable =
        inputType === OUTPUT_TYPE_ENROLLMENT &&
        dimension.dimensionType === DIMENSION_TYPE_DATA_ELEMENT

    const renderConditions = () => (
        <>
            <div>
                {isSupported ? (
                    <p className={commonClasses.paragraph}>
                        {i18n.t(
                            'Show items that meet the following conditions for this data item:'
                        )}
                    </p>
                ) : (
                    <p className={commonClasses.paragraph}>
                        {i18n.t(
                            "This dimension can't be filtered. All values will be shown."
                        )}
                    </p>
                )}
            </div>
            {isSupported && (
                <div className={commonClasses.mainSection}>
                    {!conditionsList.length &&
                    !selectedLegendSet &&
                    !(
                        SINGLETON_TYPES.includes(valueType) ||
                        isOptionSetCondition
                    ) ? (
                        <p className={commonClasses.paragraph}>
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
        </>
    )

    const renderTabs = () => {
        const disableRepeatableTab = !stage?.repeatable
        const repeatableTab = (
            <Tab
                key={TAB_REPEATABLE_EVENTS}
                onClick={() => setCurrentTab(TAB_REPEATABLE_EVENTS)}
                selected={currentTab === TAB_REPEATABLE_EVENTS}
                disabled={disableRepeatableTab}
            >
                {i18n.t('Repeated events')}
            </Tab>
        )

        return (
            <>
                <TabBar className={classes.tabBar}>
                    <Tab
                        key={TAB_CONDITIONS}
                        onClick={() => setCurrentTab(TAB_CONDITIONS)}
                        selected={currentTab === TAB_CONDITIONS}
                    >
                        {i18n.t('Conditions')}
                    </Tab>
                    {disableRepeatableTab ? (
                        <Tooltip
                            key={`repeatable-tooltip`}
                            placement="bottom"
                            content={i18n.t(
                                'Only available for repeatable stages'
                            )}
                        >
                            {repeatableTab}
                        </Tooltip>
                    ) : (
                        repeatableTab
                    )}
                </TabBar>
                {currentTab === TAB_CONDITIONS ? (
                    renderConditions()
                ) : (
                    <RepeatableEvents dimensionId={dimension.id} />
                )}
            </>
        )
    }

    console.log(
        `valueType: ${valueType}, dimensionType: ${dimension.dimensionType}, id: ${dimension.id}`
    ) // TODO: For testing only

    return dimension ? (
        <DimensionModal
            dataTest={'dialog-manager-modal'}
            isInLayout={isInLayout}
            onClose={closeModal}
            title={dimension.name}
        >
            {isRepeatable ? renderTabs() : renderConditions()}
        </DimensionModal>
    ) : null
}

ConditionsManager.propTypes = {
    conditions: PropTypes.object.isRequired,
    dimension: PropTypes.object.isRequired,
    isInLayout: PropTypes.bool.isRequired,
    inputType: PropTypes.string,
    legendSet: PropTypes.string,
    setConditionsByDimension: PropTypes.func,
    stage: PropTypes.object,
    onClose: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => ({
    isInLayout: sGetDimensionIdsFromLayout(state).includes(
        ownProps.dimension?.id
    ),
    conditions:
        sGetUiConditionsByDimension(state, ownProps.dimension?.id) || {},
    dimensionIdsInLayout: sGetDimensionIdsFromLayout(state),
    displayNameProp: sGetSettingsDisplayNameProperty(state),
    inputType: sGetUiInputType(state),
    stage:
        sGetMetadataById(
            state,
            ownProps.dimension?.id?.substring(
                0,
                ownProps.dimension.id.indexOf('.')
            )
        ) || {},
})

const mapDispatchToProps = {
    setConditionsByDimension: acSetUiConditions,
}

export default connect(mapStateToProps, mapDispatchToProps)(ConditionsManager)
