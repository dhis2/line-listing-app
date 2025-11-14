import {
    AXIS,
    dimensionIsValid,
    layoutGetDimension,
    VIS_TYPE_LINE_LIST,
    DIMENSION_ID_ORGUNIT,
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
} from '@dhis2/analytics'
import {
    noColumnsError,
    noEntityTypeError,
    noOrgUnitError,
    noProgramError,
} from './error.js'
import {
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_EVENT_DATE,
} from './dimensionConstants.js'
import {
    OUTPUT_TYPE_TRACKED_ENTITY,
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
} from './visualization.js'
import { extractDimensionIdParts } from './dimensionId.js'

// Layout validation helper functions
const isAxisValid = (axis) =>
    AXIS.isValid(axis) &&
    axis.some((axisItem) =>
        dimensionIsValid(axisItem, {
            requireItems: false,
        })
    )

export const validateLineListLayout = (layout, { dryRun } = {}) => {
    if (!layout) {
        return false
    }

    // entity type (input type TE only)
    if (
        layout.outputType === OUTPUT_TYPE_TRACKED_ENTITY &&
        !layoutHasTrackedEntityTypeId(layout)
    ) {
        if (dryRun) {
            return false
        }
        throw noEntityTypeError()
    }

    // program
    if (
        layout.outputType !== OUTPUT_TYPE_TRACKED_ENTITY &&
        !layoutHasProgramId(layout)
    ) {
        if (dryRun) {
            return false
        }
        throw noProgramError()
    }

    // columns
    if (!isAxisValid(layout.columns)) {
        if (dryRun) {
            return false
        }
        throw noColumnsError()
    }

    // organisation unit
    const ouDimension = layoutGetDimension(layout, DIMENSION_ID_ORGUNIT)
    if (
        layout.outputType !== OUTPUT_TYPE_TRACKED_ENTITY &&
        !(ouDimension && dimensionIsValid(ouDimension, { requireItems: true }))
    ) {
        if (dryRun) {
            return false
        }
        throw noOrgUnitError()
    }

    return true
}

export const validateLayout = (layout) => {
    switch (layout.type) {
        case VIS_TYPE_LINE_LIST:
        default:
            return validateLineListLayout(layout)
    }
}

export const layoutHasProgramId = (layout) => Boolean(layout?.program?.id)

export const layoutHasTrackedEntityTypeId = (layout) =>
    Boolean(layout?.trackedEntityType?.id)

export const aoCreatedInEventReportsApp = (layout) => layout?.legacy

export const isLayoutValidForSave = (layout) =>
    layout?.outputType === OUTPUT_TYPE_TRACKED_ENTITY
        ? layoutHasTrackedEntityTypeId(layout)
        : layoutHasProgramId(layout) && !aoCreatedInEventReportsApp(layout)

export const isLayoutValidForSaveAs = (layout) =>
    layout?.outputType === OUTPUT_TYPE_TRACKED_ENTITY
        ? layoutHasTrackedEntityTypeId(layout)
        : layoutHasProgramId(layout)

// Dimension-level validation (visual indicators, non-blocking)
// NOTE: These validation rules are currently DISABLED (see getInvalidDimensions function below)
// They were used to mark chips as invalid, but now only button validation is active

/**
 * Validation rule: When output is EVENT, data items from multiple stages are invalid.
 * Only the first stage present should be considered valid.
 */
