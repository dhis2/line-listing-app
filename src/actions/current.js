import { SET_CURRENT, CLEAR_CURRENT } from '../reducers/current'

export const acSetCurrent = value => ({
    type: SET_CURRENT,
    value,
})

export const acClearCurrent = () => ({
    type: CLEAR_CURRENT,
})
