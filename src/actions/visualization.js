import { getUiDimensionType } from '../modules/dimensionConstants.js'
import { formatDimensionId } from '../modules/utils.js'
import { getDimensionMetadataFromVisualization } from '../modules/visualization.js'
import {
    SET_VISUALIZATION,
    CLEAR_VISUALIZATION,
} from '../reducers/visualization.js'

export const acSetVisualization = (value) => {
    const collectedMetadata = getDimensionMetadataFromVisualization(value) || {}

    const dimensions = [
        ...(value.columns || []),
        ...(value.rows || []),
        ...(value.filters || []),
    ]

    const metadata = Object.keys(collectedMetadata).reduce((md, id) => {
        const dimension = dimensions.find((d) => d.dimension === id)

        if (!dimension) {
            return md
        }

        const prefixedId = formatDimensionId(
            dimension.dimension,
            dimension.programStage?.id
        )

        md.push({
            [prefixedId]: {
                id: prefixedId,
                name: collectedMetadata[id]?.name,
                valueType: dimension.valueType,
                optionSet: dimension.optionSet?.id,
                dimensionType: getUiDimensionType({
                    dimensionId: prefixedId,
                    dimensionType: dimension.dimensionType,
                }),
            },
        })

        return md
    }, [])

    return {
        type: SET_VISUALIZATION,
        value,
        metadata,
    }
}

export const acClearVisualization = () => ({
    type: CLEAR_VISUALIZATION,
})
