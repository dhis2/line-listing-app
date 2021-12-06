import { getDefaultFromUi } from '../modules/current.js'

export const SET_CURRENT = 'SET_CURRENT'
export const SET_CURRENT_FROM_UI = 'SET_CURRENT_FROM_UI'
export const CLEAR_CURRENT = 'CLEAR_CURRENT'

export const DEFAULT_CURRENT = null

export default (state = DEFAULT_CURRENT, action) => {
    switch (action.type) {
        case SET_CURRENT: {
            return action.value
        }
        case SET_CURRENT_FROM_UI: {
            switch (action.value.type) {
                default: {
                    return getDefaultFromUi(state, action)
                }
            }
        }
        case CLEAR_CURRENT:
            return DEFAULT_CURRENT
        default:
            return state
    }
}

// Selectors

export const sGetCurrent = (state) => state.current

// FIXME: Won't work when creating a new AO (before Update has been clicked). This should be stored on ui instead so its always available
export const sGetLegendSetIdByDimensionId = (state, dimensionId) =>
    [
        ...(sGetCurrent(state).columns || []),
        ...(sGetCurrent(state).rows || []),
        ...(sGetCurrent(state).filters || []),
    ].find((dim) => dim.dimension === dimensionId)?.legendSet?.id
