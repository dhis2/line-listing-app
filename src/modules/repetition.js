import { layoutGetAllDimensions } from '@dhis2/analytics'
import isObject from 'lodash-es/isObject'
import { formatDimensionId } from './dimensionId.js'

const PARSE_CURRENT_REPETITION_ERROR = 'parseCurrentRepetition: Invalid input'

export const PROP_MOST_RECENT = 'mostRecent'
export const PROP_OLDEST = 'oldest'

export const getDefaultCurrentRepetition = () => []
export const getDefaultUiRepetition = () => ({
    [PROP_MOST_RECENT]: 1,
    [PROP_OLDEST]: 0,
})

export const getRepetitionFromVisualisation = (vis) => {
    const repetitionByDimension = {}
    layoutGetAllDimensions(vis)
        .filter((d) => d.repetition)
        .forEach((d) => {
            repetitionByDimension[
                formatDimensionId({
                    dimensionId: d.dimension,
                    programStageId: d.programStage?.id,
                    programId: d.program?.id,
                    outputType: vis.outputType,
                })
            ] = parseCurrentRepetition(d.repetition.indexes)
        })
    return repetitionByDimension
}

export const parseCurrentRepetition = (repetition) => {
    if (
        !(
            Array.isArray(repetition) &&
            repetition.every((i) => Number.isFinite(i))
        )
    ) {
        throw new Error(PARSE_CURRENT_REPETITION_ERROR)
    }

    return repetition.length
        ? {
              [PROP_MOST_RECENT]: repetition.filter((n) => n < 1).length,
              [PROP_OLDEST]: repetition.filter((n) => n > 0).length,
          }
        : getDefaultUiRepetition()
}

export const PARSE_UI_REPETITION_ERROR = 'parseUiRepetition: Invalid input'

export const parseUiRepetition = (repetition) => {
    if (
        !(
            isObject(repetition) &&
            Number.isFinite(repetition[PROP_MOST_RECENT]) &&
            repetition[PROP_MOST_RECENT] >= 0 &&
            Number.isFinite(repetition[PROP_OLDEST]) &&
            repetition[PROP_OLDEST] >= 0
        )
    ) {
        throw new Error(PARSE_UI_REPETITION_ERROR)
    }

    // default
    if (
        repetition[PROP_OLDEST] === 0 &&
        [0, 1].includes(repetition[PROP_MOST_RECENT])
    ) {
        return getDefaultCurrentRepetition()
    }

    return [
        ...new Array(repetition[PROP_OLDEST]).fill().map((_, i) => i + 1),
        ...new Array(repetition[PROP_MOST_RECENT])
            .fill()
            .map((_, i) => -i + 0)
            .sort((a, b) => a - b),
    ]
}
