import {
    AXIS,
    dimensionIsValid,
    layoutGetDimension,
    VIS_TYPE_LINE_LIST,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'
import { DIMENSION_IDS_TIME } from './dimensionConstants.js'
import {
    noColumnsError,
    noOrgUnitError,
    noPeriodError,
    noProgramError,
    noStageError,
} from './error.js'
import { OUTPUT_TYPE_EVENT } from './visualization.js'

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

    // program
    if (!layoutHasProgramId(layout)) {
        if (dryRun) {
            return false
        }
        throw noProgramError()
    }

    // stage
    if (layout.outputType === OUTPUT_TYPE_EVENT && !layout?.programStage?.id) {
        if (dryRun) {
            return false
        }
        throw noStageError()
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
        !(ouDimension && dimensionIsValid(ouDimension, { requireItems: true }))
    ) {
        if (dryRun) {
            return false
        }
        throw noOrgUnitError()
    }

    // time dimension
    let layoutHasTimeDimension = false

    DIMENSION_IDS_TIME.forEach((dimensionId) => {
        const dimension = layoutGetDimension(layout, dimensionId)

        if (dimension && dimensionIsValid(dimension, { requireItems: true })) {
            layoutHasTimeDimension = true
        }
    })

    if (!layoutHasTimeDimension) {
        if (dryRun) {
            return false
        }
        throw noPeriodError()
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

export const aoCreatedInEventReportsApp = (layout) => layout.legacy

export const isLayoutValidForSaving = (layout) =>
    layoutHasProgramId(layout) && !aoCreatedInEventReportsApp(layout)
