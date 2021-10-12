import {
    ADD_UI_LAYOUT_DIMENSIONS,
    REMOVE_UI_LAYOUT_DIMENSIONS,
    SET_UI_LAYOUT,
    SET_UI_OPTION,
    SET_UI_OPTIONS,
} from '../reducers/ui'

export const acSetUiOptions = value => ({
    type: SET_UI_OPTIONS,
    value,
})

export const acSetUiOption = value => ({
    type: SET_UI_OPTION,
    value,
})

export const acAddUiLayoutDimensions = value => ({
    type: ADD_UI_LAYOUT_DIMENSIONS,
    value,
})

export const acRemoveUiLayoutDimensions = value => ({
    type: REMOVE_UI_LAYOUT_DIMENSIONS,
    value,
})

export const acSetUiLayout = value => ({
    type: SET_UI_LAYOUT,
    value,
})
