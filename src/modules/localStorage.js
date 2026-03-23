import { VIS_TYPE_LINE_LIST } from '@dhis2/analytics'
import {
    ACCESSORY_PANEL_DEFAULT_WIDTH,
    ACCESSORY_PANEL_MIN_PX_AT_END,
    ACCESSORY_PANEL_MIN_WIDTH,
    PRIMARY_PANEL_WIDTH,
} from './accessoryPanelConstants.js'

export const STORAGE_KEY = 'dhis2.line-listing.accessoryPanelWidth'
export const VIS_TYPE_STORAGE_KEY =
    'dhis2.line-listing.lastUsedVisualizationType'

const sanitizeWidth = (width) => {
    const maxAvailableWidth =
        window.innerWidth -
        (PRIMARY_PANEL_WIDTH + ACCESSORY_PANEL_MIN_PX_AT_END)
    let sanitizedWidth = parseInt(width)

    if (!Number.isInteger(sanitizedWidth)) {
        sanitizedWidth = ACCESSORY_PANEL_DEFAULT_WIDTH
    }

    // First enforce upper bound
    if (sanitizedWidth > maxAvailableWidth) {
        sanitizedWidth = maxAvailableWidth
    }

    // Then enforce lower bound, so lower bound takes precedence
    if (sanitizedWidth < ACCESSORY_PANEL_MIN_WIDTH) {
        sanitizedWidth = ACCESSORY_PANEL_MIN_WIDTH
    }

    return sanitizedWidth
}

export const getUserSidebarWidthFromLocalStorage = () =>
    sanitizeWidth(window.localStorage.getItem(STORAGE_KEY))

export const setUserSidebarWidthToLocalStorage = (width) => {
    window.localStorage.setItem(STORAGE_KEY, sanitizeWidth(width))
}

// Get the last used visualization type from localStorage, defaulting to Line List
export const getLastUsedVisualizationType = () => {
    const stored = window.localStorage.getItem(VIS_TYPE_STORAGE_KEY)
    return stored || VIS_TYPE_LINE_LIST
}

// Save the visualization type to localStorage
export const setLastUsedVisualizationType = (type) => {
    if (type) {
        window.localStorage.setItem(VIS_TYPE_STORAGE_KEY, type)
    }
}
