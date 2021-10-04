/*eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }]*/
import { getOptionsForUi } from '../modules/options'

export const SET_UI = 'SET_UI'
export const SET_UI_OPTIONS = 'SET_UI_OPTIONS'
export const SET_UI_OPTION = 'SET_UI_OPTION'

const DEFAULT_UI = {
    options: getOptionsForUi(),
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
        default:
            return state
    }
}

// Selectors

export const sGetUi = state => state.ui

export const sGetUiOptions = state => sGetUi(state).options

export const sGetUiOption = () => {}
