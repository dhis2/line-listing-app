import { DIMENSION_TYPE_DATA_ELEMENT } from '@dhis2/analytics'
import { extractDimensionIdParts } from './utils.js'
import { OUTPUT_TYPE_ENROLLMENT } from './visualization.js'

export const getDimensionsWithStageName = ({
    axisDimensionIds,
    metadata,
    inputType,
    layoutDimensionIds,
}) => {
    const axisDimensions = axisDimensionIds.map((id) => {
        const { dimensionId, programStageId } = extractDimensionIdParts(id)
        const dimension = {
            ...metadata[id],
            dimensionId,
            programStageId,
        }
        return dimension
    })

    const layoutDimensions = layoutDimensionIds.map((id) => {
        const { dimensionId, programStageId } = extractDimensionIdParts(id)
        const dimension = {
            ...metadata[id],
            dimensionId,
            programStageId,
        }
        return dimension
    })

    if ([OUTPUT_TYPE_ENROLLMENT].includes(inputType)) {
        const axisDimensionsWithStageName = axisDimensions.map((dimension) => {
            if (
                [DIMENSION_TYPE_DATA_ELEMENT].includes(dimension.dimensionType)
            ) {
                const duplicates = layoutDimensions.filter(
                    (d) =>
                        d.dimensionId === dimension.dimensionId &&
                        d.id !== dimension.id &&
                        d !== dimension &&
                        dimension.programStageId &&
                        d.programStageId
                )

                if (duplicates.length > 0) {
                    dimension.stageName =
                        metadata[dimension.programStageId].name
                }
            }

            return dimension
        })

        return axisDimensionsWithStageName
    }

    return axisDimensions
}
