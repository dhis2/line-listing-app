import { genericClientError } from '../modules/error.js'
import {
    layoutHasProgramId,
    validateLayout,
} from '../modules/layoutValidation.js'
import {
    SET_CURRENT,
    CLEAR_CURRENT,
    SET_CURRENT_FROM_UI,
    sGetCurrentFromUi,
} from '../reducers/current.js'
import {
    acClearLoadError,
    acSetLoadError,
    acSetVisualizationLoading,
} from './loader.js'
import { acSetShowExpandedLayoutPanel } from './ui.js'

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

export const tSetCurrentFromUi =
    ({ validateOnly } = {}) =>
    (dispatch, getState) => {
        const state = getState()
        const currentFromUi = sGetCurrentFromUi(state)

        try {
            validateLayout(currentFromUi)
            if (!validateOnly) {
                dispatch(acClearLoadError())
                dispatch(acSetVisualizationLoading(true))
            }
        } catch (error) {
            dispatch(acSetLoadError(error || genericClientError()))
        }

        if (!validateOnly) {
            if (layoutHasProgramId(currentFromUi)) {
                dispatch(acSetCurrent(currentFromUi))
            } else {
                dispatch(acClearCurrent())
            }

            dispatch(acSetShowExpandedLayoutPanel(false))
        }
    }
