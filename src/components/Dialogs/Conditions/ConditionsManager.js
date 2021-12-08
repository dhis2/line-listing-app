import i18n from '@dhis2/d2-i18n'
import { Button, IconInfo16, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { tSetCurrentFromUi } from '../../../actions/current.js'
import { tSetUiConditionsByDimension } from '../../../actions/ui.js'
import {
    parseConditionsArrayToString,
    parseConditionsStringToArray,
} from '../../../modules/conditions.js'
import { sGetMetadata } from '../../../reducers/metadata.js'
import {
    sGetDimensionIdsFromLayout,
    sGetUiConditionsByDimension,
} from '../../../reducers/ui.js'
import DimensionModal from '../DimensionModal.js'
import NumericCondition, { OPERATOR_RANGE_SET } from './NumericCondition.js'
import classes from './styles/ConditionsManager.module.css'

const DIMENSION_TYPE_NUMERIC = 'DIMENSION_TYPE_NUMERIC'

const EMPTY_CONDITION = ''

const ConditionsManager = ({
    conditions,
    isInLayout,
    onUpdate,
    dimension,
    onClose,
    setConditionsByDimension,
}) => {
    const [conditionsList, setConditionsList] = useState(
        (conditions.condition?.length &&
            parseConditionsStringToArray(conditions.condition)) ||
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

    const setCondition = (conditionIndex, value) => {
        setConditionsList(
            conditionsList.map((condition, index) =>
                index === conditionIndex ? value : condition
            )
        )
    }

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

    const dimensionType = DIMENSION_TYPE_NUMERIC // TODO: Should be returned by the backend

    const renderConditionsContent = () => {
        const getDividerContent = (index) =>
            conditionsList.length > 1 &&
            index < conditionsList.length - 1 && (
                <span className={classes.separator}>{i18n.t('and')}</span>
            )

        switch (dimensionType) {
            case DIMENSION_TYPE_NUMERIC:
                return (
                    (conditionsList.length && conditionsList) ||
                    (selectedLegendSet && [''])
                ).map((condition, index) => (
                    <div key={index}>
                        <NumericCondition
                            condition={condition}
                            onChange={(value) => setCondition(index, value)}
                            onRemove={() => removeCondition(index)}
                            dimensionId={dimension.id}
                            numberOfConditions={
                                conditionsList.length ||
                                (selectedLegendSet ? 1 : 0)
                            }
                            legendSetId={selectedLegendSet}
                            onLegendSetChange={(value) =>
                                setSelectedLegendSet(value)
                            }
                        />
                        {getDividerContent(index)}
                    </div>
                ))
        }
    }

    const disableAddButton =
        dimensionType === DIMENSION_TYPE_NUMERIC &&
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
                {!conditionsList.length && !selectedLegendSet ? (
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
                            onMouseOut={() => disableAddButton && onMouseOut()}
                            className={classes.tooltipReference}
                        >
                            <Button
                                type="button"
                                small
                                onClick={addCondition}
                                dataTest={'conditions-manager-add-condition'}
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
