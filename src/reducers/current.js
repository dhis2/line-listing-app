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
export const sGetCurrentId = (state) => state.current?.id
