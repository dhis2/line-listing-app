import {
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_ORGANISATION_UNIT,
    DIMENSION_TYPE_PERIOD,
} from '@dhis2/analytics'
import { DIMENSION_TYPE_STATUS } from './dimensionConstants.js'
import { extractDimensionIdParts } from './dimensionId.js'
import {
    OUTPUT_TYPE_ENROLLMENT,
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
                const sameProgramId = duplicates.find(
                    (dup) => dup.programId === dimension.programId
                )
                const thirdPartyDuplicates = duplicates
                    .filter((dup) => dup.programId !== dimension.programId)
                    .find((dpid) =>
                        duplicates.find(
                            (dup) =>
                                dup.programStageId !== dpid.programStageId &&
                                dup.programId === dpid.programId
                        )
                    )

                if (sameProgramId || thirdPartyDuplicates) {
                    dimension.suffix = metadata[dimension.programStageId]?.name
                } else {
                    dimension.suffix = metadata[dimension.programId]?.name
                }
            } else if (dimension.programStageId) {
                // Always show stage suffix for stage-specific dimensions even without duplicates
                dimension.suffix = metadata[dimension.programStageId]?.name
            }
        } else if (
            // always suffix ou and statuses for TE
            inputType === OUTPUT_TYPE_TRACKED_ENTITY &&
            [DIMENSION_TYPE_ORGANISATION_UNIT, DIMENSION_TYPE_STATUS].includes(
                dimension.dimensionType || dimension.dimensionItemType
            ) &&
            dimension.programId
        ) {
            dimension.suffix = metadata[dimension.programId]?.name
        }

        return dimension
    })
}
