import { createDimensionsQuery } from '../useProgramDimensions.js'

describe('ER > Dimensions > useProgramDimensions > createDimensionsQuery', () => {
    describe('input type event', () => {
        it('returns the correct resource', () => {
            const actual = createDimensionsQuery({
                inputType: 'EVENT',
                programId: '',
                stageId: '',
                searchTerm: '',
                dimensionType: '',
            })
            expect(actual.resource).toBe('analytics/events/query/dimensions')
        })
        it('does not produce a programId param', () => {
            const actual = createDimensionsQuery({
                inputType: 'EVENT',
                programId: 'myProgramId',
                stageId: '',
                searchTerm: '',
                dimensionType: '',
            })
            expect(actual.params.programId).toBe(undefined)
        })
        it('does produce a programStageId param', () => {
            const actual = createDimensionsQuery({
                inputType: 'EVENT',
                programId: '',
                stageId: 'myStageId',
                searchTerm: '',
                dimensionType: '',
            })
            expect(actual.params.programStageId).toBe('myStageId')
        })
    })
    describe('input type enrollment', () => {
        it('returns the correct resource', () => {
            const actual = createDimensionsQuery({
                inputType: 'ENROLLMENT',
                programId: '',
                stageId: '',
                searchTerm: '',
                dimensionType: '',
            })
            expect(actual.resource).toBe(
                'analytics/enrollments/query/dimensions'
            )
        })
        it('does produce a programId param', () => {
            const actual = createDimensionsQuery({
                inputType: 'ENROLLMENT',
                programId: 'myProgramId',
                stageId: '',
                searchTerm: '',
                dimensionType: '',
            })
            expect(actual.params.programId).toBe('myProgramId')
        })
        it('does not produce a programStageId param', () => {
            const actual = createDimensionsQuery({
                inputType: 'ENROLLMENT',
                programId: '',
                stageId: 'myStageId',
                searchTerm: '',
                dimensionType: '',
            })
            expect(actual.params.programStageId).toBe(undefined)
        })
        it('adds a filter for programStageId when specified and dimensionType is data element', () => {
            const actual = createDimensionsQuery({
                inputType: 'ENROLLMENT',
                programId: '',
                stageId: 'myStageId',
                searchTerm: '',
                dimensionType: 'DATA_ELEMENT',
            })
            expect(actual.params.filter).toContain('id:startsWith:myStageId')
        })
    })
    describe('params for both input types', () => {
        it('adds a searchTerm filter', () => {
            const actual = createDimensionsQuery({
                inputType: 'ENROLLMENT',
                programId: '',
                stageId: 'myStageId',
                searchTerm: 'mySearchTerm',
                dimensionType: 'DATA_ELEMENT',
                nameProp: 'myNameProp',
            })
            expect(actual.params.filter).toContain(
                'myNameProp:ilike:mySearchTerm'
            )
        })
        it('adds a dimensionType filter', () => {
            const actual = createDimensionsQuery({
                inputType: 'ENROLLMENT',
                programId: '',
                stageId: 'myStageId',
                searchTerm: 'mySearchTerm',
                dimensionType: 'DATA_ELEMENT',
            })
            expect(actual.params.filter).toContain(
                'dimensionType:eq:DATA_ELEMENT'
            )
        })
        it('does not add a dimension filter when dimensionType is ALL', () => {
            const actual = createDimensionsQuery({
                inputType: 'ENROLLMENT',
                programId: '',
                stageId: 'myStageId',
                searchTerm: 'mySearchTerm',
                dimensionType: 'ALL',
            })
            expect(actual.params.filter).not.toContain('dimensionType:eq:ALL')
        })
    })
})
