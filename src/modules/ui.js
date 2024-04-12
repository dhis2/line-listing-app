import {
    layoutGetAxisIdDimensionIdsObject,
    layoutGetDimensionIdItemIdsObject,
    VIS_TYPE_LINE_LIST,
    VIS_TYPE_PIVOT_TABLE,
} from '@dhis2/analytics'
import { getConditionsFromVisualization } from './conditions.js'
import { getAdaptedUiLayoutByType } from './layout.js'
import { getOptionsFromVisualization } from './options.js'
import { getParentGraphMapFromVisualization } from './parentGraphMap.js'
import { getRepetitionFromVisualisation } from './repetition.js'

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
})

export const ACCESSORY_PANEL_TAB_INPUT = 'INPUT'
export const ACCESSORY_PANEL_TAB_PROGRAM = 'PROGRAM'
export const ACCESSORY_PANEL_TAB_YOUR = 'YOUR'
export const ACCESSORY_PANEL_TAB_TRACKED_ENTITY = 'TRACKED_ENTITY'
