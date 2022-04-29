import {
    DIMENSION_ID_ORGUNIT,
    layoutGetAxisIdDimensionIdsObject,
    layoutGetDimensionIdItemIdsObject,
    VIS_TYPE_LINE_LIST,
    VIS_TYPE_PIVOT_TABLE,
} from '@dhis2/analytics'
import isObject from 'lodash-es/isObject'
import { getInputTypeFromVisualization } from './input.js'
import { getAdaptedUiLayoutByType, getInverseLayout } from './layout.js'
import { getOptionsFromVisualization } from './options.js'
import { removeLastPathSegment } from './orgUnit.js'
import { getProgramFromVisualisation } from './program.js'
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
    input: getInputTypeFromVisualization(vis),
    program: getProgramFromVisualisation(vis),
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

export const getParentGraphMapFromVisualization = (vis) => {
    const dimensionIdsByAxis = layoutGetAxisIdDimensionIdsObject(vis)
    const inverseLayout = getInverseLayout(dimensionIdsByAxis)
    const ouAxis = inverseLayout[DIMENSION_ID_ORGUNIT]

    if (!ouAxis) {
        return {}
    }

    const parentGraphMap = {}
    const ouDimension = vis[ouAxis].find(
        (dimension) => dimension.dimension === DIMENSION_ID_ORGUNIT
    )

    ouDimension.items
        .filter((orgUnit) => orgUnit.path)
        .forEach((orgUnit) => {
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

const getConditionsFromVisualization = (vis) =>
    [...vis.columns, ...vis.rows, ...vis.filters]
        .filter((item) => item.filter || item.legendSet)
        .reduce(
            (acc, key) => ({
                ...acc,
                [key.programStage?.id
                    ? `${key.programStage.id}.${key.dimension}`
                    : key.dimension]: {
                    condition: key.filter,
                    legendSet: key.legendSet?.id,
                },
            }),
            {}
        )

// Repetition

export const PROP_MOST_RECENT = 'mostRecent'
export const PROP_OLDEST = 'oldest'

export const getDefaultCurrentRepetition = () => []
export const getDefaultUiRepetition = () => ({
    [PROP_MOST_RECENT]: 1,
    [PROP_OLDEST]: 0,
})

export const PARSE_CURRENT_REPETITION_ERROR =
    'parseCurrentRepetition: Invalid input'

export const PARSE_UI_REPETITION_ERROR = 'parseUiRepetition: Invalid input'

export const parseCurrentRepetition = (repetition) => {
    if (
        !(
            Array.isArray(repetition) &&
            repetition.length &&
            repetition.every((i) => typeof i === 'number')
        )
    ) {
        throw new Error(PARSE_CURRENT_REPETITION_ERROR)
    }

    return {
        [PROP_MOST_RECENT]: repetition.filter((n) => n < 1).length,
        [PROP_OLDEST]: repetition.filter((n) => n > 0).length,
    }
}

export const parseUiRepetition = (repetition) => {
    if (
        !(
            isObject(repetition) &&
            typeof repetition[PROP_MOST_RECENT] === 'number' &&
            repetition[PROP_MOST_RECENT] >= 0 &&
            typeof repetition[PROP_OLDEST] === 'number' &&
            repetition[PROP_OLDEST] >= 0
        )
    ) {
        throw new Error(PARSE_UI_REPETITION_ERROR)
    }

    if (repetition[PROP_MOST_RECENT] === 0 && repetition[PROP_OLDEST] === 0) {
        return getDefaultCurrentRepetition()
    }

    return [
        ...new Array(repetition[PROP_OLDEST]).fill().map((_, i) => i + 1),
        ...new Array(repetition[PROP_MOST_RECENT])
            .fill()
            .map((_, i) => -i + 0)
            .sort((a, b) => a - b),
    ]
}
