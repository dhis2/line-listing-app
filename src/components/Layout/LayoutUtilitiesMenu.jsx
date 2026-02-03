import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    VIS_TYPE_LINE_LIST,
    VIS_TYPE_PIVOT_TABLE,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    Layer,
    Popper,
    FlyoutMenu,
    MenuItem,
    IconMore16,
    MenuDivider,
} from '@dhis2/ui'
import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetUiLayout, acRemoveUiLayoutDimensions } from '../../actions/ui.js'
import { sGetUiType, sGetUiLayout } from '../../reducers/ui.js'
import IconButton from '../IconButton/IconButton.jsx'
import styles from './styles/LayoutUtilitiesMenu.module.css'

const LayoutUtilitiesMenu = () => {
    const dispatch = useDispatch()
    const visualizationType = useSelector(sGetUiType)
    const layout = useSelector(sGetUiLayout)

    const buttonRef = useRef()
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = (e) => {
        setMenuOpen(!menuOpen)
        e?.stopPropagation()
    }

    const closeMenu = () => setMenuOpen(false)

    // Get dimensions from each axis (with fallback to empty array)
    const columns = layout[AXIS_ID_COLUMNS] || []
    const rows = layout[AXIS_ID_ROWS] || []
    const filters = layout[AXIS_ID_FILTERS] || []

    // Check if there are any dimensions to act on
    const hasAnyDimensions =
        columns.length > 0 || rows.length > 0 || filters.length > 0

    // Swap columns <-> filter (Line List)
    const handleSwapColumnsFilter = () => {
        dispatch(
            acSetUiLayout({
                [AXIS_ID_COLUMNS]: filters,
                [AXIS_ID_FILTERS]: columns,
                [AXIS_ID_ROWS]: rows,
            })
        )
        closeMenu()
    }

    // Swap columns <-> rows (Pivot Table)
    const handleSwapColumnsRows = () => {
        dispatch(
            acSetUiLayout({
                [AXIS_ID_COLUMNS]: rows,
                [AXIS_ID_ROWS]: columns,
                [AXIS_ID_FILTERS]: filters,
            })
        )
        closeMenu()
    }

    // Move all to columns
    const handleMoveAllToColumns = () => {
        dispatch(
            acSetUiLayout({
                [AXIS_ID_COLUMNS]: [...columns, ...rows, ...filters],
                [AXIS_ID_ROWS]: [],
                [AXIS_ID_FILTERS]: [],
            })
        )
        closeMenu()
    }

    // Move all to rows (Pivot Table only)
    const handleMoveAllToRows = () => {
        dispatch(
            acSetUiLayout({
                [AXIS_ID_COLUMNS]: [],
                [AXIS_ID_ROWS]: [...columns, ...rows, ...filters],
                [AXIS_ID_FILTERS]: [],
            })
        )
        closeMenu()
    }

    // Move all to filter
    const handleMoveAllToFilter = () => {
        dispatch(
            acSetUiLayout({
                [AXIS_ID_COLUMNS]: [],
                [AXIS_ID_ROWS]: [],
                [AXIS_ID_FILTERS]: [...columns, ...rows, ...filters],
            })
        )
        closeMenu()
    }

    // Clear columns
    const handleClearColumns = () => {
        if (columns.length > 0) {
            dispatch(acRemoveUiLayoutDimensions(columns))
        }
        closeMenu()
    }

    // Clear rows
    const handleClearRows = () => {
        if (rows.length > 0) {
            dispatch(acRemoveUiLayoutDimensions(rows))
        }
        closeMenu()
    }

    // Clear filter
    const handleClearFilter = () => {
        if (filters.length > 0) {
            dispatch(acRemoveUiLayoutDimensions(filters))
        }
        closeMenu()
    }

    // Clear all dimensions
    const handleClearAll = () => {
        const allIds = [...columns, ...rows, ...filters]
        if (allIds.length > 0) {
            dispatch(acRemoveUiLayoutDimensions(allIds))
        }
        closeMenu()
    }

    const isPivotTable = visualizationType === VIS_TYPE_PIVOT_TABLE
    const isLineList = visualizationType === VIS_TYPE_LINE_LIST

    return (
        <div className={styles.wrapper} ref={buttonRef}>
            <IconButton
                ariaOwns={menuOpen ? 'layout-utilities-menu' : null}
                ariaHaspopup={true}
                onClick={toggleMenu}
                dataTest="layout-utilities-menu-button"
            >
                <IconMore16 />
            </IconButton>
            {menuOpen && (
                <Layer onBackdropClick={closeMenu}>
                    <Popper reference={buttonRef} placement="bottom-end">
                        <FlyoutMenu dense dataTest="layout-utilities-menu">
                            {isLineList && (
                                <MenuItem
                                    label={i18n.t('Swap Columns and Filter')}
                                    onClick={handleSwapColumnsFilter}
                                    disabled={
                                        columns.length === 0 &&
                                        filters.length === 0
                                    }
                                    dataTest="layout-utilities-swap-columns-filter"
                                />
                            )}
                            {isPivotTable && (
                                <MenuItem
                                    label={i18n.t('Swap Columns and Rows')}
                                    onClick={handleSwapColumnsRows}
                                    disabled={
                                        columns.length === 0 &&
                                        rows.length === 0
                                    }
                                    dataTest="layout-utilities-swap-columns-rows"
                                />
                            )}
                            <MenuItem
                                label={i18n.t('Move all to Columns')}
                                onClick={handleMoveAllToColumns}
                                disabled={
                                    rows.length === 0 && filters.length === 0
                                }
                                dataTest="layout-utilities-move-all-columns"
                            />
                            {isPivotTable && (
                                <MenuItem
                                    label={i18n.t('Move all to Rows')}
                                    onClick={handleMoveAllToRows}
                                    disabled={
                                        columns.length === 0 &&
                                        filters.length === 0
                                    }
                                    dataTest="layout-utilities-move-all-rows"
                                />
                            )}
                            <MenuItem
                                label={i18n.t('Move all to Filter')}
                                onClick={handleMoveAllToFilter}
                                disabled={
                                    columns.length === 0 && rows.length === 0
                                }
                                dataTest="layout-utilities-move-all-filter"
                            />
                            <MenuDivider dense />
                            <MenuItem
                                destructive
                                label={i18n.t('Clear Columns')}
                                onClick={handleClearColumns}
                                disabled={columns.length === 0}
                                dataTest="layout-utilities-clear-columns"
                            />
                            {isPivotTable && (
                                <MenuItem
                                    destructive
                                    label={i18n.t('Clear Rows')}
                                    onClick={handleClearRows}
                                    disabled={rows.length === 0}
                                    dataTest="layout-utilities-clear-rows"
                                />
                            )}
                            {isLineList && (
                                <MenuItem
                                    destructive
                                    label={i18n.t('Clear Filter')}
                                    onClick={handleClearFilter}
                                    disabled={filters.length === 0}
                                    dataTest="layout-utilities-clear-filter"
                                />
                            )}
                            <MenuItem
                                label={i18n.t('Clear all')}
                                destructive={true}
                                onClick={handleClearAll}
                                disabled={!hasAnyDimensions}
                                dataTest="layout-utilities-clear-all"
                            />
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
        </div>
    )
}

export default LayoutUtilitiesMenu
