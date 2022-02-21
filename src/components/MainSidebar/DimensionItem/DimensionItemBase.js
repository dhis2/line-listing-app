import {
    IconDimensionData16,
    IconDimensionProgramIndicator16,
    IconFilter16,
    IconDimensionCategoryOptionGroupset16,
    IconDimensionOrgUnitGroupset16,
    IconDimensionOrgUnit16,
    IconCheckmarkCircle16,
    IconUser16,
    IconCalendar16,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import DynamicDimensionIcon from '../../../assets/DynamicDimensionIcon.js'
import {
    DIMENSION_TYPE_PERIOD,
    DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
    DIMENSION_TYPE_CATEGORY,
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_EVENT_STATUS,
    DIMENSION_TYPE_LAST_UPDATED_BY,
    DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET,
    DIMENSION_TYPE_OU,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
    DIMENSION_TYPE_PROGRAM_STATUS,
    DIMENSION_TYPE_CREATED_BY,
} from '../../../modules/dimensionTypes.js'
import styles from './DimensionItemBase.module.css'

// Presentational component used by dnd - do not add redux or dnd functionality

const DIMENSION_TYPE_ICONS = {
    /**PROGRAM**/
    [DIMENSION_TYPE_DATA_ELEMENT]: IconDimensionData16,
    [DIMENSION_TYPE_PROGRAM_ATTRIBUTE]: IconDimensionData16,
    [DIMENSION_TYPE_PROGRAM_INDICATOR]: IconDimensionProgramIndicator16,
    [DIMENSION_TYPE_CATEGORY]: IconFilter16,
    [DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET]:
        IconDimensionCategoryOptionGroupset16,
    /**YOURS**/
    [DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET]:
        IconDimensionOrgUnitGroupset16,
    /**MAIN**/
    [DIMENSION_TYPE_OU]: IconDimensionOrgUnit16,
    [DIMENSION_TYPE_PROGRAM_STATUS]: IconCheckmarkCircle16,
    [DIMENSION_TYPE_EVENT_STATUS]: IconCheckmarkCircle16,
    [DIMENSION_TYPE_CREATED_BY]: IconUser16,
    [DIMENSION_TYPE_LAST_UPDATED_BY]: IconUser16,
    /**TIME**/
    [DIMENSION_TYPE_PERIOD]: IconCalendar16,
}

const DimensionItemBase = ({
    name,
    dimensionType,
    selected,
    disabled,
    stageName,
    onClick,
}) => {
    const Icon = dimensionType
        ? DIMENSION_TYPE_ICONS[dimensionType]
        : DynamicDimensionIcon

    return (
        <div
            className={cx(styles.dimensionItem, styles.dimensionItemOverlay, {
                [styles.selected]: selected,
                [styles.disabled]: disabled,
            })}
            onClick={onClick}
        >
            <div className={styles.icon}>
                <Icon />
            </div>

            <div className={styles.label}>
                <span className={styles.primary}>{name}</span>
                {stageName && (
                    <span className={styles.secondary}>{stageName}</span>
                )}
            </div>
        </div>
    )
}

DimensionItemBase.propTypes = {
    name: PropTypes.string.isRequired,
    dimensionType: PropTypes.string,
    disabled: PropTypes.bool,
    selected: PropTypes.bool,
    stageName: PropTypes.string,
    onClick: PropTypes.func,
}

DimensionItemBase.defaultProps = {
    conditions: [],
    items: [],
    onClick: Function.prototype,
}

export { DimensionItemBase }
