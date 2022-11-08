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
    assertDimensionEnabledState,
    openDimension,
    selectEventProgram,
} from '../helpers/dimensions.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const assertEventBasics = () => {
    dimensionIsEnabled('dimension-item-ou')
    cy.getBySel('dimension-item-ou').contains('Organisation unit')

    dimensionIsEnabled('dimension-item-eventStatus')
    cy.getBySel('dimension-item-eventStatus').contains('Event status')

    dimensionIsEnabled('dimension-item-createdBy')
    cy.getBySel('dimension-item-createdBy').contains('Created by')

    dimensionIsEnabled('dimension-item-lastUpdatedBy')
    cy.getBySel('dimension-item-lastUpdatedBy').contains('Last updated by')
}

const assertDimensionsForEventWithoutProgramSelected = (
    scheduleDateIsSupported
) => {
    assertEventBasics()
    dimensionIsDisabled('dimension-item-programStatus')
    cy.getBySel('dimension-item-programStatus').contains('Program status')

    dimensionIsEnabled('dimension-item-eventDate')
    cy.getBySel('dimension-item-eventDate').contains('Event date')

    dimensionIsDisabled('dimension-item-enrollmentDate')
    cy.getBySel('dimension-item-enrollmentDate').contains('Enrollment date')

    if (scheduleDateIsSupported) {
        dimensionIsDisabled('dimension-item-scheduledDate')
        cy.getBySel('dimension-item-scheduledDate').contains('Scheduled date')
    }

    dimensionIsDisabled('dimension-item-incidentDate')
    cy.getBySel('dimension-item-incidentDate').contains('Incident date')

    dimensionIsEnabled('dimension-item-lastUpdated')
    cy.getBySel('dimension-item-lastUpdated').contains('Last updated on')
}

const assertDimensionsForEventWithProgramSelected = (
    program,
    stageName,
    scheduleDateIsSupported
) => {
    assertEventBasics()

    dimensionIsEnabled('dimension-item-programStatus')
    cy.getBySel('dimension-item-programStatus').contains('Program status')

    assertDimensionEnabledState(
        'dimension-item-eventDate',
        program.stages[stageName][DIMENSION_ID_EVENT_DATE].enabled
    )
    cy.getBySel('dimension-item-eventDate').contains(
        program.stages[stageName][DIMENSION_ID_EVENT_DATE].label
    )

    assertDimensionEnabledState(
        'dimension-item-enrollmentDate',
        program.stages[stageName][DIMENSION_ID_ENROLLMENT_DATE].enabled
    )
    cy.getBySel('dimension-item-enrollmentDate').contains(
        program.stages[stageName][DIMENSION_ID_ENROLLMENT_DATE].label
    )

    if (scheduleDateIsSupported) {
        assertDimensionEnabledState(
            'dimension-item-scheduledDate',
            program.stages[stageName][DIMENSION_ID_SCHEDULED_DATE].enabled
        )
        cy.getBySel('dimension-item-scheduledDate').contains(
            program.stages[stageName][DIMENSION_ID_SCHEDULED_DATE].label
        )
    }

    assertDimensionEnabledState(
        'dimension-item-incidentDate',
        program.stages[stageName][DIMENSION_ID_INCIDENT_DATE].enabled
    )
    cy.getBySel('dimension-item-incidentDate').contains(
        program.stages[stageName][DIMENSION_ID_INCIDENT_DATE].label
    )

    assertDimensionEnabledState(
        'dimension-item-lastUpdated',
        program.stages[stageName][DIMENSION_ID_LAST_UPDATED].enabled
    )
    cy.getBySel('dimension-item-lastUpdated').contains(
        program.stages[stageName][DIMENSION_ID_LAST_UPDATED].label
    )
}

const assertEnrollmentBasics = () => {
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
}

const assertDimensionsForEnrollmentWithoutProgramSelected = (
    scheduleDateIsSupported
) => {
    assertEnrollmentBasics()

    dimensionIsDisabled('dimension-item-eventDate')
    cy.getBySel('dimension-item-eventDate').contains('Event date')

    dimensionIsEnabled('dimension-item-enrollmentDate')
    cy.getBySel('dimension-item-enrollmentDate').contains('Enrollment date')

    if (scheduleDateIsSupported) {
        dimensionIsDisabled('dimension-item-scheduledDate')
        cy.getBySel('dimension-item-scheduledDate').contains('Scheduled date')
    }

    dimensionIsDisabled('dimension-item-incidentDate')
    cy.getBySel('dimension-item-incidentDate').contains('Incident date')

    dimensionIsEnabled('dimension-item-lastUpdated')
    cy.getBySel('dimension-item-lastUpdated').contains('Last updated on')
}

