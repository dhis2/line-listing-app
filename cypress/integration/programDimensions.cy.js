import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_LAST_UPDATED,
    DIMENSION_ID_SCHEDULED_DATE,
} from '../../src/modules/dimensionConstants.js'
import { HIV_PROGRAM, ANALYTICS_PROGRAM, TEST_DIM_TEXT } from '../data/index.js'
import {
    dimensionIsDisabled,
    dimensionIsEnabled,
    openDimension,
    selectEventProgram,
} from '../helpers/dimensions.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const assertDimensionsForEventWithoutProgramSelected = () => {
    dimensionIsEnabled('dimension-item-ou')
    cy.getBySel('dimension-item-ou').contains('Organisation unit')

    dimensionIsEnabled('dimension-item-eventStatus')
    cy.getBySel('dimension-item-eventStatus').contains('Event status')

    dimensionIsDisabled('dimension-item-programStatus')
    cy.getBySel('dimension-item-programStatus').contains('Program status')

    dimensionIsEnabled('dimension-item-createdBy')
    cy.getBySel('dimension-item-createdBy').contains('Created by')

    dimensionIsEnabled('dimension-item-lastUpdatedBy')
    cy.getBySel('dimension-item-lastUpdatedBy').contains('Last updated by')

    dimensionIsEnabled('dimension-item-eventDate')
    cy.getBySel('dimension-item-eventDate').contains('Event date')

    dimensionIsDisabled('dimension-item-enrollmentDate')
    cy.getBySel('dimension-item-enrollmentDate').contains('Enrollment date')

    dimensionIsDisabled('dimension-item-scheduledDate')
    cy.getBySel('dimension-item-scheduledDate').contains('Scheduled date')

    dimensionIsDisabled('dimension-item-incidentDate')
    cy.getBySel('dimension-item-incidentDate').contains('Incident date')

    dimensionIsEnabled('dimension-item-lastUpdated')
    cy.getBySel('dimension-item-lastUpdated').contains('Last updated on')
}

const assertDimensionsForEventWithProgramSelected = (event) => {
    dimensionIsEnabled('dimension-item-ou')
    cy.getBySel('dimension-item-ou').contains('Organisation unit')

    dimensionIsEnabled('dimension-item-eventStatus')
    cy.getBySel('dimension-item-eventStatus').contains('Event status')

    dimensionIsEnabled('dimension-item-programStatus')
    cy.getBySel('dimension-item-programStatus').contains('Program status')

    dimensionIsEnabled('dimension-item-createdBy')
    cy.getBySel('dimension-item-createdBy').contains('Created by')

    dimensionIsEnabled('dimension-item-lastUpdatedBy')
    cy.getBySel('dimension-item-lastUpdatedBy').contains('Last updated by')

    dimensionIsEnabled('dimension-item-eventDate')
    cy.getBySel('dimension-item-eventDate').contains(
        event[DIMENSION_ID_EVENT_DATE]
    )

    dimensionIsEnabled('dimension-item-enrollmentDate')
    cy.getBySel('dimension-item-enrollmentDate').contains(
        event[DIMENSION_ID_ENROLLMENT_DATE]
    )

    dimensionIsEnabled('dimension-item-scheduledDate')
    cy.getBySel('dimension-item-scheduledDate').contains(
        event[DIMENSION_ID_SCHEDULED_DATE]
    )

    dimensionIsDisabled('dimension-item-incidentDate')
    cy.getBySel('dimension-item-incidentDate').contains(
        event[DIMENSION_ID_INCIDENT_DATE]
    )

    dimensionIsEnabled('dimension-item-lastUpdated')
    cy.getBySel('dimension-item-lastUpdated').contains(
        event[DIMENSION_ID_LAST_UPDATED]
    )
}

