import { getPredefinedDimensions } from '@dhis2/analytics'

export const SET_DIMENSIONS = 'SET_DIMENSIONS'
export const SET_SELECTED_DIMENSION = 'SET_SELECTED_DIMENSION'

export const DEFAULT_DIMENSIONS = getPredefinedDimensions()

export default (state = DEFAULT_DIMENSIONS, action) => {
    switch (action.type) {
        case SET_DIMENSIONS: {
            return {
                ...DEFAULT_DIMENSIONS,
                ...action.value,
            }
        }
        default:
            return state
    }
}

export const sGetDimensions = state => state.dimensions
