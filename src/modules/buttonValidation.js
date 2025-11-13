import { DIMENSION_ID_ORGUNIT } from '@dhis2/analytics'
import {
    PROGRAM_TYPE_WITH_REGISTRATION,
    PROGRAM_TYPE_WITHOUT_REGISTRATION,
} from './programTypes.js'
import { extractDimensionIdParts } from './dimensionId.js'
import {
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_PROGRAM_STATUS,
    DIMENSION_IDS_TIME,
} from './dimensionConstants.js'

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
 * Checks if a dimension is a program dimension
 * A dimension is a program dimension if:
 * - It has a programId in its structure (data elements, program attributes, indicators)
 * - OR it's a program-prefixed special dimension (time, status, orgunit with programId prefix)
 * - OR it's a program-specific dimension by nature (time dimensions, event/program status)
 * @param {string} dimensionId - The dimension ID to check
 * @param {Object} metadata - The metadata object containing dimension details
 * @param {string} outputType - The output type (for proper parsing)
 * @returns {Object} Object with programId, programStageId, and isProgramDimension flag
 */
const checkIfProgramDimension = (dimensionId, metadata, outputType) => {
    // First use the simple parsing to check for multi-part IDs
    const simpleParts = extractProgramAndStageFromDimensionId(
        dimensionId,
        metadata
    )

    // If we found a programId from the multi-part parsing, it's a program dimension
    if (simpleParts.programId) {
        return {
            ...simpleParts,
            isProgramDimension: true,
        }
    }

    // For dimensions that might have programId prefix (time, status, orgunit),
    // use extractDimensionIdParts to check
    const parts = extractDimensionIdParts(dimensionId, outputType)
    const baseId = parts.dimensionId

    // Check if it's a special dimension that could be program-specific
    const isSpecialDimension =
        baseId === DIMENSION_ID_ORGUNIT ||
        baseId === DIMENSION_ID_EVENT_STATUS ||
        baseId === DIMENSION_ID_PROGRAM_STATUS ||
        DIMENSION_IDS_TIME.has(baseId)

    // If it's a special dimension and has a programId, it's a program dimension
    if (isSpecialDimension && parts.programId) {
        return {
            programId: parts.programId,
            programStageId: parts.programStageId,
            isProgramDimension: true,
        }
    }

    // IMPORTANT: Some dimensions are inherently program dimensions even without prefix
    // Time dimensions (enrollmentDate, eventDate, incidentDate, scheduledDate) only exist
    // in the context of a program, so they're always program dimensions
    if (DIMENSION_IDS_TIME.has(baseId)) {
        return {
            isProgramDimension: true,
        }
    }

    // Event status and Program status are also inherently program dimensions
    if (
        baseId === DIMENSION_ID_EVENT_STATUS ||
        baseId === DIMENSION_ID_PROGRAM_STATUS
    ) {
        return {
            isProgramDimension: true,
        }
    }

    // Organisation unit without prefix is also a program dimension for EVENT/ENROLLMENT
    // For those output types, it comes from getProgramDimensions() and represents
    // the org unit in program context. For TRACKED_ENTITY, unprefixed 'ou' is the
    // registration org unit (generic), but we count it as program dimension here because:
    // 1. We're validating EVENT/ENROLLMENT buttons where ou is always program-specific
    // 2. If this is truly a TE-only viz with no program, other validations will catch it
    if (baseId === DIMENSION_ID_ORGUNIT) {
        return {
            isProgramDimension: true,
        }
    }

    // Otherwise, it's not a program dimension (generic/tracked entity dimension)
    return {
        isProgramDimension: false,
    }
}

/**
 * Analyzes all dimensions in the layout to extract unique programs and program stages
 * @param {Object} layout - The layout object with columns and filters arrays
 * @param {Object} metadata - The metadata object containing dimension details
 * @returns {Object} Analysis result with unique programs, stages, program types, and dimension count
 */
export const analyzeDimensionsInLayout = (layout, metadata = {}) => {
    if (!layout) {
        return {
            dimensionCount: 0,
            uniquePrograms: new Set(),
            uniqueStages: new Set(),
            programTypes: new Set(),
            hasDimensions: false,
            hasMixedProgramTypes: false,
            hasProgramDimensions: false,
        }
    }

    const allDimensionIds = [
        ...(layout.columns || []),
        ...(layout.filters || []),
    ]

    const uniquePrograms = new Set()
    const uniqueStages = new Set()
    const programTypes = new Set()
    let hasProgramDimensions = false

    // We need to try multiple output types to properly parse dimensions
    // since we don't know the output type at analysis time
    const outputTypesToTry = ['EVENT', 'ENROLLMENT', 'TRACKED_ENTITY']

    allDimensionIds.forEach((dimensionId) => {
        // Try parsing with different output types and see if any detects a program dimension
        let foundProgramDimension = false
        let foundProgramId = null
        let foundStageId = null

        for (const outputType of outputTypesToTry) {
            const result = checkIfProgramDimension(
                dimensionId,
                metadata,
                outputType
            )

            if (result.isProgramDimension) {
                foundProgramDimension = true
                foundProgramId = result.programId
                foundStageId = result.programStageId
                break
            }
        }

        if (foundProgramDimension) {
            hasProgramDimensions = true

            if (foundProgramId) {
                uniquePrograms.add(foundProgramId)

                // Look up the program type in metadata
                const program = metadata[foundProgramId]
                if (program?.programType) {
                    programTypes.add(program.programType)
                }
            }

            if (foundStageId) {
                uniqueStages.add(foundStageId)
            }
        }
    })

    // Check if we have both WITH_REGISTRATION and WITHOUT_REGISTRATION
    const hasMixedProgramTypes =
        programTypes.has(PROGRAM_TYPE_WITH_REGISTRATION) &&
        programTypes.has(PROGRAM_TYPE_WITHOUT_REGISTRATION)

    return {
        dimensionCount: allDimensionIds.length,
        uniquePrograms,
        uniqueStages,
        programTypes,
        hasDimensions: allDimensionIds.length > 0,
        hasMixedProgramTypes,
        hasProgramDimensions,
    }
}

