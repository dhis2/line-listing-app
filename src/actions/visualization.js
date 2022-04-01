import { getUiDimensionType } from '../modules/dimensionConstants.js'
import { formatDimensionId } from '../modules/utils.js'
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
        .map((dim) => {
            const id = formatDimensionId(dim.dimension, dim.programStage?.id)

            return {
                [id]: {
                    valueType: dim.valueType,
                    optionSet: dim.optionSet?.id,
                    dimensionType: getUiDimensionType({
                        dimensionId: id,
                        dimensionType: dim.dimensionType,
                    }),
                    id,
                },
            }
        })

    return {
        type: SET_VISUALIZATION,
        value,
        metadata,
    }
}

export const acClearVisualization = () => ({
    type: CLEAR_VISUALIZATION,
})
