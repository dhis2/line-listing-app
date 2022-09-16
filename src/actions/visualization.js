import { getUiDimensionType } from '../modules/dimensionConstants.js'
import { getDynamicTimeDimensionsMetadata } from '../modules/metadata.js'
import { formatDimensionId } from '../modules/utils.js'
import { getDimensionMetadataFromVisualization } from '../modules/visualization.js'
import {
    SET_VISUALIZATION,
    CLEAR_VISUALIZATION,
} from '../reducers/visualization.js'

export const acSetVisualization = (value) => {
    const { program, programStage } = value
    const timeDimensions = getDynamicTimeDimensionsMetadata(
        program,
        programStage
    )
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

    // program
    if (program) {
        metadata.push({
            [program.id]: program,
        })
    }

    // program stage
    if (programStage) {
        metadata.push({
            [programStage.id]: programStage,
        })
    }

    // time dimensions
    Object.keys(timeDimensions).forEach((timeDimensionId) => {
        metadata.push({
            [timeDimensionId]: timeDimensions[timeDimensionId],
        })
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
