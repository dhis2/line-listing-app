import {
    SET_VISUALIZATION,
    CLEAR_VISUALIZATION,
} from '../reducers/visualization.js'

export const acSetVisualization = (value) => {
    const metadata = [
        ...(value.columns || []),
        ...(value.rows || []),
        ...(value.filters || []),
    ]
        .filter(
            (dim) => dim.valueType || dim.optionSet?.id || dim.dimensionType
        )
        .map((dim) => ({
            [dim.dimension]: {
                valueType: dim.valueType,
                optionSet: dim.optionSet?.id,
                dimensionType: dim.dimensionType,
            },
        }))

    return {
        type: SET_VISUALIZATION,
        value,
        metadata,
    }
}

export const acClearVisualization = () => ({
    type: CLEAR_VISUALIZATION,
})
