import { DIMENSION_ID_PERIOD } from '@dhis2/analytics'
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
import { useDispatch } from 'react-redux'
import { acSetUiOpenDimensionModal } from '../../../actions/ui.js'
import {
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
    DIMENSION_TYPE_STORED_BY,
} from '../../../modules/dimensionTypes.js'
import styles from './DimensionItem.module.css'

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
    [DIMENSION_TYPE_STORED_BY]: IconUser16,
    [DIMENSION_TYPE_LAST_UPDATED_BY]: IconUser16,
    /**TIME**/
    [DIMENSION_ID_PERIOD]: IconCalendar16,
}

const DimensionItem = ({
    dimensionType,
    id,
    disabled,
    name,
    optionSet,
    selected,
    stageName,
    valueType,
}) => {
    const dispatch = useDispatch()
    const onClick = disabled
        ? undefined
        : () =>
              dispatch(
                  acSetUiOpenDimensionModal(id, {
                      [id]: { id, name, dimensionType, valueType, optionSet },
                  })
              )
    const Icon = DIMENSION_TYPE_ICONS[dimensionType]

    return (
        <div
            className={cx(styles.dimensionItem, {
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

DimensionItem.propTypes = {
    dimensionType: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    optionSet: PropTypes.string,
    selected: PropTypes.bool,
    stageName: PropTypes.string,
    valueType: PropTypes.string,
}

export { DimensionItem }
