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

const validateDimension = (dimension, error, requireItems) => {
    if (!(dimension && dimensionIsValid(dimension, { requireItems }))) {
        throw error
    }
}

const validateAxis = (axis, error) => {
    if (!isAxisValid(axis)) {
        throw error
    }
}

const validateLineListLayout = (layout) => {
    validateAxis(layout.columns, noColumnsError())
    validateDimension(
        layoutGetDimension(layout, DIMENSION_ID_ORGUNIT),
        noOrgUnitError(),
        true
    )

    let layoutHasTimeDimension = false

    DIMENSION_IDS_TIME.forEach((dimensionId) => {
        const dimension = layoutGetDimension(layout, dimensionId)

        if (dimension && dimensionIsValid(dimension, { requireItems: true })) {
            layoutHasTimeDimension = true
        }
    })

    if (!layoutHasTimeDimension) {
        throw noPeriodError()
    }

    if (!layout?.program?.id) {
        throw noProgramError()
    }

    if (layout.outputType === OUTPUT_TYPE_EVENT && !layout?.programStage?.id) {
        throw noStageError()
    }
}

export const validateLayout = (layout) => {
    switch (layout.type) {
        case VIS_TYPE_LINE_LIST:
        default:
            return validateLineListLayout(layout)
    }
}

export const layoutHasProgramId = (layout) => {
    if (!layout) {
        return false
    }
    switch (layout.type) {
        case VIS_TYPE_LINE_LIST:
        default:
            return Boolean(layout.program?.id)
    }
}

export const aoCreatedInEventReportsApp = (layout) => layout.legacy
