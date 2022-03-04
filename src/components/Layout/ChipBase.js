import { DIMENSION_ID_ORGUNIT } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import {
    VALUE_TYPE_BOOLEAN,
    VALUE_TYPE_TRUE_ONLY,
    getConditions,
} from '../../modules/conditions.js'
import { DIMENSION_TYPE_PERIOD } from '../../modules/dimensionConstants.js'
import { DimensionIcon } from '../MainSidebar/DimensionItem/DimensionIcon.js'
import styles from './styles/Chip.module.css'

// Presentational component used by dnd - do not add redux or dnd functionality

const getChipSuffix = ({
    dimension,
    conditions = {},
    items = [],
    metadata,
}) => {
    const { id, dimensionType, optionSet, valueType } = dimension

    if (
        (id === DIMENSION_ID_ORGUNIT ||
            dimensionType === DIMENSION_TYPE_PERIOD) &&
        !items.length
    ) {
        return ''
    }

    const all = i18n.t('all')

    if (!conditions.condition && !conditions.legendSet && !items.length) {
        return `: ${all}`
    }

    const conds = getConditions({ conditions, metadata, dimension })

    if (
        (valueType === VALUE_TYPE_TRUE_ONLY && conds.length === 2) ||
        (valueType === VALUE_TYPE_BOOLEAN && conds.length === 3)
    ) {
        return `: ${all}`
    }

    const numberOfConditions = conds.length

    let suffix = ''
    if (optionSet || items.length) {
        const selected = items.length || numberOfConditions

        suffix = i18n.t('{{count}} selected', {
            count: selected,
            defaultValue: '{{count}} selected',
            defaultValue_plural: '{{count}} selected',
        })
    } else if (numberOfConditions) {
        suffix = i18n.t('{{count}} conditions', {
            count: numberOfConditions,
            defaultValue: '{{count}} condition',
            defaultValue_plural: '{{count}} conditions',
        })
    }
    return suffix ? `: ${suffix}` : ''
}

export const ChipBase = (props) => {
    const { name, dimensionType, stageName } = props.dimension
    return (
        <div className={cx(styles.chipBase)}>
            <div className={styles.leftIcon}>
                <DimensionIcon dimensionType={dimensionType} />
            </div>
            <span className={styles.label}>
                <span className={styles.primary}>{name}</span>
                {stageName && (
                    <span className={styles.secondary}>{stageName}</span>
                )}
            </span>
            <span className={styles.suffix}>{getChipSuffix(props)}</span>
        </div>
    )
}

ChipBase.propTypes = {
    dimension: PropTypes.object,
}
