import { sGetRootOrgUnit } from '../reducers/settings'
import {
    ADD_UI_LAYOUT_DIMENSIONS,
    REMOVE_UI_LAYOUT_DIMENSIONS,
    SET_UI_LAYOUT,
    SET_UI_OPTION,
    SET_UI_OPTIONS,
    SET_UI_FROM_VISUALIZATION,
    CLEAR_UI,
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

export const acSetUiFromVisualization = value => ({
    type: SET_UI_FROM_VISUALIZATION,
    value,
})

export const acClearUi = value => ({
    type: CLEAR_UI,
    value,
})

export const tClearUi = () => (dispatch, getState) => {
    const rootOrgUnit = sGetRootOrgUnit(getState())

    dispatch(
        acClearUi({
            rootOrgUnit,
        })
    )
}