const assertDimensionsForEnrollmentWithProgramSelected = (
    program,
    stageName,
    scheduleDateIsSupported
) => {
    assertEnrollmentBasics()

    dimensionIsDisabled('dimension-item-eventDate')
    cy.getBySel('dimension-item-eventDate').contains(
        program.stages[stageName][DIMENSION_ID_EVENT_DATE].label
    )

    dimensionIsEnabled('dimension-item-enrollmentDate')
    cy.getBySel('dimension-item-enrollmentDate').contains(
        program.stages[stageName][DIMENSION_ID_ENROLLMENT_DATE].label
    )

    if (scheduleDateIsSupported) {
        dimensionIsDisabled('dimension-item-scheduledDate')
        cy.getBySel('dimension-item-scheduledDate').contains(
            program.stages[stageName][DIMENSION_ID_SCHEDULED_DATE].label
        )
    }

    dimensionIsDisabled('dimension-item-incidentDate')
    cy.getBySel('dimension-item-incidentDate').contains(
        program.stages[stageName][DIMENSION_ID_INCIDENT_DATE].label
    )

    dimensionIsEnabled('dimension-item-lastUpdated')
    cy.getBySel('dimension-item-lastUpdated').contains(
        program.stages[stageName][DIMENSION_ID_LAST_UPDATED].label
    )
}

