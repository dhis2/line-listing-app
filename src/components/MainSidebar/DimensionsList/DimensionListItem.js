import {
    IconClock16,
    IconDimensionIndicator16,
    IconDimensionOrgUnit16,
    IconDimensionProgramIndicator16,
    IconFilter16,
    IconLock16,
    IconMore16,
    IconWarningFilled16,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch } from 'react-redux'
import { acSetUiActiveModalDialog } from '../../../actions/ui.js'
import styles from './DimensionListItem.module.css'

// TODO: get correct icon for each dimension type
// Currently using IconFilter16 as placeholder
const DIMENSION_TYPE_ICONS = {
    DATA_ELEMENT: IconFilter16,
    DATA_ELEMENT_OPERAND: IconFilter16,
    INDICATOR: IconDimensionIndicator16,
    REPORTING_RATE: IconFilter16,
    PROGRAM_DATA_ELEMENT: IconFilter16,
    PROGRAM_ATTRIBUTE: IconFilter16,
    PROGRAM_INDICATOR: IconDimensionProgramIndicator16,
    PERIOD: IconClock16,
    ORGANISATION_UNIT: IconDimensionOrgUnit16,
    CATEGORY_OPTION: IconFilter16,
    OPTION_GROUP: IconFilter16,
    DATA_ELEMENT_GROUP: IconFilter16,
    ORGANISATION_UNIT_GROUP: IconFilter16,
    CATEGORY_OPTION_GROUP: IconFilter16,
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
    displayName,
    id,
    optionSet,
    valueType,
}) => {
    const dispatch = useDispatch()
    const onClick = () =>
        dispatch(
            acSetUiActiveModalDialog(id, {
                [id]: { id, displayName, dimensionType, valueType, optionSet },
            })
        )
    const Icon = getIconForDimensionType(dimensionType)

    // TODO: populate with proper values
    const picked = false
    const disabled = false
    const recommended = false
    const dragOnly = false
    const locked = false

    return (
        <div
            className={cx(styles.dimensionItem, {
                [styles.picked]: picked,
                [styles.disabled]: disabled,
                [styles.recommended]: recommended,
                [styles.dragOnly]: dragOnly,
            })}
            onClick={onClick}
        >
            <div className={styles.icon}>
                <Icon />
            </div>
            <div className={styles.label}>{displayName}</div>
            {locked ? (
                <div className={styles.lock}>
                    <IconLock16 />
                </div>
            ) : (
                ''
            )}
            <div className={styles.menuTrigger}>
                <IconMore16 />
            </div>
        </div>
    )
}

DimensionListItem.propTypes = {
    dimensionType: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    optionSet: PropTypes.string.isRequired,
    valueType: PropTypes.string.isRequired,
}

export { DimensionListItem }
