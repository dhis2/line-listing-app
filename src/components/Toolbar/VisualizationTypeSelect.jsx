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
    Popper,
    Layer,
    Tooltip,
} from '@dhis2/ui'
import {
    VIS_TYPE_LINE_LIST,
    VIS_TYPE_PIVOT_TABLE,
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
} from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiType, acSetUiLayout } from '../../actions/ui.js'
import { sGetUiType, sGetUiLayout } from '../../reducers/ui.js'
import { ToolbarMenuDropdownTrigger } from './ToolbarMenuDropdownTrigger.jsx'
import styles from './VisualizationTypeSelect.module.css'

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

// All types combined for lookup
const ALL_VISUALIZATION_TYPES = [
    ...INDIVIDUAL_DATA_TYPES,
    ...AGGREGATED_DATA_TYPES,
]

const VisualizationTypeSelect = ({ dataTest, className }) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const anchorRef = useRef(null)
    const dispatch = useDispatch()
    const currentType = useSelector(sGetUiType)
    const currentLayout = useSelector(sGetUiLayout)

    // Find the current type's config
    const currentTypeConfig = ALL_VISUALIZATION_TYPES.find(
        (type) => type.value === currentType
    )

    // Determine label - show placeholder when no type selected
    const selectedLabel = currentType
        ? currentTypeConfig?.label || currentType
        : i18n.t('Choose a visualization type')

    // Get the icon for the current type
    const CurrentIcon = currentTypeConfig?.icon || IconVisualizationLinelist16

    const handleMenuItemClick = (value, enabled) => {
        // Don't do anything for disabled types
        if (!enabled) {
            return
        }

        const newType = value

        // If switching types, handle dimension movement
        if (newType !== currentType) {
            let newLayout = { ...currentLayout }

            if (
                currentType === VIS_TYPE_LINE_LIST &&
                newType === VIS_TYPE_PIVOT_TABLE
            ) {
                // Line List → Pivot Table: Move all dimensions to filters (empty columns/rows)
                const allDimensions = [
                    ...(currentLayout[AXIS_ID_COLUMNS] || []),
                    ...(currentLayout[AXIS_ID_ROWS] || []),
                    ...(currentLayout[AXIS_ID_FILTERS] || []),
                ]
                newLayout = {
                    [AXIS_ID_COLUMNS]: [],
                    [AXIS_ID_ROWS]: [],
                    [AXIS_ID_FILTERS]: allDimensions,
                }
            } else if (
                currentType === VIS_TYPE_PIVOT_TABLE &&
                newType === VIS_TYPE_LINE_LIST
            ) {
                // Pivot Table → Line List: Merge columns + rows into columns, keep filters
                const mergedColumns = [
                    ...(currentLayout[AXIS_ID_COLUMNS] || []),
                    ...(currentLayout[AXIS_ID_ROWS] || []),
                ]
                newLayout = {
                    [AXIS_ID_COLUMNS]: mergedColumns,
                    [AXIS_ID_ROWS]: [],
                    [AXIS_ID_FILTERS]: currentLayout[AXIS_ID_FILTERS] || [],
                }
            }

            // Update layout and type
            dispatch(acSetUiLayout(newLayout))
            dispatch(acSetUiType(newType))
        }

        setMenuOpen(false)
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
                onClick={() => handleMenuItemClick(value, enabled)}
                disabled={!enabled}
                type="button"
            >
                <Icon color={enabled ? '#212934' : '#A0ADBA'} />
                <span className={styles.gridItemLabel}>{label}</span>
            </button>
        )

        // Wrap disabled items with tooltip
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

    // Don't show dropdown when no type is selected (grid is shown inline)
    const showDropdown = currentType && menuOpen

    return (
        <>
            <div ref={anchorRef} className={styles.wrapper}>
                <ToolbarMenuDropdownTrigger
                    icon={
                        currentType ? (
                            <CurrentIcon color="#6C7787" />
                        ) : (
                            <IconVisualizationLinelist16 color="#6C7787" />
                        )
                    }
                    label={selectedLabel}
                    onClick={() => currentType && setMenuOpen(!menuOpen)}
                    dataTest={dataTest}
                    open={menuOpen}
                    className={className}
                    showChevron={Boolean(currentType)}
                />
            </div>
            {showDropdown && (
                <Layer onBackdropClick={() => setMenuOpen(false)}>
                    <Popper reference={anchorRef} placement="bottom-start">
                        <div className={styles.dropdownPanel}>
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
                    </Popper>
                </Layer>
            )}
        </>
    )
}

VisualizationTypeSelect.propTypes = {
    dataTest: PropTypes.string,
    className: PropTypes.string,
}

export { VisualizationTypeSelect }
