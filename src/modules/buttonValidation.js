/**
 * Finds which program a stage belongs to by searching through all programs in metadata
 * @param {string} stageId - The stage ID to look up
 * @param {Object} metadata - The metadata object containing programs
 * @returns {string|undefined} The program ID, or undefined if not found
 */
const findProgramIdForStage = (stageId, metadata) => {
    if (!stageId || !metadata) {
        return undefined
    }

    // Look through all metadata entries to find programs
    for (const [key, value] of Object.entries(metadata)) {
        // Check if this is a program (has programStages array)
        if (value?.programStages && Array.isArray(value.programStages)) {
            // Check if this program contains the stage
            const hasStage = value.programStages.some(
                (stage) => stage.id === stageId
            )
            if (hasStage) {
                return value.id
            }
        }
    }

    return undefined
}

/**
 * Extracts program and stage IDs from a dimension ID based on its format
 * This function detects the format by counting dots, not by output type
 * @param {string} id - The dimension ID to parse
 * @param {Object} metadata - The metadata object to look up dimension details
 * @returns {Object} Object with programId and programStageId properties
 */
const extractProgramAndStageFromDimensionId = (id, metadata) => {
    if (!id) {
        return {}
    }

    const parts = id.split('.')
    const numParts = parts.length

    if (numParts === 3) {
        // Format: programId.programStageId.dimensionId (TRACKED_ENTITY format)
        const [programId, rawStageId] = parts
        const [programStageId] = rawStageId.split('[') // Handle repetition index
        return { programId, programStageId }
    } else if (numParts === 2) {
        // Format: programStageId.dimensionId (EVENT/ENROLLMENT format)
        const [rawStageId] = parts
        const [programStageId] = rawStageId.split('[') // Handle repetition index

        // For 2-part IDs, find the program by looking up which program contains this stage
        const programId = findProgramIdForStage(programStageId, metadata)

        return { programId, programStageId }
    } else {
        // Format: dimensionId (single part, no program/stage info)
        return {}
    }
}

/**
 * Analyzes all dimensions in the layout to extract unique programs and program stages
 * @param {Object} layout - The layout object with columns and filters arrays
 * @param {Object} metadata - The metadata object containing dimension details
 * @returns {Object} Analysis result with unique programs, stages, and dimension count
 */
export const analyzeDimensionsInLayout = (layout, metadata = {}) => {
    if (!layout) {
        return {
            dimensionCount: 0,
            uniquePrograms: new Set(),
            uniqueStages: new Set(),
            hasDimensions: false,
        }
    }

    const allDimensionIds = [
        ...(layout.columns || []),
        ...(layout.filters || []),
    ]

    const uniquePrograms = new Set()
    const uniqueStages = new Set()

    allDimensionIds.forEach((dimensionId) => {
        const { programId, programStageId } =
            extractProgramAndStageFromDimensionId(dimensionId, metadata)

        if (programId) {
            uniquePrograms.add(programId)
        }

        if (programStageId) {
            uniqueStages.add(programStageId)
        }
    })

    return {
        dimensionCount: allDimensionIds.length,
        uniquePrograms,
        uniqueStages,
        hasDimensions: allDimensionIds.length > 0,
    }
}

/**
 * Validates whether the Event button should be enabled
 * @param {Object} dimensionAnalysis - Result from analyzeDimensionsInLayout
 * @returns {Object} Validation result with disabled flag and optional reason
 */
export const validateEventButton = (dimensionAnalysis) => {
    const { hasDimensions, uniquePrograms, uniqueStages } = dimensionAnalysis

    // Rule: Disabled if no dimensions
    if (!hasDimensions) {
        return {
            disabled: true,
            reason: 'No dimensions in layout',
        }
    }

    // Rule: Disabled if multiple programs (check this first as it's more fundamental)
    if (uniquePrograms.size > 1) {
        return {
            disabled: true,
            reason: 'Multiple programs present in layout',
        }
    }

    // Rule: Disabled if multiple program stages
    if (uniqueStages.size > 1) {
        return {
            disabled: true,
            reason: 'Multiple program stages present in layout',
        }
    }

    return {
        disabled: false,
    }
}

/**
 * Validates whether the Enrollment button should be enabled
 * @param {Object} dimensionAnalysis - Result from analyzeDimensionsInLayout
 * @returns {Object} Validation result with disabled flag and optional reason
 */
export const validateEnrollmentButton = (dimensionAnalysis) => {
    const { hasDimensions, uniquePrograms } = dimensionAnalysis

    // Rule: Disabled if no dimensions
    if (!hasDimensions) {
        return {
            disabled: true,
            reason: 'No dimensions in layout',
        }
    }

    // Rule: Disabled if multiple programs
    if (uniquePrograms.size > 1) {
        return {
            disabled: true,
            reason: 'Multiple programs present in layout',
        }
    }

    return {
        disabled: false,
    }
}

/**
 * Validates whether the Tracked Entity button should be enabled
 * @param {Object} dimensionAnalysis - Result from analyzeDimensionsInLayout
 * @param {boolean} supportsTrackedEntity - Whether the data source supports tracked entities
 * @returns {Object} Validation result with disabled flag and optional reason
 */
export const validateTrackedEntityButton = (
    dimensionAnalysis,
    supportsTrackedEntity
) => {
    const { hasDimensions } = dimensionAnalysis

    // Rule: Disabled if no dimensions
    if (!hasDimensions) {
        return {
            disabled: true,
            reason: 'No dimensions in layout',
        }
    }

    // Rule: Disabled if tracked entity not supported by data source
    if (!supportsTrackedEntity) {
        return {
            disabled: true,
            reason: 'Data source does not support tracked entities',
        }
    }

    // Note: Unlike Event and Enrollment, Tracked Entity supports multiple programs
    // because tracked entities can be enrolled in multiple programs

    return {
        disabled: false,
    }
}

/**
 * Main validation function that returns the state for all three buttons
 * @param {Object} layout - The layout object with columns and filters arrays
 * @param {Object} metadata - The metadata object containing dimension details
 * @param {boolean} supportsTrackedEntity - Whether the data source supports tracked entities
 * @returns {Object} Validation results for all three buttons
 */
export const validateButtons = (layout, metadata, supportsTrackedEntity) => {
    const dimensionAnalysis = analyzeDimensionsInLayout(layout, metadata)

    return {
        event: validateEventButton(dimensionAnalysis),
        enrollment: validateEnrollmentButton(dimensionAnalysis),
        trackedEntity: validateTrackedEntityButton(
            dimensionAnalysis,
            supportsTrackedEntity
        ),
        dimensionAnalysis, // Include for debugging/additional use
    }
}