const runTests = ({ scheduleDateIsSupported } = {}) => {
    describe('event', () => {
        it('program can be selected and cleared', () => {
            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('program-clear-button').should('not.exist')

            assertDimensionsForEventWithoutProgramSelected(
                scheduleDateIsSupported
            )

            // select program

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            cy.contains(HIV_PROGRAM.programName).click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a stage above to add program dimensions.'
            )

            cy.getBySel('program-select').find('.disabled').should('be.visible')

            cy.getBySel('program-clear-button').should('be.visible')

            cy.getBySelLike('program-select').trigger('mouseover')

            cy.getBySelLike('tooltip-content').contains(
                'Clear program first to choose another'
            )

            assertDimensionsForEventWithProgramSelected(
                HIV_PROGRAM,
                'No stage',
                scheduleDateIsSupported
            )

            // add main and time dimensions

            const expectedSelectedDimensions = [
                HIV_PROGRAM.stages['No stage'][DIMENSION_ID_EVENT_DATE].label,
                HIV_PROGRAM.stages['No stage'][DIMENSION_ID_LAST_UPDATED].label,
                'Event status',
                'Created by',
                'Last updated by',
            ]

            const expectedUnselectedDimensions = [
                HIV_PROGRAM.stages['No stage'][DIMENSION_ID_ENROLLMENT_DATE]
                    .label,

                'Program status',
            ]

            // if (scheduleDateIsSupported) {
            //     expectedUnselectedDimensions.push(
            //         HIV_PROGRAM.stages['No stage'][DIMENSION_ID_SCHEDULED_DATE]
            //             .label
            //     )
            // }

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

            assertDimensionsForEventWithoutProgramSelected(
                scheduleDateIsSupported
            )

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
            const TEST_DATA_ELEMENT = 'HIV Age at Diagnosis'
            const TEST_PROGRAM_ATTRIBUTE = 'Country of birth'

            // select program

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            cy.contains(HIV_PROGRAM.programName).click()

            cy.getBySel('accessory-sidebar').contains('Stage')

            cy.getBySel('stage-clear-button').should('not.exist')

            // select stage

            cy.getBySel('accessory-sidebar').contains('Stage').click()

            cy.contains(
                HIV_PROGRAM.stages['Initial Case Report'].stageName
            ).click()

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

            assertDimensionsForEventWithProgramSelected(
                HIV_PROGRAM,
                'Initial Case Report',
                scheduleDateIsSupported
            )

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

            assertDimensionsForEventWithProgramSelected(
                HIV_PROGRAM,
                'No stage',
                scheduleDateIsSupported
            )

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
            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            cy.contains(ANALYTICS_PROGRAM.programName).click()

            cy.getBySel('stage-select').find('.disabled').should('be.visible')

            cy.getBySel('stage-clear-button').should('not.exist')

            cy.getBySelLike('stage-select').trigger('mouseover')

            cy.getBySelLike('tooltip-content').contains(
                'This program only has one stage'
            )
        })
    })

    describe('enrollment', () => {
        beforeEach(() => {
            cy.getBySel('main-sidebar', EXTENDED_TIMEOUT)
                .contains('Input: Event')
                .click()

            cy.getBySel('input-enrollment').click()

            cy.getBySel('main-sidebar').contains('Input: Enrollment').click()

            cy.getBySel('main-sidebar').contains('Program dimensions').click()
        })

        it('program can be selected and cleared', () => {
            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('program-clear-button').should('not.exist')

            assertDimensionsForEnrollmentWithoutProgramSelected(
                scheduleDateIsSupported
            )

            // select program
            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            cy.contains(HIV_PROGRAM.programName).click()

            cy.getBySel('program-select').find('.disabled').should('be.visible')

            cy.getBySel('program-clear-button').should('be.visible')

            cy.getBySel('accessory-sidebar').contains('All types')

            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .its('length')
                .should('be.gte', 1)

            assertDimensionsForEnrollmentWithProgramSelected(
                HIV_PROGRAM,
                'No stage',
                scheduleDateIsSupported
            )

            // clear program

            cy.getBySel('program-clear-button').click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('accessory-sidebar').contains('Choose a program')

            cy.getBySel('program-select').find('.disabled').should('not.exist')

            cy.getBySel('program-clear-button').should('not.exist')

            assertDimensionsForEnrollmentWithoutProgramSelected(
                scheduleDateIsSupported
            )
        })
    })

    describe('switching input type', () => {
        it('layout is cleared when input type is changed', () => {
            const stageName = 'Stage 1 - Repeatable'
            const mainAndTimeDimensions = [
                { label: 'Organisation unit', expected: true },
                { label: 'Event status', expected: false },
                { label: 'Program status', expected: true },
                { label: 'Created by', expected: true },
                { label: 'Last updated by', expected: true },
                {
                    label: ANALYTICS_PROGRAM.stages[stageName][
                        DIMENSION_ID_EVENT_DATE
                    ].label,
                    labelWithoutProgram: 'Event date',
                    expected: false,
                },
                {
                    label: ANALYTICS_PROGRAM.stages[stageName][
                        DIMENSION_ID_ENROLLMENT_DATE
                    ].label,
                    labelWithoutProgram: 'Enrollment date',
                    expected: true,
                },
                {
                    label: ANALYTICS_PROGRAM.stages[stageName][
                        DIMENSION_ID_INCIDENT_DATE
                    ].label,
                    labelWithoutProgram: 'Incident date',
                    expected: false,
                },
                {
                    label: ANALYTICS_PROGRAM.stages[stageName][
                        DIMENSION_ID_LAST_UPDATED
                    ].label,
                    labelWithoutProgram: 'Last updated on',
                    expected: true,
                },
            ]

            if (scheduleDateIsSupported) {
                mainAndTimeDimensions.push({
                    label: ANALYTICS_PROGRAM.stages[stageName][
                        DIMENSION_ID_SCHEDULED_DATE
                    ].label,
                    labelWithoutProgram: 'Scheduled date',
                    expected: false,
                })
            }

            // remove org unit
            cy.getBySel('layout-chip-ou')
                .findBySel('dimension-menu-button')
                .click()
            cy.containsExact('Remove').click()

            selectEventProgram({
                programName: ANALYTICS_PROGRAM.programName,
                stageName: ANALYTICS_PROGRAM.stages[stageName].stageName,
            })

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

            assertDimensionsForEnrollmentWithoutProgramSelected(
                scheduleDateIsSupported
            )
        })
    })
}

describe(['>=39'], 'program dimensions', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.getBySel('main-sidebar', EXTENDED_TIMEOUT).should('be.visible')
        cy.getBySel('main-sidebar').contains('Program dimensions').click()
    })

    runTests({ scheduleDateIsSupported: true })
})

describe(['<39'], 'program dimensions', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.getBySel('main-sidebar', EXTENDED_TIMEOUT).should('be.visible')
        cy.getBySel('main-sidebar').contains('Program dimensions').click()
    })

    runTests()
})

// TODO: add tests for search, type filtering and selecting dimensions
