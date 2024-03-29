import {
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
} from '../dimensionConstants.js'
import {
    PROGRAM_TYPE_WITH_REGISTRATION,
    PROGRAM_TYPE_WITHOUT_REGISTRATION,
} from '../programTypes.js'
import {
    getTimeDimensionName,
    getHiddenTimeDimensions,
    getTimeDimensions,
} from '../timeDimensions.js'
import { OUTPUT_TYPE_ENROLLMENT, OUTPUT_TYPE_EVENT } from '../visualization.js'

describe('ER > Dimensions > getTimeDimensionName', () => {
    const timeDimensions = getTimeDimensions()
    const eventDateDimension = timeDimensions[DIMENSION_ID_EVENT_DATE]
    const enrollmentDateDimension = timeDimensions[DIMENSION_ID_ENROLLMENT_DATE]
    const incidentDateDimension = timeDimensions[DIMENSION_ID_INCIDENT_DATE]
    const scheduledDateDimension = timeDimensions[DIMENSION_ID_SCHEDULED_DATE]

    it('uses default names normally', () => {
        const program = {
            programType: 'WITHOUT_REGISTRATION',
            programStages: [
                {
                    id: 'stage1Id',
                },
            ],
        }
        const stage = {
            id: 'stage1Id',
        }
        Object.values(getTimeDimensions()).forEach((dimension) => {
            expect(getTimeDimensionName(dimension, program, stage)).toEqual(
                dimension.name
            )
        })
    })
    it('uses displayExecutionDateLabel from stage for event date', () => {
        const program = {
            programType: 'WITHOUT_REGISTRATION',
            programStages: [
                {
                    id: 'stage1Id',
                },
            ],
        }
        const stage = {
            displayExecutionDateLabel: 'le event date',
            id: 'stage1Id',
            name: 'The Only Stage',
        }

        expect(
            getTimeDimensionName(eventDateDimension, program, stage)
        ).toEqual(stage.displayExecutionDateLabel)
        expect(
            getTimeDimensionName(enrollmentDateDimension, program, stage)
        ).toEqual(enrollmentDateDimension.name)
        expect(
            getTimeDimensionName(incidentDateDimension, program, stage)
        ).toEqual(incidentDateDimension.name)
        expect(
            getTimeDimensionName(scheduledDateDimension, program, stage)
        ).toEqual(scheduledDateDimension.name)
    })
    it('uses displayEnrollmentDateLabel from program for enrollment date', () => {
        const program = {
            programType: 'WITHOUT_REGISTRATION',
            displayEnrollmentDateLabel: 'le enrollment date',
            programStages: [
                {
                    id: 'stage1Id',
                },
            ],
        }
        const stage = {
            id: 'stage1Id',
            name: 'The Only Stage',
        }

        expect(
            getTimeDimensionName(eventDateDimension, program, stage)
        ).toEqual(eventDateDimension.name)
        expect(
            getTimeDimensionName(enrollmentDateDimension, program, stage)
        ).toEqual(program.displayEnrollmentDateLabel)
        expect(
            getTimeDimensionName(incidentDateDimension, program, stage)
        ).toEqual(incidentDateDimension.name)
        expect(
            getTimeDimensionName(scheduledDateDimension, program, stage)
        ).toEqual(scheduledDateDimension.name)
    })
    it('uses displayDueDateLabel from stage for scheduled date', () => {
        const program = {
            programType: 'WITHOUT_REGISTRATION',
            programStages: [
                {
                    id: 'stage1Id',
                },
            ],
        }
        const stage = {
            id: 'stage1Id',
            name: 'The Only Stage',
            displayDueDateLabel: 'le due date',
        }

        expect(
            getTimeDimensionName(eventDateDimension, program, stage)
        ).toEqual(eventDateDimension.name)
        expect(
            getTimeDimensionName(enrollmentDateDimension, program, stage)
        ).toEqual(enrollmentDateDimension.name)
        expect(
            getTimeDimensionName(incidentDateDimension, program, stage)
        ).toEqual(incidentDateDimension.name)
        expect(
            getTimeDimensionName(scheduledDateDimension, program, stage)
        ).toEqual(stage.displayDueDateLabel)
    })
    it('uses displayIncidentDateLabel from program for incident date', () => {
        const program = {
            programType: 'WITHOUT_REGISTRATION',
            displayIncidentDateLabel: 'le incident date',
            programStages: [
                {
                    id: 'stage1Id',
                },
            ],
        }
        const stage = {
            id: 'stage1Id',
            name: 'The Only Stage',
        }

        expect(
            getTimeDimensionName(eventDateDimension, program, stage)
        ).toEqual(eventDateDimension.name)
        expect(
            getTimeDimensionName(enrollmentDateDimension, program, stage)
        ).toEqual(enrollmentDateDimension.name)
        expect(
            getTimeDimensionName(incidentDateDimension, program, stage)
        ).toEqual(program.displayIncidentDateLabel)
        expect(
            getTimeDimensionName(scheduledDateDimension, program, stage)
        ).toEqual(scheduledDateDimension.name)
    })
})