const assertDimensionsForEnrollmentWithoutProgramSelected = () => {
    dimensionIsEnabled('dimension-item-ou')
    cy.getBySel('dimension-item-ou').contains('Organisation unit')

    dimensionIsDisabled('dimension-item-eventStatus')
    cy.getBySel('dimension-item-eventStatus').contains('Event status')

    dimensionIsEnabled('dimension-item-programStatus')
    cy.getBySel('dimension-item-programStatus').contains('Program status')

    dimensionIsEnabled('dimension-item-createdBy')
    cy.getBySel('dimension-item-createdBy').contains('Created by')

    dimensionIsEnabled('dimension-item-lastUpdatedBy')
    cy.getBySel('dimension-item-lastUpdatedBy').contains('Last updated by')

    dimensionIsDisabled('dimension-item-eventDate')
    cy.getBySel('dimension-item-eventDate').contains('Event date')

    dimensionIsEnabled('dimension-item-enrollmentDate')
    cy.getBySel('dimension-item-enrollmentDate').contains('Enrollment date')

    dimensionIsDisabled('dimension-item-scheduledDate')
    cy.getBySel('dimension-item-scheduledDate').contains('Scheduled date')

    dimensionIsDisabled('dimension-item-incidentDate')
    cy.getBySel('dimension-item-incidentDate').contains('Incident date')

    dimensionIsEnabled('dimension-item-lastUpdated')
    cy.getBySel('dimension-item-lastUpdated').contains('Last updated on')
}

const assertDimensionsForEnrollmentWithProgramSelected = (enrollment) => {
    dimensionIsEnabled('dimension-item-ou')
    cy.getBySel('dimension-item-ou').contains('Organisation unit')

    dimensionIsDisabled('dimension-item-eventStatus')
    cy.getBySel('dimension-item-eventStatus').contains('Event status')

    dimensionIsEnabled('dimension-item-programStatus')
    cy.getBySel('dimension-item-programStatus').contains('Program status')

    dimensionIsEnabled('dimension-item-createdBy')
    cy.getBySel('dimension-item-createdBy').contains('Created by')

    dimensionIsEnabled('dimension-item-lastUpdatedBy')
    cy.getBySel('dimension-item-lastUpdatedBy').contains('Last updated by')

    dimensionIsDisabled('dimension-item-eventDate')
    cy.getBySel('dimension-item-eventDate').contains(
        enrollment[DIMENSION_ID_EVENT_DATE]
    )

    dimensionIsEnabled('dimension-item-enrollmentDate')
    cy.getBySel('dimension-item-enrollmentDate').contains(
        enrollment[DIMENSION_ID_ENROLLMENT_DATE]
    )

    dimensionIsDisabled('dimension-item-scheduledDate')
    cy.getBySel('dimension-item-scheduledDate').contains(
        enrollment[DIMENSION_ID_SCHEDULED_DATE]
    )

    dimensionIsDisabled('dimension-item-incidentDate')
    cy.getBySel('dimension-item-incidentDate').contains(
        enrollment[DIMENSION_ID_INCIDENT_DATE]
    )

    dimensionIsEnabled('dimension-item-lastUpdated')
    cy.getBySel('dimension-item-lastUpdated').contains(
        enrollment[DIMENSION_ID_LAST_UPDATED]
    )
}

