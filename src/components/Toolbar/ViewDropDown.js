import {
    HoverMenuDropdown,
    HoverMenuList,
    HoverMenuListItem,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    acToggleUiSidebarHidden,
    acToggleUiLayoutPanelHidden,
    acSetUiDetailsPanelOpen,
    acSetUiAccessoryPanelWidth,
} from '../../actions/ui.js'
import {
    ACCESSORY_PANEL_DEFAULT_WIDTH,
    setUserSidebarWidthToLocalStorage,
} from '../../modules/ui.js'
import { sGetCurrentId } from '../../reducers/current.js'
import {
    sGetUiLayoutPanelHidden,
    sGetUiSidebarHidden,
    sGetUiShowDetailsPanel,
    sGetUiAccessoryPanelWidth,
} from '../../reducers/ui.js'

export default function ViewDropDown() {
    const dispatch = useDispatch()
    const isSidebarHidden = useSelector(sGetUiSidebarHidden)
    const isLayoutPanelHidden = useSelector(sGetUiLayoutPanelHidden)
    const isDetailsPanelOpen = useSelector(sGetUiShowDetailsPanel)
    const userSettingWidth = useSelector(sGetUiAccessoryPanelWidth)
    const id = useSelector(sGetCurrentId)

    const toggleLayoutPanelHidden = useCallback(() => {
        dispatch(acToggleUiLayoutPanelHidden())
    }, [dispatch])

    const toggleSidebarHidden = useCallback(() => {
        dispatch(acToggleUiSidebarHidden())
    }, [dispatch])

    const resetAccessorySidebarWidth = useCallback(() => {
        setUserSidebarWidthToLocalStorage(ACCESSORY_PANEL_DEFAULT_WIDTH)
        dispatch(acSetUiAccessoryPanelWidth(ACCESSORY_PANEL_DEFAULT_WIDTH))
    }, [dispatch])

    const toggleDetailsPanelOpen = useCallback(() => {
        dispatch(acSetUiDetailsPanelOpen(!isDetailsPanelOpen))
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
        <HoverMenuDropdown label={i18n.t('View')}>
            <HoverMenuList>
                <HoverMenuListItem
                    label={toggleLayoutPanelText}
                    onClick={toggleLayoutPanelHidden}
                />
                <HoverMenuListItem
                    label={toggleSidebarText}
                    onClick={toggleSidebarHidden}
                />
                <HoverMenuListItem
                    label={i18n.t('Reset sidebar width')}
                    onClick={resetAccessorySidebarWidth}
                    disabled={
                        userSettingWidth === ACCESSORY_PANEL_DEFAULT_WIDTH
                    }
                />
                <HoverMenuListItem
                    label={toggleDetailsPanelText}
                    onClick={toggleDetailsPanelOpen}
                    disabled={!id}
                />
            </HoverMenuList>
        </HoverMenuDropdown>
    )
}
