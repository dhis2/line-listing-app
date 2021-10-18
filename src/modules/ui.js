import {
    layoutGetAxisIdDimensionIdsObject,
    layoutGetDimensionIdItemIdsObject,
} from '@dhis2/analytics'
import { getAdaptedUiLayoutByType } from './layout'
import { VIS_TYPE_LINE_LIST, VIS_TYPE_PIVOT_TABLE } from './visualization'

const lineListUiAdapter = ui => ({
    ...ui,
    layout: getAdaptedUiLayoutByType(ui.layout, VIS_TYPE_LINE_LIST),
})

export const getAdaptedUiByType = ui => {
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
    // type: vis.type || defaultVisType,
    // options: getOptionsFromVisualization(vis),
    layout: layoutGetAxisIdDimensionIdsObject(vis),
    itemsByDimension: layoutGetDimensionIdItemIdsObject(vis),
    // parentGraphMap:
    //     vis.parentGraphMap ||
    //     getParentGraphMapFromVisualization(vis) ||
    //     currentState.parentGraphMap,
})
