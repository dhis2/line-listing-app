export const SET_ALERTBAR = 'SET_ALERTBAR'
export const CLEAR_ALERTBAR = 'CLEAR_ALERTBAR'

export const DEFAULT_ALERTBAR = {}

export default (state = DEFAULT_ALERTBAR, action) => {
    switch (action.type) {
        case SET_ALERTBAR: {
            return action.value
        }
        case CLEAR_ALERTBAR: {
            return DEFAULT_ALERTBAR
        }
        default:
            return state
    }
}

// Selectors

export const sGetAlertBar = state => state.alertbar
