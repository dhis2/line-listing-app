import {
    SET_CURRENT,
    CLEAR_CURRENT,
    SET_CURRENT_FROM_UI,
} from '../reducers/current.js'
import { sGetUi } from '../reducers/ui.js'

const acSetCurrent = (value) => ({
    type: SET_CURRENT,
    value,
})

export const tSetCurrent = (visualization) => (dispatch) => {
    dispatch(acSetCurrent(visualization))
}

export const acClearCurrent = () => ({
    type: CLEAR_CURRENT,
})

export const acSetCurrentFromUi = (value) => ({
    type: SET_CURRENT_FROM_UI,
    value,
})

export const tSetCurrentFromUi = () => async (dispatch, getState) => {
    const ui = sGetUi(getState())

    dispatch(acSetCurrentFromUi(ui))
}
