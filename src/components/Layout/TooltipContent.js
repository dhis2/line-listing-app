import { ouIdHelper } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
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
    NUMERIC_OPERATORS,
    ALPHA_NUMERIC_OPERATORS,
    DATE_OPERATORS,
    unprefixOperator,
    NULL_VALUE,
    OPERATOR_IN,
    BOOLEAN_VALUES,
    OPERATOR_EQUAL,
} from '../../modules/conditions.js'
import {
    DIMENSION_TYPE_CATEGORY,
    DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
    DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET,
    DIMENSION_TYPE_STATUS,
    DIMENSION_TYPE_PERIOD,
    DIMENSION_TYPE_OU,
} from '../../modules/dimensionConstants.js'
import { sGetMetadata } from '../../reducers/metadata.js'
import {
    sGetUiConditionsByDimension,
    sGetUiItemsByDimension,
} from '../../reducers/ui.js'
import styles from './styles/Tooltip.module.css'

const labels = {
    noneSelected: () => i18n.t('None selected'),
    allSelected: () => i18n.t('Showing all values for this dimension'),
    oneOverLimit: () => i18n.t('And 1 other...'),
    nOverLimit: (n) =>
        i18n.t('And {{numberOfItems}} others...', {
            numberOfItems: n,
        }),
}

const renderLimit = 5

const getOperatorsByValueType = (valueType) => {
    switch (valueType) {
        case VALUE_TYPE_NUMBER:
        case VALUE_TYPE_UNIT_INTERVAL:
        case VALUE_TYPE_PERCENTAGE:
        case VALUE_TYPE_INTEGER:
        case VALUE_TYPE_INTEGER_POSITIVE:
        case VALUE_TYPE_INTEGER_NEGATIVE:
        case VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE:
        case VALUE_TYPE_PHONE_NUMBER: {
            return NUMERIC_OPERATORS
        }
        case VALUE_TYPE_LETTER:
        case VALUE_TYPE_TEXT:
        case VALUE_TYPE_LONG_TEXT:
        case VALUE_TYPE_EMAIL:
        case VALUE_TYPE_USERNAME:
        case VALUE_TYPE_URL: {
            return ALPHA_NUMERIC_OPERATORS
        }
        case VALUE_TYPE_DATE:
        case VALUE_TYPE_TIME:
        case VALUE_TYPE_DATETIME: {
            return DATE_OPERATORS
        }
    }
}

