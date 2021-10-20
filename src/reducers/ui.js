/*eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }]*/
import { DIMENSION_ID_ORGUNIT } from '@dhis2/analytics'
import { getFilteredLayout } from '../modules/layout'
import { getOptionsForUi } from '../modules/options'
import { getAdaptedUiByType, getUiFromVisualization } from '../modules/ui'
import { VIS_TYPE_LINE_LIST } from '../modules/visualization'

export const SET_UI = 'SET_UI'
export const SET_UI_OPTIONS = 'SET_UI_OPTIONS'
export const SET_UI_OPTION = 'SET_UI_OPTION'
export const ADD_UI_LAYOUT_DIMENSIONS = 'ADD_UI_LAYOUT_DIMENSIONS'
export const REMOVE_UI_LAYOUT_DIMENSIONS = 'REMOVE_UI_LAYOUT_DIMENSIONS'
export const SET_UI_LAYOUT = 'SET_UI_LAYOUT'
export const SET_UI_FROM_VISUALIZATION = 'SET_UI_FROM_VISUALIZATION'
export const CLEAR_UI = 'CLEAR_UI'

const EMPTY_UI = {
    layout: {
        columns: [],
        filters: [],
    },
    itemsByDimension: {},
}

const DEFAULT_UI = {
    type: VIS_TYPE_LINE_LIST,
    options: getOptionsForUi(),
    layout: {
        // TODO: Populate the layout with the correct default dimensions, these are just temporary for testing
        columns: [DIMENSION_ID_ORGUNIT],
        filters: [],
    },
    itemsByDimension: {
        [DIMENSION_ID_ORGUNIT]: [],
    },
}

const getPreselectedUi = options => {
    const { rootOrgUnit } = options

    const rootOrgUnits = []
    const parentGraphMap = { ...DEFAULT_UI.parentGraphMap }

    if (rootOrgUnit && rootOrgUnit.id) {
        rootOrgUnits.push(rootOrgUnit.id)

        parentGraphMap[rootOrgUnit.id] = ''
    }

    return {
        ...DEFAULT_UI,
        options: {
            ...DEFAULT_UI.options,
            //digitGroupSeparator,
        },
        itemsByDimension: {
            ...DEFAULT_UI.itemsByDimension,
            [DIMENSION_ID_ORGUNIT]: rootOrgUnits,
        },
        // parentGraphMap,
    }
}

export default (state = EMPTY_UI, action) => {
    switch (action.type) {
        case SET_UI: {
            return {
                ...action.value,
            }
        }
        case SET_UI_OPTIONS: {
            return {
                ...state,
                options: {
                    ...state.options,
                    ...action.value,
                },
            }
        }
        // action.value: transfer object (dimensionId:axisId) saying what to add where: { ou: 'rows' }
        // Reducer takes care of swapping (retransfer) if dimension already exists in layout
        case ADD_UI_LAYOUT_DIMENSIONS: {
            const transfers = {
                ...action.value,
            }

            let newLayout = state.layout

            // Add dimension ids to destination (axisId === null means remove from layout)
            Object.entries(transfers).forEach(
                ([dimensionId, { axisId, index }]) => {
                    if (newLayout[axisId]) {
                        // Filter out transferred dimension id (remove from source)
                        newLayout = getFilteredLayout(newLayout, [dimensionId])
                        if (index === null || index === undefined) {
                            newLayout[axisId].push(dimensionId)
                        } else {
                            newLayout[axisId].splice(index, 0, dimensionId)
                        }
                    }
                }
            )

            return {
                ...state,
                layout: newLayout,
            }
        }
        case REMOVE_UI_LAYOUT_DIMENSIONS: {
            return {
                ...state,
                layout: getFilteredLayout(state.layout, action.value),
            }
        }
        case SET_UI_FROM_VISUALIZATION: {
            return getAdaptedUiByType(
                getUiFromVisualization(action.value, state)
            )
        }
        case SET_UI_LAYOUT: {
            return {
                ...state,
                layout: {
                    ...action.value,
                },
            }
        }
        case CLEAR_UI: {
            return getPreselectedUi(action.value)
        }
        default:
            return state
    }
}

// Selectors

export const sGetUi = state => state.ui
export const sGetUiOptions = state => sGetUi(state).options
export const sGetUiOption = () => {} // TODO: items stored here should be flattened and reintegrated into sGetUiOptions (above)
export const sGetUiItems = state => sGetUi(state).itemsByDimension
export const sGetUiLayout = state => sGetUi(state).layout

// Selectors level 2

export const sGetUiItemsByDimension = (state, dimension) =>
    sGetUiItems(state)[dimension] || DEFAULT_UI.itemsByDimension[dimension]
