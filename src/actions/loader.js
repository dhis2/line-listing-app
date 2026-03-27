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
    ({ error = null, digitGroupSeparator, rootOrgUnits }) =>
    (dispatch, getState) => {
        // Check if there's a data source selected that should be preserved
        const state = getState()
        const hasDataSource = !!state.ui?.dataSource?.id
        const preserveDataSource = hasDataSource && !error

        if (error) {
            dispatch(acSetLoadError(error))
        } else {
            dispatch(acClearLoadError())
        }

        // Only reset metadata if we're not preserving the data source
        // (preserving data source means we want to keep the program/TET metadata)
        if (!preserveDataSource) {
            dispatch(tSetInitMetadata(rootOrgUnits))
        }

        dispatch(acClearVisualization())
        dispatch(acClearCurrent())
        dispatch(
            acClearUi({
                rootOrgUnits,
                digitGroupSeparator,
                preserveDataSource,
            })
        )
    }
