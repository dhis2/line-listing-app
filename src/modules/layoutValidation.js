import {
    AXIS,
    dimensionIsValid,
    layoutGetDimension,
    VIS_TYPE_LINE,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'
import { NoColumnsError, NoOrgUnitError, NoProgramError } from './error.js'

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
    validateAxis(layout.columns, new NoColumnsError(layout.type))
    validateDimension(
        layoutGetDimension(layout, DIMENSION_ID_ORGUNIT),
        new NoOrgUnitError(layout.type),
        true
    )
    // let layoutHasTimeDimension = false
    // DIMENSION_TYPES_TIME.forEach((dimension) => {
    //     if (layoutHasDimension(layout, dimension)) {
    //         validateDimension(dimension, new NoPeriodError(), true)
    //         layoutHasTimeDimension = true
    //     }
    // })

    // if (!layoutHasTimeDimension) {
    //     throw new NoPeriodError()
    // }

    if (!layout?.program?.id) {
        throw new NoProgramError()
    }
}

export const validateLayout = (layout) => {
    switch (layout.type) {
        case VIS_TYPE_LINE:
        default:
            return validateLineListLayout(layout)
    }
}
