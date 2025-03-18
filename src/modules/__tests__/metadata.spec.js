import {
    DIMENSION_ID_ORGUNIT,
    USER_ORG_UNIT,
    USER_ORG_UNIT_CHILDREN,
    USER_ORG_UNIT_GRANDCHILDREN,
} from '@dhis2/analytics'
import {
    getDynamicTimeDimensionsMetadata,
    isPopulatedObject,
    transformMetaDataResponseObject,
} from '../metadata.js'

describe('getDynamicTimeDimensionsMetadata', () => {
    it('should return correct dynamic time dimensions metadata when inputType is OUTPUT_TYPE_TRACKED_ENTITY', () => {
        const program = {
            id: 'programId',
            displayEnrollmentDateLabel: 'Custom Enrollment Date',
            displayIncidentDateLabel: 'Custom Incident Date',
        }
        const stage = { displayExecutionDateLabel: 'Stage Execution Date' }
        const inputType = 'TRACKED_ENTITY_INSTANCE' // OUTPUT_TYPE_TRACKED_ENTITY

        const result = getDynamicTimeDimensionsMetadata(
            program,
            stage,
            inputType
        )

        const expected = {
            'programId.eventDate': {
                id: 'programId.eventDate',
                dimensionType: 'PERIOD',
                name: 'Stage Execution Date',
            },
            'programId.enrollmentDate': {
                id: 'programId.enrollmentDate',
                dimensionType: 'PERIOD',
                name: 'Custom Enrollment Date',
            },
            'programId.incidentDate': {
                id: 'programId.incidentDate',
                dimensionType: 'PERIOD',
                name: 'Custom Incident Date',
            },
            'programId.scheduledDate': {
                id: 'programId.scheduledDate',
                dimensionType: 'PERIOD',
                name: 'Scheduled date',
            },
        }

        expect(result).toEqual(expected)
    })

    it('should return correct dynamic time dimensions metadata when inputType is not OUTPUT_TYPE_TRACKED_ENTITY', () => {
        const program = {
            id: 'programId',
            displayEnrollmentDateLabel: 'Program Enrollment Date',
            displayIncidentDateLabel: 'Custom Incident Date',
        }
        const stage = { displayExecutionDateLabel: 'Stage Execution Date' }
        const inputType = 'OTHER_TYPE'

        const result = getDynamicTimeDimensionsMetadata(
            program,
            stage,
            inputType
        )

        const expected = {
            eventDate: {
                id: 'eventDate',
                dimensionType: 'PERIOD',
                name: 'Stage Execution Date',
            },
            enrollmentDate: {
                id: 'enrollmentDate',
                dimensionType: 'PERIOD',
                name: 'Program Enrollment Date',
            },
            incidentDate: {
                id: 'incidentDate',
                dimensionType: 'PERIOD',
                name: 'Custom Incident Date',
            },
            scheduledDate: {
                id: 'scheduledDate',
                dimensionType: 'PERIOD',
                name: 'Scheduled date',
            },
        }

        expect(result).toEqual(expected)
    })
})

describe('isPopulatedObject', () => {
    it('returns true for a populated object', () => {
        expect(isPopulatedObject({ a: 'a' })).toBe(true)
    })
    it.each([
        ['undefined', undefined],
        ['null', null],
        ['an empty string', ''],
        ['a number', 612],
        ['the number zero', 0],
        ['a populated string', 'string'],
        ['a date instance', new Date()],
        ['an empty array', []],
        ['a populated array', [1, 2, '3']],
        ['an empty object', {}],
    ])('returns false for %s', ({ input }) => {
        expect(isPopulatedObject(input)).toBe(false)
    })
})

describe('transformMetaDataResponseObject', () => {
    it('ignores particular object keys', () => {
        expect(
            transformMetaDataResponseObject({
                [USER_ORG_UNIT]: USER_ORG_UNIT,
                [USER_ORG_UNIT_CHILDREN]: USER_ORG_UNIT_CHILDREN,
                [USER_ORG_UNIT_GRANDCHILDREN]: USER_ORG_UNIT_GRANDCHILDREN,
                [DIMENSION_ID_ORGUNIT]: DIMENSION_ID_ORGUNIT,
            })
        ).toEqual({})
    })
    it('transforms the provided object as expected', () => {
        expect(
            transformMetaDataResponseObject({
                theUid: {
                    uid: 'theUid',
                    code: 'theCode',
                    name: 'theName',
                    displayName: 'theDisplayName',
                    dimensionType: 'theDimensionType',
                    dimensionItemType: 'theDimensionItemType',
                },
            })
        ).toEqual({
            theUid: {
                code: 'theCode',
                dimensionType: 'theDimensionType',
                displayName: 'theDisplayName',
                id: 'theUid',
                name: 'theName',
            },
        })
    })
    it('uses fallback values for name and dimensionType', () => {
        expect(
            transformMetaDataResponseObject({
                theUid: {
                    uid: 'theUid',
                    code: 'theCode',
                    displayName: 'theDisplayName',
                    dimensionItemType: 'theDimensionItemType',
                },
            })
        ).toEqual({
            theUid: {
                code: 'theCode',
                dimensionType: 'theDimensionItemType',
                displayName: 'theDisplayName',
                id: 'theUid',
                name: 'theDisplayName',
            },
        })
    })
    it('transforms an object as returned from the analytics endpoint as expected', () => {
        expect(
            transformMetaDataResponseObject({
                yu4N82FFeLm: {
                    uid: 'yu4N82FFeLm',
                    code: 'OU_204910',
                    name: 'Mandu',
                },
                KXSqt7jv6DU: {
                    uid: 'KXSqt7jv6DU',
                    code: 'OU_222627',
                    name: 'Gorama Mende',
                },
            })
        ).toEqual({
            KXSqt7jv6DU: {
                code: 'OU_222627',
                dimensionType: undefined,
                displayName: undefined,
                id: 'KXSqt7jv6DU',
                name: 'Gorama Mende',
            },
            yu4N82FFeLm: {
                code: 'OU_204910',
                dimensionType: undefined,
                displayName: undefined,
                id: 'yu4N82FFeLm',
                name: 'Mandu',
            },
        })
    })
})
