import { ACCESSORY_PANEL_DEFAULT_WIDTH } from './accessoryPanelConstants.js'

export const STORAGE_KEY = 'DHIS2_LL_ACCESSORY_PANEL_WIDTH'

export const getUserSidebarWidthFromLocalStorage = () =>
    parseInt(
        window.localStorage.getItem(STORAGE_KEY) ??
            ACCESSORY_PANEL_DEFAULT_WIDTH
    )

export const setUserSidebarWidthToLocalStorage = (width) => {
    window.localStorage.setItem(STORAGE_KEY, width)
}
