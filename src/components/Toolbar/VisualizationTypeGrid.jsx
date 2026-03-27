import i18n from '@dhis2/d2-i18n'
import {
    IconVisualizationLinelist16,
    IconVisualizationPivotTable16,
    IconVisualizationColumn16,
    IconVisualizationColumnStacked16,
    IconVisualizationBar16,
    IconVisualizationBarStacked16,
    IconVisualizationLine16,
    IconVisualizationArea16,
    IconVisualizationAreaStacked16,
    IconVisualizationPie16,
    IconVisualizationRadar16,
    IconVisualizationGauge16,
    IconVisualizationSingleValue16,
    IconVisualizationScatter16,
    Tooltip,
} from '@dhis2/ui'
import { VIS_TYPE_LINE_LIST, VIS_TYPE_PIVOT_TABLE } from '@dhis2/analytics'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiType } from '../../actions/ui.js'
import { sGetUiType } from '../../reducers/ui.js'
import styles from './VisualizationTypeGrid.module.css'

// Visualization type constants for types not yet in @dhis2/analytics
const VIS_TYPE_COLUMN = 'COLUMN'
const VIS_TYPE_STACKED_COLUMN = 'STACKED_COLUMN'
const VIS_TYPE_BAR = 'BAR'
const VIS_TYPE_STACKED_BAR = 'STACKED_BAR'
const VIS_TYPE_LINE = 'LINE'
const VIS_TYPE_AREA = 'AREA'
const VIS_TYPE_STACKED_AREA = 'STACKED_AREA'
const VIS_TYPE_PIE = 'PIE'
const VIS_TYPE_RADAR = 'RADAR'
const VIS_TYPE_GAUGE = 'GAUGE'
const VIS_TYPE_SINGLE_VALUE = 'SINGLE_VALUE'
const VIS_TYPE_SCATTER = 'SCATTER'

// Individual data view types
const INDIVIDUAL_DATA_TYPES = [
    {
        value: VIS_TYPE_LINE_LIST,
        label: i18n.t('Line list'),
        icon: IconVisualizationLinelist16,
        enabled: true,
    },
]

// Aggregated view types
const AGGREGATED_DATA_TYPES = [
    {
        value: VIS_TYPE_PIVOT_TABLE,
        label: i18n.t('Pivot table'),
        icon: IconVisualizationPivotTable16,
        enabled: true,
    },
    {
        value: VIS_TYPE_COLUMN,
        label: i18n.t('Column'),
        icon: IconVisualizationColumn16,
        enabled: false,
    },
    {
        value: VIS_TYPE_STACKED_COLUMN,
        label: i18n.t('Stacked cols'),
        icon: IconVisualizationColumnStacked16,
        enabled: false,
    },
    {
        value: VIS_TYPE_BAR,
        label: i18n.t('Bar'),
        icon: IconVisualizationBar16,
        enabled: false,
    },
    {
        value: VIS_TYPE_STACKED_BAR,
        label: i18n.t('Stacked bar'),
        icon: IconVisualizationBarStacked16,
        enabled: false,
    },
    {
        value: VIS_TYPE_LINE,
        label: i18n.t('Line'),
        icon: IconVisualizationLine16,
        enabled: false,
    },
    {
        value: VIS_TYPE_AREA,
        label: i18n.t('Area'),
        icon: IconVisualizationArea16,
        enabled: false,
    },
    {
        value: VIS_TYPE_STACKED_AREA,
        label: i18n.t('Stacked area'),
        icon: IconVisualizationAreaStacked16,
        enabled: false,
    },
    {
        value: VIS_TYPE_PIE,
        label: i18n.t('Pie'),
        icon: IconVisualizationPie16,
        enabled: false,
    },
    {
        value: VIS_TYPE_RADAR,
        label: i18n.t('Radar'),
        icon: IconVisualizationRadar16,
        enabled: false,
    },
    {
        value: VIS_TYPE_GAUGE,
        label: i18n.t('Gauge'),
        icon: IconVisualizationGauge16,
        enabled: false,
    },
    {
        value: VIS_TYPE_SINGLE_VALUE,
        label: i18n.t('Single value'),
        icon: IconVisualizationSingleValue16,
        enabled: false,
    },
    {
        value: VIS_TYPE_SCATTER,
        label: i18n.t('Scatter'),
        icon: IconVisualizationScatter16,
        enabled: false,
    },
]

const VisualizationTypeGrid = () => {
    const dispatch = useDispatch()
    const currentType = useSelector(sGetUiType)

    const handleTypeClick = (value, enabled) => {
        if (!enabled) {
            return
        }
        dispatch(acSetUiType(value))
    }

    const renderGridItem = ({ value, label, icon: Icon, enabled }) => {
        const isActive = value === currentType
        const itemClassName = `${styles.gridItem} ${
            !enabled ? styles.disabled : ''
        } ${isActive ? styles.active : ''}`

        const item = (
            <button
                key={value}
                className={itemClassName}
                onClick={() => handleTypeClick(value, enabled)}
                disabled={!enabled}
                type="button"
            >
                <Icon color={enabled ? '#212934' : '#A0ADBA'} />
                <span className={styles.gridItemLabel}>{label}</span>
            </button>
        )

        if (!enabled) {
            return (
                <Tooltip
                    key={value}
                    content={i18n.t('Coming soon')}
                    placement="bottom"
                >
                    {({ onMouseOver, onMouseOut, ref }) => (
                        <div
                            ref={ref}
                            onMouseOver={onMouseOver}
                            onMouseOut={onMouseOut}
                            className={styles.tooltipWrapper}
                        >
                            {item}
                        </div>
                    )}
                </Tooltip>
            )
        }

        return item
    }

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    {i18n.t('Individual data view')}
                </div>
                <div className={styles.grid}>
                    {INDIVIDUAL_DATA_TYPES.map(renderGridItem)}
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    {i18n.t('Aggregated view')}
                </div>
                <div className={styles.grid}>
                    {AGGREGATED_DATA_TYPES.map(renderGridItem)}
                </div>
            </div>
        </div>
    )
}

export { VisualizationTypeGrid }
