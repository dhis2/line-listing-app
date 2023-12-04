import {
    DIMENSION_ID_ORGUNIT,
    DIMENSION_TYPE_PERIOD,
    VALUE_TYPE_BOOLEAN,
    VALUE_TYPE_TRUE_ONLY,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { DimensionIcon } from '../MainSidebar/DimensionItem/DimensionIcon.js'
import styles from './styles/Chip.module.css'

const VALUE_TYPE_TRUE_ONLY_NUM_OPTIONS = 2
const VALUE_TYPE_BOOLEAN_NUM_OPTIONS = 3

// Presentational component used by dnd - do not add redux or dnd functionality

export const ChipBase = ({ dimension, conditionsLength, itemsLength }) => {
    const { id, name, dimensionType, optionSet, valueType, stageName } =
        dimension

    const getChipSuffix = () => {
        if (
            (id === DIMENSION_ID_ORGUNIT ||
                dimensionType === DIMENSION_TYPE_PERIOD) &&
            !itemsLength
        ) {
            return null
        }

        const all = i18n.t('all')

        if (!conditionsLength && !itemsLength) {
            return all
        }

        if (
            (valueType === VALUE_TYPE_TRUE_ONLY &&
                conditionsLength === VALUE_TYPE_TRUE_ONLY_NUM_OPTIONS) ||
            (valueType === VALUE_TYPE_BOOLEAN &&
                conditionsLength === VALUE_TYPE_BOOLEAN_NUM_OPTIONS)
        ) {
            return all
        }

        if (optionSet || itemsLength) {
            return itemsLength || conditionsLength
        } else if (conditionsLength) {
            return conditionsLength
        }
    }

    const suffix = getChipSuffix()

    return (
        <div className={cx(styles.chipBase)}>
            <div className={styles.leftIcon}>
                <DimensionIcon dimensionType={dimensionType} />
            </div>
            <span className={styles.label}>
                <span className={styles.primary} data-test="chip-primary">
                    {name}
                </span>
                {stageName && (
                    <span className={styles.secondary}>{stageName}</span>
                )}
            </span>
            {suffix && (
                <span className={styles.suffix} data-test="chip-suffix">
                    {suffix}
                </span>
            )}
        </div>
    )
}

ChipBase.propTypes = {
    conditionsLength: PropTypes.number,
    dimension: PropTypes.shape({
        dimensionType: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string,
        optionSet: PropTypes.string,
        stageName: PropTypes.string,
        valueType: PropTypes.string,
    }),
    itemsLength: PropTypes.number,
}
