import {
    SET_CURRENT,
    CLEAR_CURRENT,
    SET_CURRENT_FROM_UI,
} from '../reducers/current'
import { sGetUi } from '../reducers/ui'

export const acSetCurrent = (value) => ({
    type: SET_CURRENT,
    value,
})

export const acClearCurrent = () => ({
    type: CLEAR_CURRENT,
})

export const acSetCurrentFromUi = (value) => ({
    type: SET_CURRENT_FROM_UI,
    value,
})

export const tSetCurrentFromUi = () => async (dispatch, getState) => {
    dispatch(acSetCurrentFromUi(sGetUi(getState())))
}
