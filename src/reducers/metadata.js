export const ADD_METADATA = 'ADD_METADATA'
export const CLEAR_METADATA = 'CLEAR_METADATA'

export const EMPTY_METADATA = {}

export default (state = EMPTY_METADATA, action) => {
    switch (action.type) {
        case ADD_METADATA: {
            const result = { ...state }
            Object.entries(action.value).forEach(
                ([key, value]) => (result[key] = { ...result[key], ...value })
            )
            return result
        }
        case CLEAR_METADATA:
            return EMPTY_METADATA
        default:
            return state
    }
}

// Selectors

export const sGetMetadata = (state) => state.metadata

export const sGetMetadataById = (state, id) => state.metadata[id]
