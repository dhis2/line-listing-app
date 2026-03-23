import {
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_ORGANISATION_UNIT,
    DIMENSION_TYPE_PERIOD,
} from '@dhis2/analytics'
import { DIMENSION_TYPE_STATUS } from './dimensionConstants.js'
import { extractDimensionIdParts } from './dimensionId.js'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from './visualization.js'

export const getDimensionsWithSuffix = ({
    dimensionIds,
    metadata,
    inputType,
}) => {
    const dimensions = dimensionIds.map((id) => {
        const { dimensionId, programStageId, programId } =
            extractDimensionIdParts(id, inputType)
        const dimension = {
            ...metadata[id],
            dimensionId,
            programStageId,
            programId,
        }
        if (!dimension.id) {
            dimension.id = id
        }
        return dimension
    })

    // Apply suffix logic for all output types
    return dimensions.map((dimension) => {
        if (
            [DIMENSION_TYPE_DATA_ELEMENT, DIMENSION_TYPE_PERIOD].includes(
                dimension.dimensionType || dimension.dimensionItemType
            )
        ) {
            const duplicates = dimensions.filter(
                (d) =>
                    d.dimensionId === dimension.dimensionId &&
                    d !== dimension &&
                    ((dimension.programId && d.programId) ||
                        (dimension.programStageId && d.programStageId))
            )

            if (duplicates.length > 0) {
                // Always show stage suffix for duplicates with stage IDs
                if (dimension.programStageId) {
                    dimension.suffix =
                        metadata[dimension.programStageId]?.name ||
                        metadata[dimension.programId]?.name
                } else if (dimension.programId) {
                    // Fall back to program suffix for duplicates without stage IDs (e.g., time dimensions)
                    dimension.suffix = metadata[dimension.programId]?.name
                }
            }
        } else if (
            [DIMENSION_TYPE_ORGANISATION_UNIT, DIMENSION_TYPE_STATUS].includes(
                dimension.dimensionType || dimension.dimensionItemType
            )
        ) {
            // For EVENT and ENROLLMENT: apply stage suffix for stage-specific org units
            if (
                [OUTPUT_TYPE_EVENT, OUTPUT_TYPE_ENROLLMENT].includes(
                    inputType
                ) &&
                dimension.programStageId
            ) {
                // Check if there are other org units with different stages
                const duplicates = dimensions.filter(
                    (d) =>
                        d.dimensionId === dimension.dimensionId &&
                        d !== dimension &&
                        d.programStageId &&
                        d.programStageId !== dimension.programStageId
                )
                // Apply stage suffix if there are duplicates or if it's stage-specific
                if (duplicates.length > 0 || dimension.programStageId) {
                    dimension.suffix = metadata[dimension.programStageId]?.name
                }
            } else if (
                // For TRACKED_ENTITY: always suffix ou and statuses with program name
                inputType === OUTPUT_TYPE_TRACKED_ENTITY &&
                dimension.programId
            ) {
                dimension.suffix = metadata[dimension.programId]?.name
            }
        }

        return dimension
    })
}