/**
 * Validates whether the Event button should be enabled
 * @param {Object} dimensionAnalysis - Result from analyzeDimensionsInLayout
 * @returns {Object} Validation result with disabled flag and optional reason
 */
export const validateEventButton = (dimensionAnalysis) => {
    const {
        hasDimensions,
        uniquePrograms,
        uniqueStages,
        hasMixedProgramTypes,
        hasProgramDimensions,
    } = dimensionAnalysis

    // Rule: Disabled if no dimensions
    if (!hasDimensions) {
        return {
            disabled: true,
            reason: 'No dimensions in layout',
        }
    }

    // Rule: Disabled if no program dimensions (only generic or tracked entity dimensions)
    if (!hasProgramDimensions) {
        return {
            disabled: true,
            reason: 'No program dimensions in layout',
        }
    }

    // Rule: Disabled if mixed program types (WITH_REGISTRATION and WITHOUT_REGISTRATION)
    if (hasMixedProgramTypes) {
        return {
            disabled: true,
            reason: 'Cannot combine programs with and without registration',
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
 * @param {string} programType - The program type (WITH_REGISTRATION or WITHOUT_REGISTRATION)
 * @returns {Object} Validation result with disabled/hidden flag and optional reason
 */
export const validateEnrollmentButton = (dimensionAnalysis, programType) => {
    const {
        hasDimensions,
        uniquePrograms,
        hasMixedProgramTypes,
        hasProgramDimensions,
    } = dimensionAnalysis

    // Rule: Hidden if program type is WITHOUT_REGISTRATION
    if (programType === 'WITHOUT_REGISTRATION') {
        return {
            disabled: false,
            hidden: true,
        }
    }

    // Rule: Disabled if no dimensions
    if (!hasDimensions) {
        return {
            disabled: true,
            reason: 'No dimensions in layout',
        }
    }

    // Rule: Disabled if no program dimensions (only generic or tracked entity dimensions)
    if (!hasProgramDimensions) {
        return {
            disabled: true,
            reason: 'No program dimensions in layout',
        }
    }

    // Rule: Disabled if mixed program types (WITH_REGISTRATION and WITHOUT_REGISTRATION)
    if (hasMixedProgramTypes) {
        return {
            disabled: true,
            reason: 'Cannot combine programs with and without registration',
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
 * @param {string} programType - The program type (WITH_REGISTRATION or WITHOUT_REGISTRATION)
 * @returns {Object} Validation result with disabled/hidden flag and optional reason
 */
export const validateTrackedEntityButton = (
    dimensionAnalysis,
    supportsTrackedEntity,
    programType
) => {
    const { hasDimensions, hasMixedProgramTypes } = dimensionAnalysis

    // Rule: Hidden if program type is WITHOUT_REGISTRATION
    if (programType === 'WITHOUT_REGISTRATION') {
        return {
            disabled: false,
            hidden: true,
        }
    }

    // Rule: Disabled if no dimensions
    if (!hasDimensions) {
        return {
            disabled: true,
            reason: 'No dimensions in layout',
        }
    }

    // Rule: Disabled if mixed program types (WITH_REGISTRATION and WITHOUT_REGISTRATION)
    if (hasMixedProgramTypes) {
        return {
            disabled: true,
            reason: 'Cannot combine programs with and without registration',
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
 * @param {string} programType - The program type (WITH_REGISTRATION or WITHOUT_REGISTRATION)
 * @returns {Object} Validation results for all three buttons
 */
export const validateButtons = (
    layout,
    metadata,
    supportsTrackedEntity,
    programType
) => {
    const dimensionAnalysis = analyzeDimensionsInLayout(layout, metadata)

    return {
        event: validateEventButton(dimensionAnalysis),
        enrollment: validateEnrollmentButton(dimensionAnalysis, programType),
        trackedEntity: validateTrackedEntityButton(
            dimensionAnalysis,
            supportsTrackedEntity,
            programType
        ),
        dimensionAnalysis, // Include for debugging/additional use
    }
}
