import { formatDimensionId, extractDimensionIdParts } from '../utils.js'
import {
    OUTPUT_TYPE_TRACKED_ENTITY,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_EVENT,
} from '../visualization.js'

describe('formatDimensionId', () => {
    it('returns correct result for: dimensionId', () => {
        const dimensionId = 'did'

        expect(formatDimensionId({ dimensionId })).toEqual('did')
    })
    it('returns correct result for: programStageId + dimensionId', () => {
        const dimensionId = 'did'
        const programStageId = 'sid'

        expect(formatDimensionId({ dimensionId, programStageId })).toEqual(
            'sid.did'
        )
    })
    it('returns correct result for: programId + programStageId + dimensionId', () => {
        const dimensionId = 'did'
        const programStageId = 'sid'
        const programId = 'pid'

        expect(
            formatDimensionId({ dimensionId, programStageId, programId })
        ).toEqual('sid.did')
    })
    it('returns correct result for Tracked Entity: programId + programStageId + dimensionId', () => {
        const dimensionId = 'did'
        const programStageId = 'sid'
        const programId = 'pid'

        expect(
            formatDimensionId({
                dimensionId,
                programStageId,
                programId,
                outputType: OUTPUT_TYPE_TRACKED_ENTITY,
            })
        ).toEqual('pid.sid.did')
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
    it('returns correct result for: programStageId + dimensionId', () => {
        const id = 'sid.did'
        const output = extractDimensionIdParts(id)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toEqual('sid')
        expect(output.programId).toBeUndefined()
        expect(output.repetitionIndex).toBeUndefined()
    })
    it('returns correct result for: programStageId + dimensionId + repetitionIndex', () => {
        const id = 'sid[3].did'
        const output = extractDimensionIdParts(id)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toEqual('sid')
        expect(output.programId).toBeUndefined()
        expect(output.repetitionIndex).toEqual('3')
    })
    it('returns correct result for Event: programStageId + dimensionId + repetitionIndex', () => {
        const id = 'sid[3].did'
        const inputType = OUTPUT_TYPE_EVENT
        const output = extractDimensionIdParts(id, inputType)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toEqual('sid')
        expect(output.programId).toBeUndefined()
        expect(output.repetitionIndex).toEqual('3')
    })
    it('returns correct result for Enrollment: programStageId + dimensionId + repetitionIndex', () => {
        const id = 'sid[3].did'
        const inputType = OUTPUT_TYPE_ENROLLMENT
        const output = extractDimensionIdParts(id, inputType)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toEqual('sid')
        expect(output.programId).toBeUndefined()
        expect(output.repetitionIndex).toEqual('3')
    })
    it('returns correct result for: programId + programStageId + dimensionId', () => {
        const id = 'pid.sid.did'
        const output = extractDimensionIdParts(id)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toEqual('sid')
        expect(output.programId).toEqual('pid')
        expect(output.repetitionIndex).toBeUndefined()
    })
    it('returns correct result for: programId + programStageId + dimensionId + repetitionIndex', () => {
        const id = 'pid.sid[3].did'
        const output = extractDimensionIdParts(id)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toEqual('sid')
        expect(output.programId).toEqual('pid')
        expect(output.repetitionIndex).toEqual('3')
    })
    it('returns correct result for Tracked Entity: programId + programStageId + dimensionId', () => {
        const id = 'pid.sid.did'
        const inputType = OUTPUT_TYPE_TRACKED_ENTITY
        const output = extractDimensionIdParts(id, inputType)

        expect(output.dimensionId).toEqual('did')
        expect(output.programStageId).toEqual('sid')
        expect(output.programId).toEqual('pid')
        expect(output.repetitionIndex).toBeUndefined()
    })
    it('returns correct result for Tracked Entity: programId + programStageId + dimensionId + repetitionIndex', () => {
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

    it('returns correct result for: programStageId + dimensionId', () => {
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

    it('returns correct result for: programId + programStageId + dimensionId', () => {
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

    it('returns correct result for Tracked Entity: programId + programStageId + dimensionId', () => {
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
                }),
                OUTPUT_TYPE_TRACKED_ENTITY
            )

        expect(dimensionId).toEqual(inputDimensionId)
        expect(programStageId).toEqual(inputProgramStageId)
        expect(programId).toEqual(inputProgramId)
    })
})

describe('extractDimensionIdParts + formatDimensionId', () => {
    it('returns correct result for: dimensionId', () => {
        const inputId = 'did'

        const { dimensionId } = extractDimensionIdParts(inputId)

        const outputId = formatDimensionId({
            dimensionId,
        })

        expect(outputId).toEqual(inputId)
    })

    it('returns correct result for: programStageId + dimensionId', () => {
        const inputId = 'sid.did'

        const { dimensionId, programStageId } = extractDimensionIdParts(inputId)

        const outputId = formatDimensionId({
            dimensionId,
            programStageId,
        })

        expect(outputId).toEqual(inputId)
    })

    it('returns correct result for: programId + programStageId + dimensionId', () => {
        const inputId = 'sid.did'

        const { dimensionId, programStageId, programId } =
            extractDimensionIdParts(inputId)

        const outputId = formatDimensionId({
            dimensionId,
            programStageId,
            programId,
        })

        expect(outputId).toEqual(inputId)
    })

    it('returns correct result for Tracked Entity: programId + programStageId + dimensionId', () => {
        const inputId = 'pid.sid.did'

        const { dimensionId, programStageId, programId } =
            extractDimensionIdParts(inputId, OUTPUT_TYPE_TRACKED_ENTITY)

        const outputId = formatDimensionId({
            dimensionId,
            programStageId,
            programId,
            outputType: OUTPUT_TYPE_TRACKED_ENTITY,
        })

        expect(outputId).toEqual(inputId)
    })
})