const validateMultipleStagesInEventOutput = (layout, outputType, metadata) => {
    const invalidDimensionIds = new Set()

    // Only apply this rule when output type is EVENT
    if (outputType !== OUTPUT_TYPE_EVENT) {
        return invalidDimensionIds
    }

    // Get all dimensions from layout (columns first, then filters)
    const allDimensionIds = [
        ...(layout.columns || []),
        ...(layout.filters || []),
    ]

    // Find the first stage present in the layout
    let firstStageId = null
    for (const dimensionId of allDimensionIds) {
        const dimension = metadata[dimensionId]
        if (!dimension) continue

        const dimensionType = dimension.dimensionType

        // Only consider data elements and program indicators
        if (
            dimensionType === DIMENSION_TYPE_DATA_ELEMENT ||
            dimensionType === DIMENSION_TYPE_PROGRAM_INDICATOR
        ) {
            const { programStageId } = extractDimensionIdParts(
                dimensionId,
                outputType
            )

            // If this dimension has a stage, use it as the first stage
            if (programStageId) {
                firstStageId = programStageId
                break
            }
        }
    }

    // If no stage was found, no dimensions are invalid
    if (!firstStageId) {
        return invalidDimensionIds
    }

    // Mark all data elements/program indicators from other stages as invalid
    for (const dimensionId of allDimensionIds) {
        const dimension = metadata[dimensionId]
        if (!dimension) continue

        const dimensionType = dimension.dimensionType

        // Only validate data elements and program indicators
        if (
            dimensionType === DIMENSION_TYPE_DATA_ELEMENT ||
            dimensionType === DIMENSION_TYPE_PROGRAM_INDICATOR
        ) {
            const { programStageId } = extractDimensionIdParts(
                dimensionId,
                outputType
            )

            // If this dimension has a different stage, mark as invalid
            if (programStageId && programStageId !== firstStageId) {
                invalidDimensionIds.add(dimensionId)
            }
        }
    }

    return invalidDimensionIds
}

/**
 * Validation rule: When output is ENROLLMENT, Event Status, Scheduled date, and Event date are not valid.
 */
const validateInvalidDimensionsInEnrollmentOutput = (
    layout,
    outputType,
    metadata
) => {
    const invalidDimensionIds = new Set()

    // Only apply this rule when output type is ENROLLMENT
    if (outputType !== OUTPUT_TYPE_ENROLLMENT) {
        return invalidDimensionIds
    }

    // Dimensions that are not valid for ENROLLMENT output
    const invalidDimensionsForEnrollment = [
        DIMENSION_ID_EVENT_STATUS,
        DIMENSION_ID_SCHEDULED_DATE,
        DIMENSION_ID_EVENT_DATE,
    ]

    // Get all dimensions from layout (columns and filters)
    const allDimensionIds = [
        ...(layout.columns || []),
        ...(layout.filters || []),
    ]

    // Mark invalid dimensions
    for (const dimensionId of allDimensionIds) {
        const { dimensionId: baseDimensionId } = extractDimensionIdParts(
            dimensionId,
            outputType
        )

        if (invalidDimensionsForEnrollment.includes(baseDimensionId)) {
            invalidDimensionIds.add(dimensionId)
        }
    }

    return invalidDimensionIds
}

/**
 * Registry of validation rules
 * Each rule is a function that takes (layout, outputType, metadata) and returns Set of invalid dimension IDs
 */
const validationRules = [
    validateMultipleStagesInEventOutput,
    validateInvalidDimensionsInEnrollmentOutput,
]

/**
 * Get all invalid dimension IDs based on current layout, output type, and metadata
 * @param {Object} layout - Current layout object with columns and filters
 * @param {string} outputType - Current output type (EVENT, ENROLLMENT, TRACKED_ENTITY)
 * @param {Object} metadata - Metadata object containing dimension information
 * @returns {Set<string>} Set of invalid dimension IDs
 */
export const getInvalidDimensions = (layout, outputType, metadata) => {
    const invalidDimensionIds = new Set()

    // COMMENTED OUT: Chip validation disabled in favor of button validation only
    // Run all validation rules and collect invalid dimensions
    // for (const rule of validationRules) {
    //     const ruleInvalidIds = rule(layout, outputType, metadata)
    //     for (const id of ruleInvalidIds) {
    //         invalidDimensionIds.add(id)
    //     }
    // }

    return invalidDimensionIds
}
