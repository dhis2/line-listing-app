import { apiFetchLegendSets } from '../api/legendSets.js'
import { SET_LEGEND_SETS } from '../reducers/legendSets.js'

export const acSetLegendSets = (value) => ({
    type: SET_LEGEND_SETS,
    value,
})

export const tSetLegendSets = () => async (dispatch, getState, engine) => {
    const onSuccess = (legendSets) => {
        dispatch(acSetLegendSets(legendSets))
    }

    const onError = (error) => {
        console.log('Error (apiFetchLegendSets): ', error)
        return error
    }

    try {
        const legendSets = await apiFetchLegendSets(engine)
        return onSuccess(legendSets)
    } catch (err) {
        return onError(err)
    }
}
