import {
    DIMENSION_ID_ORGUNIT,
    layoutGetAxisIdDimensionIdsObject,
    layoutGetDimensionIdItemIdsObject,
} from '@dhis2/analytics'
import { getAdaptedUiLayoutByType, getInverseLayout } from './layout'
import { getOptionsFromVisualization } from './options'
import { removeLastPathSegment } from './orgUnit'
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
    options: getOptionsFromVisualization(vis),
    layout: layoutGetAxisIdDimensionIdsObject(vis),
    itemsByDimension: layoutGetDimensionIdItemIdsObject(vis),
    conditions: getConditionsFromVisualization(vis),
    parentGraphMap:
        vis.parentGraphMap ||
        getParentGraphMapFromVisualization(vis) ||
        currentState.parentGraphMap,
})

export const getParentGraphMapFromVisualization = vis => {
    const dimensionIdsByAxis = layoutGetAxisIdDimensionIdsObject(vis)
    const inverseLayout = getInverseLayout(dimensionIdsByAxis)
    const ouAxis = inverseLayout[DIMENSION_ID_ORGUNIT]

    if (!ouAxis) {
        return {}
    }

    const parentGraphMap = {}
    const ouDimension = vis[ouAxis].find(
        dimension => dimension.dimension === DIMENSION_ID_ORGUNIT
    )

    ouDimension.items
        .filter(orgUnit => orgUnit.path)
        .forEach(orgUnit => {
            if ('/' + orgUnit.id === orgUnit.path) {
                // root org unit case
                parentGraphMap[orgUnit.id] = ''
            } else {
                const path = removeLastPathSegment(orgUnit.path)
                parentGraphMap[orgUnit.id] =
                    path[0] === '/' ? path.substr(1) : path
            }
        })

    return parentGraphMap
}

const getConditionsFromVisualization = vis => {
    const itemsWithConditions = [...vis.columns, ...vis.rows, ...vis.filters]
        .filter(item => item.filter)
        .map(item => ({ dimension: item.dimension, condition: item.filter }))
    return itemsWithConditions
}
