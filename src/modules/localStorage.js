import { ACCESSORY_PANEL_DEFAULT_WIDTH } from './accessoryPanelConstants.js'

export const STORAGE_KEY = 'dhis2.line-listing.accessoryPanelWidth'

export const getUserSidebarWidthFromLocalStorage = () =>
    parseInt(
        window.localStorage.getItem(STORAGE_KEY) ??
            ACCESSORY_PANEL_DEFAULT_WIDTH
    )

export const setUserSidebarWidthToLocalStorage = (width) => {
    window.localStorage.setItem(STORAGE_KEY, width)
}
