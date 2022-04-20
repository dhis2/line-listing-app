import {
    SET_LOAD_ERROR,
    CLEAR_LOAD_ERROR,
    SET_VISUALIZATION_LOADING,
} from '../reducers/loader.js'
import { acClearCurrent } from './current.js'
import { tSetInitMetadata } from './metadata.js'
import { acClearUi } from './ui.js'
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
    (error = null, rootOrgUnits, digitGroupSeparator) =>
    (dispatch) => {
        if (error) {
            dispatch(acSetLoadError(error))
        } else {
            dispatch(acClearLoadError())
        }

        dispatch(tSetInitMetadata())
        dispatch(acClearVisualization())
        dispatch(acClearCurrent())
        dispatch(
            acClearUi({
                rootOrgUnits,
                digitGroupSeparator,
            })
        )
    }
