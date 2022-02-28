import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { DimensionIcon } from '../MainSidebar/DimensionItem/DimensionIcon.js'
import styles from './styles/Chip.module.css'

// Presentational component used by dnd - do not add redux or dnd functionality

const renderChipLabelSuffix = (items, numberOfConditions) => {
    let itemsLabel = ''
    if (items.length) {
        itemsLabel = i18n.t('{{count}} selected', {
            count: items.length,
        })
    } else if (numberOfConditions) {
        itemsLabel = i18n.t('{{count}} conditions', {
            count: numberOfConditions,
            defaultValue: '{{count}} condition',
            defaultValue_plural: '{{count}} conditions',
        })
    }
    return itemsLabel ? `: ${itemsLabel}` : ''
}

export const ChipBase = (props) => {
    return (
        <div className={cx(styles.chip, styles.chipLeft)}>
            <div className={styles.leftIconWrapper}>
                <DimensionIcon dimensionType={props.dimensionType} />
            </div>
            <span className={styles.label}>{props.dimensionName}</span>
            <span>
                {renderChipLabelSuffix(props.items, props.numberOfConditions)}
            </span>
        </div>
    )
}

ChipBase.propTypes = {
    dimensionName: PropTypes.string,
    dimensionType: PropTypes.string,
    items: PropTypes.array,
    numberOfConditions: PropTypes.number,
}
