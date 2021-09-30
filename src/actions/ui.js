import { SET_UI_OPTION, SET_UI_OPTIONS } from '../reducers/ui'

export const acSetUiOptions = value => ({
    type: SET_UI_OPTIONS,
    value,
})

export const acSetUiOption = value => ({
    type: SET_UI_OPTION,
    value,
})
