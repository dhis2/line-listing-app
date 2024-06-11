import { getAdaptedVisualization } from '../components/Visualization/analyticsQueryTools.js'
import { genericClientError } from '../modules/error.js'
import {
    layoutHasProgramId,
    layoutHasTrackedEntityTypeId,
    validateLayout,
} from '../modules/layoutValidation.js'
import { getSortingFromVisualization } from '../modules/ui.js'
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
import { acSetShowExpandedLayoutPanel, acClearUiDataSorting } from './ui.js'

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

        const currentOverrides = {}

        const sorting = getSortingFromVisualization(currentFromUi)
        const { headers } = getAdaptedVisualization(currentFromUi)

        if (headers && sorting?.dimension) {
            // reset sorting if current sort dimension has been removed from Columns DHIS2-13948
            // flat() is needed here for repeated events where the dimension ids are nested in an array
            if (!headers.flat().includes(sorting.dimension)) {
                currentOverrides.sorting = undefined

                dispatch(acClearUiDataSorting())
            }
        }

        const current = { ...currentFromUi, ...currentOverrides }

        try {
            validateLayout(current)
            if (!validateOnly) {
                dispatch(acClearLoadError())
                dispatch(acSetVisualizationLoading(true))
            }
        } catch (error) {
            dispatch(acSetLoadError(error || genericClientError()))
        }

        if (!validateOnly) {
            // proceed if the layout either has a program id or a tracked entity type id
            if (
                layoutHasProgramId(current) ||
                layoutHasTrackedEntityTypeId(current)
            ) {
                dispatch(acSetCurrent(current))
            } else {
                dispatch(acClearCurrent())
            }

            dispatch(acSetShowExpandedLayoutPanel(false))
        }
    }
