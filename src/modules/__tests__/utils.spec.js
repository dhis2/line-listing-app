import { formatDimensionId, extractDimensionIdParts } from '../utils.js'
import {
    OUTPUT_TYPE_TRACKED_ENTITY,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_EVENT,
} from '../visualization.js'

describe('formatDimensionId', () => {
    it('returns correct result when only dimensionId is used', () => {
        const dimensionId = 'did'

        expect(formatDimensionId({ dimensionId })).toEqual('did')
    })
    it('returns correct result when both programStageId and dimensionId are used', () => {
        const dimensionId = 'did'
        const programStageId = 'sid'

        expect(formatDimensionId({ dimensionId, programStageId })).toEqual(
            'sid.did'
        )
    })
})

describe('extractDimensionIdParts', () => {
    it('returns correct result for: dimensionId', () => {
        const id = 'did'
        const output = extractDimensionIdParts(id)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toBeFalsy()
        expect(output.programId).toBeUndefined()
        expect(output.repetitionIndex).toBeUndefined()
    })
    it('returns correct result for: stageId + dimensionId', () => {
        const id = 'sid.did'
        const output = extractDimensionIdParts(id)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toEqual('sid')
        expect(output.programId).toBeUndefined()
        expect(output.repetitionIndex).toBeUndefined()
    })
    it('returns correct result for: stageId + dimensionId + repetitionIndex', () => {
        const id = 'sid[3].did'
        const output = extractDimensionIdParts(id)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toEqual('sid')
        expect(output.programId).toBeUndefined()
        expect(output.repetitionIndex).toEqual('3')
    })
    it('returns correct result for Event: stageId + dimensionId + repetitionIndex', () => {
        const id = 'sid[3].did'
        const inputType = OUTPUT_TYPE_EVENT
        const output = extractDimensionIdParts(id, inputType)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toEqual('sid')
        expect(output.programId).toBeUndefined()
        expect(output.repetitionIndex).toEqual('3')
    })
    it('returns correct result for Enrollment: stageId + dimensionId + repetitionIndex', () => {
        const id = 'sid[3].did'
        const inputType = OUTPUT_TYPE_ENROLLMENT
        const output = extractDimensionIdParts(id, inputType)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toEqual('sid')
        expect(output.programId).toBeUndefined()
        expect(output.repetitionIndex).toEqual('3')
    })
    it('returns correct result for: programId + stageId + dimensionId', () => {
        const id = 'pid.sid.did'
        const output = extractDimensionIdParts(id)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toEqual('sid')
        expect(output.programId).toEqual('pid')
        expect(output.repetitionIndex).toBeUndefined()
    })
    it('returns correct result for: programId + stageId + dimensionId + repetitionIndex', () => {
        const id = 'pid.sid[3].did'
        const output = extractDimensionIdParts(id)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toEqual('sid')
        expect(output.programId).toEqual('pid')
        expect(output.repetitionIndex).toEqual('3')
    })
    it('returns correct result for Tracked Entity: programId + stageId + dimensionId', () => {
        const id = 'pid.sid.did'
        const inputType = OUTPUT_TYPE_TRACKED_ENTITY
        const output = extractDimensionIdParts(id, inputType)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toEqual('sid')
        expect(output.programId).toEqual('pid')
        expect(output.repetitionIndex).toBeUndefined()
    })
    it('returns correct result for Tracked Entity: programId + stageId + dimensionId + repetitionIndex', () => {
        const id = 'pid.sid[3].did'
        const inputType = OUTPUT_TYPE_TRACKED_ENTITY
        const output = extractDimensionIdParts(id, inputType)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toEqual('sid')
        expect(output.programId).toEqual('pid')
        expect(output.repetitionIndex).toEqual('3')
    })
    it('returns correct result for Tracked Entity: programId + dimensionId', () => {
        const id = 'pid.did'
        const inputType = OUTPUT_TYPE_TRACKED_ENTITY
        const output = extractDimensionIdParts(id, inputType)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toBeFalsy()
        expect(output.programId).toEqual('pid')
        expect(output.repetitionIndex).toBeUndefined()
    })
    it('returns correct result for Tracked Entity: dimensionId', () => {
        const id = 'did'
        const inputType = OUTPUT_TYPE_TRACKED_ENTITY
        const output = extractDimensionIdParts(id, inputType)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toBeFalsy()
        expect(output.programId).toBeUndefined()
        expect(output.repetitionIndex).toBeUndefined()
    })
})

describe('formatDimensionId + extractDimensionIdParts', () => {
    it('returns correct result for: dimensionId', () => {
        const inputDimensionId = 'did'

        const { dimensionId, programStageId, programId } =
            extractDimensionIdParts(
                formatDimensionId({
                    dimensionId: inputDimensionId,
                })
            )

        expect(dimensionId).toEqual(inputDimensionId)
        expect(programStageId).toBeFalsy()
        expect(programId).toBeUndefined()
    })

    it('returns correct result for: stageId + dimensionId', () => {
        const inputDimensionId = 'did'
        const inputProgramStageId = 'sid'

        const { dimensionId, programStageId, programId } =
            extractDimensionIdParts(
                formatDimensionId({
                    dimensionId: inputDimensionId,
                    programStageId: inputProgramStageId,
                })
            )

        expect(dimensionId).toEqual(inputDimensionId)
        expect(programStageId).toEqual(inputProgramStageId)
        expect(programId).toBeUndefined()
    })

    it('returns correct result for: programId + stageId + dimensionId', () => {
        const inputDimensionId = 'did'
        const inputProgramStageId = 'sid'
        const inputProgramId = 'pid'

        const { dimensionId, programStageId, programId } =
            extractDimensionIdParts(
                formatDimensionId({
                    dimensionId: inputDimensionId,
                    programStageId: inputProgramStageId,
                    programId: inputProgramId,
                })
            )

        expect(dimensionId).toEqual(inputDimensionId)
        expect(programStageId).toEqual(inputProgramStageId)
        expect(programId).toBeUndefined()
    })

    it('returns correct result for Tracked Entity: programId + stageId + dimensionId', () => {
        const inputDimensionId = 'did'
        const inputProgramStageId = 'sid'
        const inputProgramId = 'pid'

        const { dimensionId, programStageId, programId } =
            extractDimensionIdParts(
                formatDimensionId({
                    dimensionId: inputDimensionId,
                    programStageId: inputProgramStageId,
                    programId: inputProgramId,
                    outputType: OUTPUT_TYPE_TRACKED_ENTITY,
                })
            )

        expect(dimensionId).toEqual(inputDimensionId)
        expect(programStageId).toEqual(inputProgramStageId)
        expect(programId).toEqual(inputProgramId)
    })
})
