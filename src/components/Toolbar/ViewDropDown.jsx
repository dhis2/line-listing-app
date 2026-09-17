import i18n from '@dhis2/d2-i18n'
import { FlyoutMenu, MenuItem, Popper, Layer } from '@dhis2/ui'
import React, { useCallback, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    acToggleUiSidebarHidden,
    acToggleUiLayoutPanelHidden,
    acSetUiDetailsPanelOpen,
    acSetUiAccessoryPanelWidth,
} from '../../actions/ui.js'
import { ACCESSORY_PANEL_DEFAULT_WIDTH } from '../../modules/accessoryPanelConstants.js'
import { setUserSidebarWidthToLocalStorage } from '../../modules/localStorage.js'
import { sGetCurrentId } from '../../reducers/current.js'
import {
    sGetUiLayoutPanelHidden,
    sGetUiSidebarHidden,
    sGetUiShowDetailsPanel,
    sGetUiAccessoryPanelWidth,
} from '../../reducers/ui.js'
import { ToolbarMenuDropdownTrigger } from './ToolbarMenuDropdownTrigger.jsx'
import styles from './ToolbarMenuDropdownTrigger.module.css'

export default function ViewDropDown() {
    const dispatch = useDispatch()
    const isSidebarHidden = useSelector(sGetUiSidebarHidden)
    const isLayoutPanelHidden = useSelector(sGetUiLayoutPanelHidden)
    const isDetailsPanelOpen = useSelector(sGetUiShowDetailsPanel)
    const userSettingWidth = useSelector(sGetUiAccessoryPanelWidth)
    const id = useSelector(sGetCurrentId)
    const [menuOpen, setMenuOpen] = useState(false)
    const anchorRef = useRef(null)

    const toggleLayoutPanelHidden = useCallback(() => {
        dispatch(acToggleUiLayoutPanelHidden())
        setMenuOpen(false)
    }, [dispatch])

    const toggleSidebarHidden = useCallback(() => {
        dispatch(acToggleUiSidebarHidden())
        setMenuOpen(false)
    }, [dispatch])

    const resetAccessorySidebarWidth = useCallback(() => {
        setUserSidebarWidthToLocalStorage(ACCESSORY_PANEL_DEFAULT_WIDTH)
        dispatch(acSetUiAccessoryPanelWidth(ACCESSORY_PANEL_DEFAULT_WIDTH))
        setMenuOpen(false)
    }, [dispatch])

    const toggleDetailsPanelOpen = useCallback(() => {
        dispatch(acSetUiDetailsPanelOpen(!isDetailsPanelOpen))
        setMenuOpen(false)
    }, [dispatch, isDetailsPanelOpen])

    const toggleLayoutPanelText = isLayoutPanelHidden
        ? i18n.t('Show layout')
        : i18n.t('Hide layout')
    const toggleSidebarText = isSidebarHidden
        ? i18n.t('Show dimensions sidebar')
        : i18n.t('Hide dimensions sidebar')
    const toggleDetailsPanelText = isDetailsPanelOpen
        ? i18n.t('Hide interpretations and details')
        : i18n.t('Show interpretations and details')

    return (
        <>
            <div ref={anchorRef} className={styles.wrapper}>
                <ToolbarMenuDropdownTrigger
                    onClick={() => setMenuOpen(!menuOpen)}
                    dataTest="view-menu"
                    open={menuOpen}
                    label={i18n.t('View')}
                />
            </div>
            {menuOpen && (
                <Layer onBackdropClick={() => setMenuOpen(false)}>
                    <Popper reference={anchorRef} placement="bottom-start">
                        <FlyoutMenu dense>
                            <MenuItem
                                label={toggleLayoutPanelText}
                                onClick={toggleLayoutPanelHidden}
                            />
                            <MenuItem
                                label={toggleSidebarText}
                                onClick={toggleSidebarHidden}
                            />
                            <MenuItem
                                label={i18n.t('Reset sidebar width')}
                                onClick={resetAccessorySidebarWidth}
                                disabled={
                                    userSettingWidth ===
                                    ACCESSORY_PANEL_DEFAULT_WIDTH
                                }
                            />
                            <MenuItem
                                label={toggleDetailsPanelText}
                                onClick={toggleDetailsPanelOpen}
                                disabled={!id}
                            />
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
        </>
    )
}
