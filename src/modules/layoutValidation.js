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

export const validateLineListLayout = (layout, { doNotThrow } = {}) => {
    if (!layout) {
        return false
    }

    if (!isAxisValid(layout.columns)) {
        if (doNotThrow) {
            return false
        }
        throw noColumnsError()
    }

    const ouDimension = layoutGetDimension(layout, DIMENSION_ID_ORGUNIT)
    if (
        !(ouDimension && dimensionIsValid(ouDimension, { requireItems: true }))
    ) {
        if (doNotThrow) {
            return false
        }
        throw noOrgUnitError()
    }

    let layoutHasTimeDimension = false

    DIMENSION_IDS_TIME.forEach((dimensionId) => {
        const dimension = layoutGetDimension(layout, dimensionId)

        if (dimension && dimensionIsValid(dimension, { requireItems: true })) {
            layoutHasTimeDimension = true
        }
    })

    if (!layoutHasTimeDimension) {
        if (doNotThrow) {
            return false
        }
        throw noPeriodError()
    }

    if (!layoutHasProgramId(layout)) {
        if (doNotThrow) {
            return false
        }
        throw noProgramError()
    }

    if (layout.outputType === OUTPUT_TYPE_EVENT && !layout?.programStage?.id) {
        if (doNotThrow) {
            return false
        }
        throw noStageError()
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
