import {
    SET_LOAD_ERROR,
    CLEAR_LOAD_ERROR,
    SET_VISUALIZATION_LOADING,
} from '../reducers/loader.js'
import { acClearCurrent } from './current.js'
import { tClearUi } from './ui.js'
import { acClearVisualization } from './visualization.js'

export const acSetLoadError = (value) => ({
    type: SET_LOAD_ERROR,
    value,
})

export const acClearLoadError = () => ({ type: CLEAR_LOAD_ERROR })

export const acSetVisualizationLoading = (value) => ({
    type: SET_VISUALIZATION_LOADING,
    value,
})

export const acClearAll =
    (error = null) =>
    (dispatch) => {
        if (error) {
            dispatch(acSetLoadError(error))
        } else {
            dispatch(acClearLoadError())
        }

        dispatch(acClearVisualization())
        dispatch(acClearCurrent())
        dispatch(tClearUi())
    }
