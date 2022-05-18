import { DIMENSION_ID_ORGUNIT, DIMENSION_TYPE_PERIOD } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import {
    VALUE_TYPE_BOOLEAN,
    VALUE_TYPE_TRUE_ONLY,
    getConditionsTexts,
} from '../../modules/conditions.js'
import { DimensionIcon } from '../MainSidebar/DimensionItem/DimensionIcon.js'
import styles from './styles/Chip.module.css'

const VALUE_TYPE_TRUE_ONLY_NUM_OPTIONS = 2
const VALUE_TYPE_BOOLEAN_NUM_OPTIONS = 3

// Presentational component used by dnd - do not add redux or dnd functionality

export const ChipBase = ({ dimension, conditions, items, metadata }) => {
    const { id, name, dimensionType, optionSet, valueType, stageName } =
        dimension

    const getChipSuffix = () => {
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

        const conds = getConditionsTexts({ conditions, metadata, dimension })

        if (
            (valueType === VALUE_TYPE_TRUE_ONLY &&
                conds.length === VALUE_TYPE_TRUE_ONLY_NUM_OPTIONS) ||
            (valueType === VALUE_TYPE_BOOLEAN &&
                conds.length === VALUE_TYPE_BOOLEAN_NUM_OPTIONS)
        ) {
            return `: ${all}`
        }

        const numberOfConditions = conds.length

        if (optionSet || items.length) {
            const selected = items.length || numberOfConditions
            const suffix = i18n.t('{{count}} selected', {
                count: selected,
                defaultValue: '{{count}} selected',
                defaultValue_plural: '{{count}} selected',
            })
            return `: ${suffix}`
        } else if (numberOfConditions) {
            const suffix = i18n.t('{{count}} conditions', {
                count: numberOfConditions,
                defaultValue: '{{count}} condition',
                defaultValue_plural: '{{count}} conditions',
            })
            return `: ${suffix}`
        }

        return ''
    }

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
            <span className={styles.suffix}>{getChipSuffix()}</span>
        </div>
    )
}

ChipBase.propTypes = {
    conditions: PropTypes.object,
    dimension: PropTypes.shape({
        dimensionType: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string,
        optionSet: PropTypes.string,
        stageName: PropTypes.string,
        valueType: PropTypes.string,
    }),
    items: PropTypes.array,
    metadata: PropTypes.object,
}

ChipBase.defaultProps = {
    conditions: {},
    items: [],
    metadata: {},
}