describe('program dimensions', () => {
    beforeEach(() => {
        cy.visit('/')

        cy.getBySel('main-sidebar', EXTENDED_TIMEOUT).should('be.visible')

        cy.getBySel('main-sidebar').contains('Program dimensions').click()
    })

    describe('event', () => {
        it('program can be selected and cleared', () => {
            const event = HIV_PROGRAM
            const eventDateWithoutStage = {
                [DIMENSION_ID_EVENT_DATE]: 'Event date',
            }

            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('program-clear-button').should('not.exist')

            assertDimensionsForEventWithoutProgramSelected()

            // select program

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            cy.contains(event.programName).click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a stage above to add program dimensions.'
            )

            cy.getBySel('program-select').find('.disabled').should('be.visible')

            cy.getBySel('program-clear-button').should('be.visible')

            cy.getBySelLike('program-select').trigger('mouseover')

            cy.getBySelLike('tooltip-content').contains(
                'Clear program first to choose another'
            )

            assertDimensionsForEventWithProgramSelected({
                ...event,
                ...eventDateWithoutStage,
            })

            // add main and time dimensions

            const expectedSelectedDimensions = [
                'Event date',
                event[DIMENSION_ID_LAST_UPDATED],
                'Event status',
                'Created by',
                'Last updated by',
            ]

            const expectedUnselectedDimensions = [
                event[DIMENSION_ID_ENROLLMENT_DATE],
                event[DIMENSION_ID_SCHEDULED_DATE],
                'Program status',
            ]

            expectedSelectedDimensions
                .concat(expectedUnselectedDimensions)
                .forEach((dimension) => {
                    cy.getBySel('main-sidebar')
                        .contains(dimension)
                        .closest(`[data-test*="dimension-item"]`)
                        .findBySel('dimension-menu-button')
                        .invoke('attr', 'style', 'visibility: initial')
                        .click()

                    cy.contains('Add to Columns').click()
                })

            // clear program

            cy.getBySel('program-clear-button').click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('accessory-sidebar').contains('Choose a program')

            cy.getBySel('program-select').find('.disabled').should('not.exist')

            cy.getBySel('program-clear-button').should('not.exist')

            assertDimensionsForEventWithoutProgramSelected()

            // assert dimensions in layout after program is cleared

            expectedSelectedDimensions.forEach((dimension) => {
                cy.getBySel('columns-axis')
                    .findBySelLike('layout-chip')
                    .contains(dimension)
                    .should('be.visible')
            })

            expectedUnselectedDimensions.forEach((dimension) => {
                cy.getBySel('columns-axis')
                    .findBySelLike('layout-chip')
                    .contains(dimension)
                    .should('not.exist')
            })
        })

        it('stage can be selected and cleared', () => {
            const event = HIV_PROGRAM
            const eventDateWithoutStage = {
                [DIMENSION_ID_EVENT_DATE]: 'Event date',
            }
            const TEST_DATA_ELEMENT = 'HIV Age at Diagnosis'
            const TEST_PROGRAM_ATTRIBUTE = 'Country of birth'

            // select program

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            cy.contains(event.programName).click()

            cy.getBySel('accessory-sidebar').contains('Stage')

            cy.getBySel('stage-clear-button').should('not.exist')

            // select stage

            cy.getBySel('accessory-sidebar').contains('Stage').click()

            cy.contains(event.stageName).click()

            cy.getBySel('stage-select').find('.disabled').should('be.visible')

            cy.getBySel('stage-clear-button').should('be.visible')

            cy.getBySelLike('stage-select').trigger('mouseover')

            cy.getBySelLike('tooltip-content').contains(
                'Clear stage first to choose another'
            )

            cy.getBySel('accessory-sidebar').contains('All types')

            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .its('length')
                .should('be.gte', 1)

            assertDimensionsForEventWithProgramSelected(event)

            // add a data element

            openDimension(TEST_DATA_ELEMENT)

            cy.contains('Add to Columns').click()

            // add a program attribute

            openDimension(TEST_PROGRAM_ATTRIBUTE)

            cy.contains('Add to Columns').click()

            // clear stage

            cy.getBySel('stage-clear-button').click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a stage above to add program dimensions.'
            )

            cy.getBySel('accessory-sidebar').contains('Stage')

            cy.getBySel('stage-select').find('.disabled').should('not.exist')

            cy.getBySel('stage-clear-button').should('not.exist')

            assertDimensionsForEventWithProgramSelected({
                ...event,
                ...eventDateWithoutStage,
            })

            // assert that the DE was removed but the PA remained

            cy.getBySel('columns-axis')
                .findBySelLike('layout-chip')
                .contains(TEST_DATA_ELEMENT)
                .should('not.exist')

            cy.getBySel('columns-axis')
                .findBySelLike('layout-chip')
                .contains(TEST_PROGRAM_ATTRIBUTE)
                .should('be.visible')
        })
        it("stage can't be cleared for event with a single stage", () => {
            const event = ANALYTICS_PROGRAM

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            cy.contains(event.programName).click()

            cy.getBySel('stage-select').find('.disabled').should('be.visible')

            cy.getBySel('stage-clear-button').should('not.exist')

            cy.getBySelLike('stage-select').trigger('mouseover')

            cy.getBySelLike('tooltip-content').contains(
                'This program only has one stage'
            )
        })
    })

    describe('enrollment', () => {
        const enrollment = {
            ...HIV_PROGRAM,
            [DIMENSION_ID_EVENT_DATE]: 'Event date',
        }

        beforeEach(() => {
            cy.getBySel('main-sidebar').contains('Input: Event').click()

            cy.getBySel('input-enrollment').click()

            cy.getBySel('main-sidebar').contains('Input: Enrollment').click()

            cy.getBySel('main-sidebar').contains('Program dimensions').click()
        })

        it('program can be selected and cleared', () => {
            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('program-clear-button').should('not.exist')

            assertDimensionsForEnrollmentWithoutProgramSelected()

            // select program

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            cy.contains(enrollment.programName).click()

            cy.getBySel('program-select').find('.disabled').should('be.visible')

            cy.getBySel('program-clear-button').should('be.visible')

            cy.getBySel('accessory-sidebar').contains('All types')

            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .its('length')
                .should('be.gte', 1)

            assertDimensionsForEnrollmentWithProgramSelected(enrollment)

            // clear program

            cy.getBySel('program-clear-button').click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('accessory-sidebar').contains('Choose a program')

            cy.getBySel('program-select').find('.disabled').should('not.exist')

            cy.getBySel('program-clear-button').should('not.exist')

            assertDimensionsForEnrollmentWithoutProgramSelected()
        })
    })

    describe('switching input type', () => {
        it.only('layout is cleared when input type is changed', () => {
            const event = ANALYTICS_PROGRAM
            const mainAndTimeDimensions = [
                { label: 'Organisation unit', expected: true },
                { label: 'Event status', expected: false },
                { label: 'Program status', expected: true },
                { label: 'Created by', expected: true },
                { label: 'Last updated by', expected: true },
                {
                    label: event[DIMENSION_ID_EVENT_DATE],
                    labelWithoutProgram: 'Event date',
                    expected: false,
                },
                {
                    label: event[DIMENSION_ID_ENROLLMENT_DATE],
                    labelWithoutProgram: 'Enrollment date',
                    expected: true,
                },
                {
                    label: event[DIMENSION_ID_SCHEDULED_DATE],
                    labelWithoutProgram: 'Scheduled date',
                    expected: false,
                },
                {
                    label: event[DIMENSION_ID_INCIDENT_DATE],
                    labelWithoutProgram: 'Incident date',
                    expected: false,
                },
                {
                    label: event[DIMENSION_ID_LAST_UPDATED],
                    labelWithoutProgram: 'Last updated on',
                    expected: true,
                },
            ]

            // remove org unit
            cy.getBySel('layout-chip-ou')
                .findBySel('dimension-menu-button')
                .click()
            cy.containsExact('Remove').click()

            selectEventProgram(ANALYTICS_PROGRAM)

            //assertDimensionsForEventWithProgramSelected(event)

            // add a data element

            openDimension(TEST_DIM_TEXT)

            cy.contains('Add to Columns').click()

            // add main and time dimensions

            mainAndTimeDimensions.forEach(({ label }) => {
                cy.getBySel('main-sidebar')
                    .contains(label)
                    .closest(`[data-test*="dimension-item"]`)
                    .findBySel('dimension-menu-button')
                    .invoke('attr', 'style', 'visibility: initial')
                    .click()

                cy.contains('Add to Columns').click()
            })

            // change input type

            cy.getBySel('main-sidebar').contains('Input: Event').click()

            cy.getBySel('input-enrollment').click()

            // assert dimensions in layout after program is cleared

            mainAndTimeDimensions.forEach(
                ({ label, expected, labelWithoutProgram }) => {
                    if (expected) {
                        cy.getBySel('columns-axis')
                            .findBySelLike('layout-chip')
                            .contains(labelWithoutProgram || label)
                            .should('be.visible')
                    } else {
                        cy.getBySel('columns-axis')
                            .findBySelLike('layout-chip')
                            .contains(labelWithoutProgram || label)
                            .should('not.exist')
                    }
                }
            )

            // assert that dimensions are enabled/disabled correctly

            assertDimensionsForEnrollmentWithoutProgramSelected()
        })
    })
})

// TODO: add tests for search, type filtering and selecting dimensions
