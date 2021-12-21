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

//export const sGetLegendSets = (state) => state.legendSets
// TODO: Note that fetching the legend sets should be done on demand, currently its being done on app load which isn't ideal.
// When implementing a use-case for sGetLegendSets, consider refactoring this to actually just be stored in the component state rather than the redux store
