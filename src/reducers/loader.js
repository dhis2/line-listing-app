export const SET_LOAD_ERROR = 'SET_LOAD_ERROR'
export const CLEAR_LOAD_ERROR = 'CLEAR_LOAD_ERROR'
export const SET_VISUALIZATION_LOADING = 'SET_VISUALIZATION_LOADING'

export const DEFAULT_LOADING = {
    loadingError: null,
    isVisualizationLoading: true,
}

export default (state = DEFAULT_LOADING, action) => {
    switch (action.type) {
        case SET_LOAD_ERROR: {
            return {
                ...state,
                loadingError: action.value,
            }
        }
        case CLEAR_LOAD_ERROR:
            return {
                ...state,
                loadingError: DEFAULT_LOADING.loadingError,
            }
        case SET_VISUALIZATION_LOADING:
            return {
                ...state,
                isVisualizationLoading: action.value,
            }
        default:
            return state
    }
}

// Selectors
export const sGetLoadError = (state) => state.loader.loadingError
export const sGetIsVisualizationLoading = (state) =>
    state.loader.isVisualizationLoading