describe('ER > Dimensions > getHiddenTimeDimensions', () => {
    test.each([
        // Nothing populated
        {
            inputType: undefined,
            program: {
                programType: undefined,
                displayIncidentDate: undefined,
            },
            stage: {
                id: '1',
            },
            expected: [
                DIMENSION_ID_EVENT_DATE,
                DIMENSION_ID_ENROLLMENT_DATE,
                DIMENSION_ID_SCHEDULED_DATE,
                DIMENSION_ID_INCIDENT_DATE,
            ],
        },
        // Max enabled - with registration / tracker
        {
            inputType: OUTPUT_TYPE_EVENT,
            program: {
                programType: PROGRAM_TYPE_WITH_REGISTRATION,
                displayIncidentDate: true,
            },
            stage: {
                id: '1',
                hideDueDate: false,
            },
            expected: [],
        },
        // Hiding the due date
        {
            inputType: OUTPUT_TYPE_EVENT,
            program: {
                programType: PROGRAM_TYPE_WITH_REGISTRATION,
                displayIncidentDate: true,
            },
            stage: {
                id: '1',
                hideDueDate: true,
            },
            expected: [DIMENSION_ID_SCHEDULED_DATE],
        },
        // Hiding the incident date
        {
            inputType: OUTPUT_TYPE_EVENT,
            program: {
                programType: PROGRAM_TYPE_WITH_REGISTRATION,
                displayIncidentDate: false,
            },
            stage: {
                id: '1',
                hideDueDate: true,
            },
            expected: [DIMENSION_ID_INCIDENT_DATE, DIMENSION_ID_SCHEDULED_DATE],
        },
        // input type enrollment
        {
            inputType: OUTPUT_TYPE_ENROLLMENT,
            program: {
                programType: PROGRAM_TYPE_WITH_REGISTRATION,
                displayIncidentDate: true,
            },
            stage: {
                id: '1',
                hideDueDate: false,
            },
            expected: [DIMENSION_ID_EVENT_DATE, DIMENSION_ID_SCHEDULED_DATE],
        },
        // Event program
        {
            inputType: OUTPUT_TYPE_EVENT,
            program: {
                programType: PROGRAM_TYPE_WITHOUT_REGISTRATION,
                displayIncidentDate: true,
            },
            stage: {
                id: '1',
                hideDueDate: false,
            },
            expected: [
                DIMENSION_ID_ENROLLMENT_DATE,
                DIMENSION_ID_INCIDENT_DATE,
                DIMENSION_ID_SCHEDULED_DATE,
            ],
        },
    ])(
        'returns expected IDs for inputType $inputType, programType $program.programType with displayIncidentDate $program.displayIncidentDate and stage.hideDueDate $stage.hideDueDate',
        ({ inputType, program, stage, expected }) =>
            expect(getHiddenTimeDimensions(inputType, program, stage)).toEqual(
                expected
            )
    )
})
