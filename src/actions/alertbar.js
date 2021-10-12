import { SET_ALERTBAR, CLEAR_ALERTBAR } from '../reducers/alertbar'

export const acSetAlertBar = value => ({
    type: SET_ALERTBAR,
    value,
})

export const acClearAlertBar = () => ({
    type: CLEAR_ALERTBAR,
})
