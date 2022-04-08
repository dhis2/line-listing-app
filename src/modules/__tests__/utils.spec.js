import { formatDimensionId, extractDimensionIdParts } from '../utils.js'

describe('formatDimensionId', () => {
    it('returns correct result when only dimensionId is used', () => {
        const dimensionId = 'myDimensionId'

        expect(formatDimensionId(dimensionId)).toEqual('myDimensionId')
    })
    it('returns correct result when both programStageId and dimensionId are used', () => {
        const dimensionId = 'myDimensionId'
        const programStageId = 'myProgramStageId'

        expect(formatDimensionId(dimensionId, programStageId)).toEqual(
            'myProgramStageId.myDimensionId'
        )
    })
})

describe('extractDimensionIdParts', () => {
    it('returns correct result when only dimensionId is used', () => {
        const input = 'myDimensionId'

        expect(extractDimensionIdParts(input).dimensionId).toEqual(
            'myDimensionId'
        )
        expect(extractDimensionIdParts(input).programStageId).toBeFalsy()
        expect(extractDimensionIdParts(input).repetitionIndex).toBeUndefined()
    })
    it('returns correct result when both programStageId and dimensionId are used', () => {
        const input = 'myProgramStageId.myDimensionId'

        expect(extractDimensionIdParts(input).dimensionId).toEqual(
            'myDimensionId'
        )
        expect(extractDimensionIdParts(input).programStageId).toEqual(
            'myProgramStageId'
        )
        expect(extractDimensionIdParts(input).repetitionIndex).toBeUndefined()
    })
    it('returns correct result when both programStageId and dimensionId are used with repetitionIndex', () => {
        const input = 'myProgramStageId[3].myDimensionId'

        expect(extractDimensionIdParts(input).dimensionId).toEqual(
            'myDimensionId'
        )
        expect(extractDimensionIdParts(input).programStageId).toEqual(
            'myProgramStageId'
        )
        expect(extractDimensionIdParts(input).repetitionIndex).toEqual('3')
    })
})

describe('formatDimensionId + extractDimensionIdParts', () => {
    it('returns correct result when both programStageId and dimensionId are used', () => {
        const dimensionId = 'myDimensionId'
        const programStageId = 'myProgramStageId'

        expect(
            extractDimensionIdParts(
                formatDimensionId(dimensionId, programStageId)
            ).dimensionId
        ).toEqual(dimensionId)
        expect(
            extractDimensionIdParts(
                formatDimensionId(dimensionId, programStageId)
            ).programStageId
        ).toEqual(programStageId)
    })
})
