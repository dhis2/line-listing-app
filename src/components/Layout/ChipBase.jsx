import {
    AXIS_ID_FILTERS,
    DIMENSION_ID_ORGUNIT,
    DIMENSION_TYPE_PERIOD,
    VALUE_TYPE_BOOLEAN,
    VALUE_TYPE_TRUE_ONLY,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { OUTPUT_TYPE_TRACKED_ENTITY } from '../../modules/visualization.js'
import { DimensionIcon } from '../MainSidebar/DimensionItem/DimensionIcon.jsx'
import styles from './styles/Chip.module.css'

const VALUE_TYPE_TRUE_ONLY_NUM_OPTIONS = 2
const VALUE_TYPE_BOOLEAN_NUM_OPTIONS = 3

// Presentational component used by dnd - do not add redux or dnd functionality

export const ChipBase = ({
    dimension,
    conditionsLength,
    itemsLength,
    inputType,
    axisId,
}) => {
    const { id, name, dimensionType, optionSet, valueType, suffix } = dimension

    const getChipItems = () => {
        if (
            ((inputType !== OUTPUT_TYPE_TRACKED_ENTITY &&
                id === DIMENSION_ID_ORGUNIT) ||
                dimensionType === DIMENSION_TYPE_PERIOD) &&
            !itemsLength
        ) {
            return null
        }

        const all = i18n.t('all')

        if (!conditionsLength && !itemsLength && axisId !== AXIS_ID_FILTERS) {
            return all
        }

        if (
            ((valueType === VALUE_TYPE_TRUE_ONLY &&
                conditionsLength === VALUE_TYPE_TRUE_ONLY_NUM_OPTIONS) ||
                (valueType === VALUE_TYPE_BOOLEAN &&
                    conditionsLength === VALUE_TYPE_BOOLEAN_NUM_OPTIONS)) &&
            axisId !== AXIS_ID_FILTERS
        ) {
            return all
        }

        if (optionSet || itemsLength) {
            return itemsLength || conditionsLength
        } else if (conditionsLength) {
            return conditionsLength
        }
    }

    const chipItems = getChipItems()

    return (
        <div className={cx(styles.chipBase)}>
            <div className={styles.leftIcon}>
                <DimensionIcon dimensionType={dimensionType} />
            </div>
            <span className={styles.label}>
                <span className={styles.primary}>{name}</span>
                {suffix && (
                    <>
                        <span>,</span>
                        <span className={styles.secondary}>{suffix}</span>
                    </>
                )}
            </span>
            {chipItems && (
                <span className={styles.items} data-test="chip-items">
                    {chipItems}
                </span>
            )}
        </div>
    )
}

ChipBase.propTypes = {
    axisId: PropTypes.string,
    conditionsLength: PropTypes.number,
    dimension: PropTypes.shape({
        dimensionType: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string,
        optionSet: PropTypes.string,
        suffix: PropTypes.string,
        valueType: PropTypes.string,
    }),
    inputType: PropTypes.string,
    itemsLength: PropTypes.number,
}
