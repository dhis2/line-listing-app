import {
    SET_LOAD_ERROR,
    CLEAR_LOAD_ERROR,
    SET_VISUALIZATION_LOADING,
} from '../reducers/loader.js'

export const acSetLoadError = (value) => ({
    type: SET_LOAD_ERROR,
    value,
})

export const acClearLoadError = () => ({ type: CLEAR_LOAD_ERROR })

export const acSetVisualizationLoading = (value) => ({
    type: SET_VISUALIZATION_LOADING,
    value,
})