export const TooltipContent = ({
    dimension,
    itemIds,
    metadata,
    conditions,
}) => {
    const getNameList = (idList, label, metadata) =>
        idList.reduce(
            (levelString, levelId, index) =>
                `${levelString}${index > 0 ? `, ` : ``}${
                    metadata[levelId] ? metadata[levelId].name : levelId
                }`,
            `${label}: `
        )

    const getItemDisplayNames = () => {
        const levelIds = []
        const groupIds = []
        const itemDisplayNames = []

        itemIds.forEach((id) => {
            if (ouIdHelper.hasLevelPrefix(id)) {
                levelIds.push(ouIdHelper.removePrefix(id))
            } else if (ouIdHelper.hasGroupPrefix(id)) {
                groupIds.push(ouIdHelper.removePrefix(id))
            } else {
                itemDisplayNames.push(metadata[id] ? metadata[id].name : id)
            }
        })

        levelIds.length &&
            itemDisplayNames.push(
                getNameList(levelIds, i18n.t('Levels'), metadata)
            )

        groupIds.length &&
            itemDisplayNames.push(
                getNameList(groupIds, i18n.t('Groups'), metadata)
            )

        return itemDisplayNames
    }

    const renderItems = (itemDisplayNames) => {
        const itemsToRender = itemDisplayNames
            .slice(0, renderLimit)
            .map((name) => (
                <li key={`${dimension.id}-${name}`} className={styles.item}>
                    {name}
                </li>
            ))

        if (itemDisplayNames.length > renderLimit) {
            itemsToRender.push(
                <li
                    key={`${dimension.id}-render-limit`}
                    className={styles.item}
                >
                    {itemDisplayNames.length - renderLimit === 1
                        ? labels.oneOverLimit
                        : labels.nOverLimit(
                              itemDisplayNames.length - renderLimit
                          )}
                </li>
            )
        }

        return itemsToRender
    }

    const renderConditions = () => {
        const conditionsList = parseConditionsStringToArray(
            conditions.condition
        )

        if (conditions.legendSet) {
            if (!conditionsList?.length) {
                return renderItems([metadata[conditions.legendSet]?.name])
            } else {
                const legends = conditionsList[0].split(':').pop().split(';')
                const allLegends = metadata[conditions.legendSet]?.legends
                const legendNames = legends.map(
                    (legend) => allLegends.find((l) => l.id === legend).name
                )
                return renderItems(legendNames)
            }
        }

        if (dimension.optionSet && conditionsList[0]?.startsWith(OPERATOR_IN)) {
            const items = conditionsList[0].split(':').pop().split(';')
            const itemNames = items.map(
                (code) =>
                    Object.values(metadata).find((item) => item.code === code)
                        .name
            )
            return renderItems(itemNames)
        }

        if (
            [VALUE_TYPE_BOOLEAN, VALUE_TYPE_TRUE_ONLY].includes(
                dimension.valueType
            ) &&
            conditionsList[0]?.startsWith(OPERATOR_IN)
        ) {
            const values = conditionsList[0].split(':').pop().split(';')
            const valueNames = values.map((value) => BOOLEAN_VALUES[value])
            return renderItems(valueNames)
        }

        if (
            dimension.valueType === VALUE_TYPE_ORGANISATION_UNIT &&
            conditionsList[0]?.startsWith(OPERATOR_EQUAL)
        ) {
            const ous = conditionsList[0].split(':').pop().split(';')
            const ouNames = ous.map((ou) => metadata[ou]?.name)
            return renderItems(ouNames)
        }

        const operators = getOperatorsByValueType(dimension.valueType)

        const parsedConditions = conditionsList.map((condition) => {
            let operator, value

            if (condition.includes(NULL_VALUE)) {
                operator = condition
            } else {
                const parts = condition.split(':')
                operator = unprefixOperator(parts[0])
                value = parts[1]
            }

            const operatorName = operators[operator]
            const capitalCaseOperatorName =
                operatorName[0].toUpperCase() + operatorName.substring(1)
            return value
                ? `${capitalCaseOperatorName}: ${value}`
                : capitalCaseOperatorName
        })

        return renderItems(parsedConditions)
    }

    const renderNoItemsLabel = () => (
        <li
            key={`${dimension.id}-${labels.noneSelected()}`}
            className={styles.item}
        >
            {labels.noneSelected()}
        </li>
    )

    const renderAllItemsLabel = () => (
        <li
            key={`${dimension.id}-${labels.allSelected()}`}
            className={styles.item}
        >
            {labels.allSelected()}
        </li>
    )

    const itemDisplayNames = Boolean(itemIds.length) && getItemDisplayNames()

    switch (dimension.dimensionType) {
        case DIMENSION_TYPE_CATEGORY:
        case DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET:
        case DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET:
        case DIMENSION_TYPE_STATUS:
            return (
                <ul className={styles.list}>
                    {itemDisplayNames
                        ? renderItems(itemDisplayNames)
                        : renderAllItemsLabel()}
                </ul>
            )

        case DIMENSION_TYPE_PERIOD:
        case DIMENSION_TYPE_OU:
            return (
                <ul className={styles.list}>
                    {itemDisplayNames
                        ? renderItems(itemDisplayNames)
                        : renderNoItemsLabel()}
                </ul>
            )

        default: {
            return (
                <ul className={styles.list}>
                    {conditions?.condition || conditions?.legendSet
                        ? renderConditions(conditions)
                        : renderAllItemsLabel()}
                </ul>
            )
        }
    }
}

TooltipContent.propTypes = {
    conditions: PropTypes.object.isRequired,
    dimension: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired,
    itemIds: PropTypes.array,
}

const mapStateToProps = (state, ownProps) => ({
    metadata: sGetMetadata(state),
    itemIds: sGetUiItemsByDimension(state, ownProps.dimension.id) || [],
    conditions: sGetUiConditionsByDimension(state, ownProps.dimension.id) || {},
})

export default connect(mapStateToProps)(TooltipContent)
