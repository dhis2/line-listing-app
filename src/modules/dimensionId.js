import { OUTPUT_TYPE_TRACKED_ENTITY } from './visualization.js'

export const formatDimensionId = ({
    dimensionId,
    programStageId,
    programId,
    outputType,
}) => {
    return [
        outputType === OUTPUT_TYPE_TRACKED_ENTITY ? programId : undefined,
        programStageId,
        dimensionId,
    ]
        .filter((p) => p)
        .join('.')
}

export const extractDimensionIdParts = (id, inputType) => {
    let rawStageId
    const [dimensionId, part2, part3] = id.split('.').reverse()
    let programId = part3
    if (part3 || inputType !== OUTPUT_TYPE_TRACKED_ENTITY) {
        rawStageId = part2
    }
    if (inputType === OUTPUT_TYPE_TRACKED_ENTITY && !part3) {
        programId = part2
    }
    const [programStageId, repetitionIndex] = (rawStageId || '').split('[')
    return {
        dimensionId,
        programStageId,
        ...(programId ? { programId } : {}),
        repetitionIndex:
            repetitionIndex?.length &&
            repetitionIndex.substring(0, repetitionIndex.indexOf(']')),
    }
}
