import { layoutGetAllDimensions } from '@dhis2/analytics'
import { parseCurrentRepetition } from './ui.js'
import { formatDimensionId } from './utils.js'

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
