import { getDynamicTimeDimensionsMetadata } from '../metadata.js'

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
