import {
    getAdaptedUiLayoutByType,
    VIS_TYPE_PIVOT_TABLE,
    VIS_TYPE_PIE,
    layoutGetAxisIdDimensionIdsObject,
    layoutGetDimensionIdItemIdsObject,
} from '@dhis2/analytics'

const defaultUiAdapter = ui => ({
    ...ui,
    layout: getAdaptedUiLayoutByType(ui.layout, VIS_TYPE_PIE), // TODO: Change this once LL has its own type (temp fix since pie has same axes as LL)),
    // FIXME: Note that using VIS_TYPE_PIE means all but 1 items will be moved to filter
})

export const getAdaptedUiByType = ui => {
    switch (ui.type) {
        case VIS_TYPE_PIVOT_TABLE:
            return ui
        default:
            return defaultUiAdapter(ui)
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
