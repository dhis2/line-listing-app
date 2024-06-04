import {
    layoutGetAxisIdDimensionIdsObject,
    layoutGetDimensionIdItemIdsObject,
    VIS_TYPE_LINE_LIST,
    VIS_TYPE_PIVOT_TABLE,
} from '@dhis2/analytics'
import { getConditionsFromVisualization } from './conditions.js'
import { getRequestOptions } from './getRequestOptions.js'
import { getAdaptedUiLayoutByType } from './layout.js'
import { getOptionsFromVisualization } from './options.js'
import { getParentGraphMapFromVisualization } from './parentGraphMap.js'
import { getRepetitionFromVisualisation } from './repetition.js'
import { getHeadersMap } from './visualization.js'

export const ACCESSORY_PANEL_TAB_INPUT = 'INPUT'
export const ACCESSORY_PANEL_TAB_PROGRAM = 'PROGRAM'
export const ACCESSORY_PANEL_TAB_YOUR = 'YOUR'
export const ACCESSORY_PANEL_TAB_TRACKED_ENTITY = 'TRACKED_ENTITY'
export const ACCESSORY_PANEL_DEFAULT_WIDTH = 260
export const ACCESSORY_PANEL_MIN_WIDTH = 180
export const ACCESSORY_PANEL_MIN_PX_AT_END = 50
export const PRIMARY_PANEL_WIDTH = 260

const ACCESSORY_PANEL_WIDTH_STORAGE_KEY = 'DHIS2_LL_ACCESSORY_PANEL_WIDTH'

const lineListUiAdapter = (ui) => ({
    ...ui,
    layout: getAdaptedUiLayoutByType(ui.layout, VIS_TYPE_LINE_LIST),
})

export const getAdaptedUiByType = (ui) => {
    switch (ui.type) {
        case VIS_TYPE_LINE_LIST:
            return lineListUiAdapter(ui)
        case VIS_TYPE_PIVOT_TABLE:
        default:
            return ui
    }
}

export const getUiFromVisualization = (vis, currentState = {}) => ({
    ...currentState,
    input: {
        type: vis.outputType,
    },
    entityType: vis.trackedEntityType,
    program: {
        id: vis.program?.id,
        stageId: vis.programStage?.id,
    },
    options: getOptionsFromVisualization(vis),
    layout: layoutGetAxisIdDimensionIdsObject(vis),
    itemsByDimension: layoutGetDimensionIdItemIdsObject(vis),
    conditions: getConditionsFromVisualization(vis),
    parentGraphMap:
        vis.parentGraphMap ||
        getParentGraphMapFromVisualization(vis) ||
        currentState.parentGraphMap,
    repetitionByDimension: getRepetitionFromVisualisation(vis),
    sorting: getSortingFromVisualization(vis),
})

// Sorting
//
export const getSortingFromVisualization = (vis) => {
    const dimensionHeadersMap = getHeadersMap(getRequestOptions(vis))

    return vis.sorting?.length
        ? {
              dimension:
                  dimensionHeadersMap[vis.sorting[0].dimension] ||
                  vis.sorting[0].dimension,
              direction: vis.sorting[0].direction.toLowerCase(),
          }
        : undefined
}

export const getDefaultSorting = () => ({
    dimension: null,
    direction: 'default',
})

export const getUserSidebarWidth = () => {
    const localStorageItem = window.localStorage.getItem(
        ACCESSORY_PANEL_WIDTH_STORAGE_KEY
    )

    if (!localStorageItem) {
        return ACCESSORY_PANEL_DEFAULT_WIDTH
    }

    const preferredWidth = parseInt(localStorageItem)
    const availableWidth =
        window.innerWidth -
        (PRIMARY_PANEL_WIDTH + ACCESSORY_PANEL_MIN_PX_AT_END)

    return Math.min(preferredWidth, availableWidth)
}

export const setUserSidebarWidthToLocalStorage = (width) => {
    window.localStorage.setItem(ACCESSORY_PANEL_WIDTH_STORAGE_KEY, width)
}
