import i18n from '@dhis2/d2-i18n'
import {
    FlyoutMenu,
    MenuItem,
    IconVisualizationLinelist16,
    Popper,
    Layer,
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
import styles from './ToolbarMenuDropdownTrigger.module.css'

const VISUALIZATION_TYPES = [
    { value: VIS_TYPE_LINE_LIST, label: i18n.t('Line List') },
    { value: VIS_TYPE_PIVOT_TABLE, label: i18n.t('Pivot Table') },
]

const VisualizationTypeSelect = ({ dataTest }) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const anchorRef = useRef(null)
    const dispatch = useDispatch()
    const currentType = useSelector(sGetUiType)
    const currentLayout = useSelector(sGetUiLayout)

    const selectedValue = currentType || VIS_TYPE_LINE_LIST
    const selectedLabel =
        VISUALIZATION_TYPES.find((type) => type.value === selectedValue)
            ?.label || i18n.t('Line List')

    const handleMenuItemClick = (value) => {
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

    return (
        <>
            <div ref={anchorRef} className={styles.wrapper}>
                <ToolbarMenuDropdownTrigger
                    icon={<IconVisualizationLinelist16 color="#6C7787" />}
                    label={selectedLabel}
                    onClick={() => setMenuOpen(!menuOpen)}
                    dataTest={dataTest}
                    open={menuOpen}
                />
            </div>
            {menuOpen && (
                <Layer onBackdropClick={() => setMenuOpen(false)}>
                    <Popper reference={anchorRef} placement="bottom-start">
                        <FlyoutMenu dense>
                            {VISUALIZATION_TYPES.map(({ value, label }) => (
                                <MenuItem
                                    key={value}
                                    label={label}
                                    onClick={() => handleMenuItemClick(value)}
                                    active={value === selectedValue}
                                />
                            ))}
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
        </>
    )
}

VisualizationTypeSelect.propTypes = {
    dataTest: PropTypes.string,
}

export { VisualizationTypeSelect }
