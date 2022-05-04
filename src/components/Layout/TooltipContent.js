import {
    DIMENSION_TYPE_CATEGORY,
    DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
    DIMENSION_TYPE_DATA_ELEMENT,
    ouIdHelper,
    DIMENSION_TYPE_ORGANISATION_UNIT,
    DIMENSION_TYPE_PERIOD,
    DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { getConditions } from '../../modules/conditions.js'
import { DIMENSION_TYPE_STATUS } from '../../modules/dimensionConstants.js'
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

    let stageName
    if (dimension.stageName) {
        stageName = dimension.stageName
    } else {
        const stageId =
            dimension.id.indexOf('.') !== -1 &&
            dimension.id.substring(0, dimension.id.indexOf('.'))
        stageName = metadata[stageId]?.name
    }

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

    const renderItems = (itemDisplayNames = []) => {
        if (itemDisplayNames.some((name) => !name)) {
            return null
        }
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

    const renderConditions = () =>
        renderItems(getConditions({ conditions, metadata, dimension }))

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
        case DIMENSION_TYPE_ORGANISATION_UNIT:
            return (
                <ul className={styles.list}>
                    {itemDisplayNames
                        ? renderItems(itemDisplayNames)
                        : renderNoItemsLabel()}
                </ul>
            )
        case DIMENSION_TYPE_DATA_ELEMENT: {
            return (
                <ul className={styles.list}>
                    {stageName && (
                        <li className={styles.item}>
                            {i18n.t('Program stage: {{stageName}}', {
                                stageName,
                                nsSeparator: '^^',
                            })}
                        </li>
                    )}
                    {conditions?.condition || conditions?.legendSet
                        ? renderConditions(conditions)
                        : renderAllItemsLabel()}
                </ul>
            )
        }
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
