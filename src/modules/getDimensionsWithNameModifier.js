import {
    DIMENSION_TYPE_PERIOD,
    DIMENSION_TYPE_ORGANISATION_UNIT,
    DIMENSION_TYPE_DATA_ELEMENT,
} from '@dhis2/analytics'
import { DIMENSION_TYPE_STATUS } from './dimensionConstants.js'
import { extractDimensionIdParts } from './utils.js'
import { OUTPUT_TYPE_ENROLLMENT } from './visualization.js'

export const getDimensionsWithNameModifier = ({
    dimensionIds,
    metadata,
    inputType,
    layoutDimensionIds,
}) => {
    const dimensions = dimensionIds.map((id) => {
        const { dimensionId, programStageId, programId } =
            extractDimensionIdParts(id)
        const dimension = {
            ...metadata[id],
            dimensionId,
            programStageId,
            programId,
        }
        return dimension
    })

    const layoutDimensions = layoutDimensionIds.map((id) => {
        const { dimensionId, programStageId, programId } =
            extractDimensionIdParts(id)
        const dimension = {
            ...metadata[id],
            dimensionId,
            programStageId,
            programId,
        }
        return dimension
    })

    if ([OUTPUT_TYPE_ENROLLMENT].includes(inputType)) {
        const dimensionsWithNameModifier = dimensions.map((dimension) => {
            if (
                [
                    DIMENSION_TYPE_DATA_ELEMENT,
                    DIMENSION_TYPE_ORGANISATION_UNIT,
                    DIMENSION_TYPE_STATUS,
                    DIMENSION_TYPE_PERIOD,
                ].includes(dimension.dimensionType)
            ) {
                const duplicates = layoutDimensions.filter(
                    (d) =>
                        d.id !== dimension.id &&
                        d.dimensionId === dimension.dimensionId &&
                        d !== dimension &&
                        ((dimension.programId && d.programId) ||
                            (dimension.programStageId && d.programStageId))
                )

                if (duplicates.length > 0) {
                    const sameProgramId = duplicates.find(
                        (dup) => dup.programId === dimension.programId
                    )

                    const thirdPartyDuplicates = duplicates
                        .filter((dup) => dup.programId !== dimension.programId)
                        .find((dpid) =>
                            duplicates.find(
                                (dup) =>
                                    dup.programStageId !==
                                        dpid.programStageId &&
                                    dup.programId === dpid.programId
                            )
                        )

                    if (sameProgramId || thirdPartyDuplicates) {
                        dimension.nameModifier =
                            metadata[dimension.programStageId].name
                    } else {
                        dimension.nameModifier =
                            metadata[dimension.programId].name
                    }
                }
            }

            return dimension
        })

        return dimensionsWithNameModifier
    }

    return dimensions
}
