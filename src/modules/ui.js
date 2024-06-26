import {
    layoutGetAxisIdDimensionIdsObject,
    layoutGetDimensionIdItemIdsObject,
    VIS_TYPE_LINE_LIST,
    VIS_TYPE_PIVOT_TABLE,
} from '@dhis2/analytics'
import {
    PRIMARY_PANEL_WIDTH,
    ACCESSORY_PANEL_MIN_PX_AT_END,
} from './accessoryPanelConstants.js'
import { getConditionsFromVisualization } from './conditions.js'
import { getRequestOptions } from './getRequestOptions.js'
import { getAdaptedUiLayoutByType } from './layout.js'
import { getUserSidebarWidthFromLocalStorage } from './localStorage.js'
import { getOptionsFromVisualization } from './options.js'
import { getParentGraphMapFromVisualization } from './parentGraphMap.js'
import { getRepetitionFromVisualisation } from './repetition.js'
import { getHeadersMap } from './visualization.js'

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

export const getUserSidebarWidth = () =>
    Math.min(
        getUserSidebarWidthFromLocalStorage(),
        window.innerWidth -
            (PRIMARY_PANEL_WIDTH + ACCESSORY_PANEL_MIN_PX_AT_END)
    )
