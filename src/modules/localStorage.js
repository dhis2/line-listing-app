import { ACCESSORY_PANEL_DEFAULT_WIDTH } from './accessoryPanelConstants.js'

export const STORAGE_KEY = 'dhis2.line-listing.accessoryPanelWidth'

const sanitizeWidth = (width) => {
    const parsedWidth = parseInt(width)
    return Number.isInteger(parsedWidth)
        ? parsedWidth
        : ACCESSORY_PANEL_DEFAULT_WIDTH
}

export const getUserSidebarWidthFromLocalStorage = () =>
    sanitizeWidth(window.localStorage.getItem(STORAGE_KEY))

export const setUserSidebarWidthToLocalStorage = (width) => {
    window.localStorage.setItem(STORAGE_KEY, sanitizeWidth(width))
}
