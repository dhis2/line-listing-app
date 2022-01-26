import {
    IconClock16,
    IconDimensionIndicator16,
    IconDimensionOrgUnit16,
    IconDimensionProgramIndicator16,
    IconLock16,
    IconMore16,
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
    PERIOD: IconClock16,
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
    name,
    id,
    optionSet,
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
            <div className={styles.label}>{name}</div>
            {locked && (
                <div className={styles.lock}>
                    <IconLock16 />
                </div>
            )}
            <div className={styles.menuTrigger}>
                <IconMore16 />
            </div>
        </div>
    )
}

DimensionListItem.propTypes = {
    dimensionType: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    optionSet: PropTypes.string,
    valueType: PropTypes.string,
}

export { DimensionListItem }
