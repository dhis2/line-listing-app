import { DIMENSION_ID_PERIOD } from '@dhis2/analytics'
import {
    IconCalendar16,
    IconDimensionIndicator16,
    IconDimensionOrgUnit16,
    IconDimensionProgramIndicator16,
    IconWarningFilled16,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch } from 'react-redux'
import { acSetUiOpenDimensionModal } from '../../../actions/ui.js'
import styles from './DimensionListItem.module.css'

// TODO: get correct icon for each dimension type
// Currently using IconFilter16 as placeholder
const DIMENSION_TYPE_ICONS = {
    DATA_ELEMENT: undefined,
    DATA_ELEMENT_OPERAND: undefined,
    INDICATOR: IconDimensionIndicator16,
    REPORTING_RATE: undefined,
    PROGRAM_DATA_ELEMENT: undefined,
    PROGRAM_ATTRIBUTE: undefined,
    PROGRAM_INDICATOR: IconDimensionProgramIndicator16,
    [DIMENSION_ID_PERIOD]: IconCalendar16,
    ORGANISATION_UNIT: IconDimensionOrgUnit16,
    CATEGORY_OPTION: undefined,
    OPTION_GROUP: undefined,
    DATA_ELEMENT_GROUP: undefined,
    ORGANISATION_UNIT_GROUP: undefined,
    CATEGORY_OPTION_GROUP: undefined,
}

const getIconForDimensionType = (dimensionType) => {
    const Icon = DIMENSION_TYPE_ICONS[dimensionType]

    if (!Icon) {
        console.warn(
            `No icon found for dimension type ${dimensionType}, using fallback warning icon instead`
        )
    }

    return Icon || IconWarningFilled16
}

const DimensionListItem = ({
    dimensionType,
    id,
    isDisabled,
    name,
    optionSet,
    selected,
    stageName,
    valueType,
}) => {
    const dispatch = useDispatch()
    const onClick = () =>
        dispatch(
            acSetUiOpenDimensionModal(id, {
                [id]: { id, name, dimensionType, valueType, optionSet },
            })
        )
    const Icon = getIconForDimensionType(dimensionType)

    return (
        <div
            className={cx(styles.dimensionItem, {
                [styles.selected]: selected,
                [styles.disabled]: isDisabled,
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

DimensionListItem.propTypes = {
    dimensionType: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    optionSet: PropTypes.string,
    selected: PropTypes.bool,
    stageName: PropTypes.string,
    valueType: PropTypes.string,
}

export { DimensionListItem }
