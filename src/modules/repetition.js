import { layoutGetAllDimensions } from '@dhis2/analytics'
import { parseCurrentRepetition } from './ui.js'

export const getRepetitionFromVisualisation = (vis) => {
    const repetitionByDimension = {}
    layoutGetAllDimensions(vis)
        .filter((d) => d.repetition)
        .forEach((d) => {
            repetitionByDimension[
                d.programStage?.id
                    ? `${d.programStage.id}.${d.dimension}`
                    : d.dimension
            ] = parseCurrentRepetition(d.repetition.indexes)
        })
    return repetitionByDimension
}
