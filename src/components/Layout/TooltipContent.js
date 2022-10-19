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
import { useSelector } from 'react-redux'
import { DIMENSION_TYPE_STATUS } from '../../modules/dimensionConstants.js'
import { sGetMetadata } from '../../reducers/metadata.js'
import { sGetUiItemsByDimension } from '../../reducers/ui.js'
import styles from './styles/Tooltip.module.css'

const renderLimit = 5

export const TooltipContent = ({ dimension, conditionsTexts }) => {
    const metadata = useSelector(sGetMetadata)
    const itemIds =
        useSelector((state) => sGetUiItemsByDimension(state, dimension.id)) ||
        []

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

        const numberOverRenderLimit = itemDisplayNames.length - renderLimit
        if (numberOverRenderLimit > 0) {
            itemsToRender.push(
                <li
                    key={`${dimension.id}-render-limit`}
                    className={styles.item}
                >
                    {i18n.t('And {{count}} other...', {
                        count: numberOverRenderLimit,
                        defaultValue: 'And {{count}} other...',
                        defaultValue_plural: 'And {{count}} others...',
                    })}
                </li>
            )
        }

        return itemsToRender
    }

    const renderNoItemsLabel = () => (
        <li key={`${dimension.id}-none-selected`} className={styles.item}>
            {i18n.t('None selected')}
        </li>
    )

    const renderAllItemsLabel = () => (
        <li key={`${dimension.id}-all-selected`} className={styles.item}>
            {i18n.t('Showing all values for this dimension')}
        </li>
    )

    const itemDisplayNames = Boolean(itemIds.length) && getItemDisplayNames()

    switch (dimension.dimensionType) {
        case DIMENSION_TYPE_CATEGORY:
        case DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET:
        case DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET:
        case DIMENSION_TYPE_STATUS:
            return (
                <ul className={styles.list} data-test="tooltip-content">
                    {itemDisplayNames
                        ? renderItems(itemDisplayNames)
                        : renderAllItemsLabel()}
                </ul>
            )

        case DIMENSION_TYPE_PERIOD:
        case DIMENSION_TYPE_ORGANISATION_UNIT:
            return (
                <ul className={styles.list} data-test="tooltip-content">
                    {itemDisplayNames
                        ? renderItems(itemDisplayNames)
                        : renderNoItemsLabel()}
                </ul>
            )
        case DIMENSION_TYPE_DATA_ELEMENT: {
            return (
                <ul className={styles.list} data-test="tooltip-content">
                    {stageName && (
                        <li className={styles.item}>
                            {i18n.t('Program stage: {{stageName}}', {
                                stageName,
                                nsSeparator: '^^',
                            })}
                        </li>
                    )}
                    {conditionsTexts.length
                        ? renderItems(conditionsTexts)
                        : renderAllItemsLabel()}
                </ul>
            )
        }
        default: {
            return (
                <ul className={styles.list} data-test="tooltip-content">
                    {conditionsTexts.length
                        ? renderItems(conditionsTexts)
                        : renderAllItemsLabel()}
                </ul>
            )
        }
    }
}

TooltipContent.propTypes = {
    conditionsTexts: PropTypes.array.isRequired,
    dimension: PropTypes.object.isRequired,
}

export default TooltipContent
