export const SET_LEGEND_SETS = 'SET_LEGEND_SETS'

export const DEFAULT_LEGEND_SETS = []

export default (state = DEFAULT_LEGEND_SETS, action) => {
    switch (action.type) {
        case SET_LEGEND_SETS: {
            return action.value
        }
        default:
            return state
    }
}

export const sGetLegendSets = (state) => state.legendSets

export const sGetLegendSetById = (state, id) =>
    sGetLegendSets(state).find((legendSet) => legendSet.id === id)
