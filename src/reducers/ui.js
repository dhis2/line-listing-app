/*eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }]*/
import {
    DIMENSION_ID_DATA,
    DIMENSION_ID_ORGUNIT,
    DIMENSION_ID_PERIOD,
} from '@dhis2/analytics'
import { getFilteredLayout } from '../modules/layout'
import { getOptionsForUi } from '../modules/options'

export const SET_UI = 'SET_UI'
export const SET_UI_OPTIONS = 'SET_UI_OPTIONS'
export const SET_UI_OPTION = 'SET_UI_OPTION'
export const ADD_UI_LAYOUT_DIMENSIONS = 'ADD_UI_LAYOUT_DIMENSIONS'
export const SET_UI_LAYOUT = 'SET_UI_LAYOUT'

const DEFAULT_UI = {
    options: getOptionsForUi(),
    layout: {
        columns: [DIMENSION_ID_DATA],
        filters: [DIMENSION_ID_ORGUNIT, DIMENSION_ID_PERIOD],
    },
    itemsByDimension: {
        [DIMENSION_ID_ORGUNIT]: [],
        [DIMENSION_ID_PERIOD]: [],
    },
}

export default (state = DEFAULT_UI, action) => {
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
        case SET_UI_LAYOUT: {
            return {
                ...state,
                layout: {
                    ...action.value,
                },
            }
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
