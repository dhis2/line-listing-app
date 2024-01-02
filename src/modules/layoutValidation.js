import {
    AXIS,
    dimensionIsValid,
    layoutGetDimension,
    VIS_TYPE_LINE_LIST,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'
import {
    noColumnsError,
    noEntityTypeError,
    noOrgUnitError,
    noProgramError,
} from './error.js'
import { OUTPUT_TYPE_TRACKED_ENTITY } from './visualization.js'

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
    Boolean(layout?.entityType?.id)

export const aoCreatedInEventReportsApp = (layout) => layout?.legacy

export const isLayoutValidForSave = (layout) =>
    layout?.outputType === OUTPUT_TYPE_TRACKED_ENTITY
        ? layoutHasTrackedEntityTypeId(layout)
        : layoutHasProgramId(layout) && !aoCreatedInEventReportsApp(layout)

export const isLayoutValidForSaveAs = (layout) =>
    layout?.outputType === OUTPUT_TYPE_TRACKED_ENTITY
        ? layoutHasTrackedEntityTypeId(layout)
        : layoutHasProgramId(layout)
