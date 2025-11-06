import { getDefaultFromUi } from '../modules/current.js'
import { sGetMetadata } from './metadata.js'

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
                    return getDefaultFromUi(state, action.value)
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

export const sGetCurrentFromUi = (state) => {
    const ui = state.ui
    const metadata = sGetMetadata(state)

    switch (ui.type) {
        default: {
            return getDefaultFromUi(state.current, ui, metadata)
        }
    }
}
