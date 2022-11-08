import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_LAST_UPDATED,
    DIMENSION_ID_SCHEDULED_DATE,
} from '../../src/modules/dimensionConstants.js'
import {
    HIV_PROGRAM,
    ANALYTICS_PROGRAM,
    ENROLLMENT_ANALYTICS_PROGRAM,
    TEST_DIM_TEXT,
} from '../data/index.js'
import {
    assertDimensionEnabledState,
    openDimension,
    selectEventProgram,
} from '../helpers/dimensions.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const baseDimensions = [
    {
        label: 'Organisation unit',
        dataTestId: 'dimension-item-ou',
        enabled: true,
    },
    {
        label: 'Created by',
        dataTestId: 'dimension-item-createdBy',
        enabled: true,
    },
    {
        label: 'Last updated by',
        dataTestId: 'dimension-item-lastUpdatedBy',
        enabled: true,
    },
]

const getNoProgram = (isEvent) => ({
    [DIMENSION_ID_EVENT_DATE]: {
        label: 'Event date',
        dataTestId: 'dimension-item-eventDate',
        enabled: isEvent,
    },
    [DIMENSION_ID_ENROLLMENT_DATE]: {
        label: 'Enrollment date',
        dataTestId: 'dimension-item-enrollmentDate',
        enabled: !isEvent,
    },
    [DIMENSION_ID_SCHEDULED_DATE]: {
        label: 'Scheduled date',
        dataTestId: 'dimension-item-scheduledDate',
        enabled: false,
    },
    [DIMENSION_ID_INCIDENT_DATE]: {
        label: 'Incident date',
        dataTestId: 'dimension-item-incidentDate',
        enabled: false,
    },
    [DIMENSION_ID_LAST_UPDATED]: {
        label: 'Last updated on',
        dataTestId: 'dimension-item-lastUpdated',
        enabled: true,
    },
})

const assertDimensionsForEvent = (scheduleDateIsSupported, program, stage) => {
    const dims = program.stages && stage ? program.stages[stage] : program

    baseDimensions
        .concat([
            {
                label: 'Program status',
                dataTestId: 'dimension-item-programStatus',
                enabled: Boolean(program.stages),
            },
            {
                label: 'Event status',
                dataTestId: 'dimension-item-eventStatus',
                enabled: true,
            },
            {
                label: dims[DIMENSION_ID_EVENT_DATE].label,
                dataTestId: 'dimension-item-eventDate',
                enabled: dims[DIMENSION_ID_EVENT_DATE].enabled,
            },
            {
                label: dims[DIMENSION_ID_ENROLLMENT_DATE].label,
                dataTestId: 'dimension-item-enrollmentDate',
                enabled: dims[DIMENSION_ID_ENROLLMENT_DATE].enabled,
            },
            {
                label: dims[DIMENSION_ID_SCHEDULED_DATE].label,
                dataTestId: 'dimension-item-scheduledDate',
                enabled: dims[DIMENSION_ID_SCHEDULED_DATE].enabled,
            },
            {
                label: dims[DIMENSION_ID_INCIDENT_DATE].label,
                dataTestId: 'dimension-item-incidentDate',
                enabled: dims[DIMENSION_ID_INCIDENT_DATE].enabled,
            },
            {
                label: dims[DIMENSION_ID_LAST_UPDATED].label,
                dataTestId: 'dimension-item-lastUpdated',
                enabled: dims[DIMENSION_ID_LAST_UPDATED].enabled,
            },
        ])
        .filter(({ dataTestId }) =>
            Boolean(
                scheduleDateIsSupported ||
                    dataTestId !== 'dimension-item-scheduledDate'
            )
        )
        .forEach(({ label, dataTestId, enabled }) => {
            // assert that the enabled state is correct and the label is correct
            assertDimensionEnabledState(dataTestId, enabled)
            cy.getBySel(dataTestId).contains(label)
        })
}

const assertDimensionsForEnrollment = (scheduleDateIsSupported, dims) => {
    baseDimensions
        .concat([
            {
                label: 'Event status',
                dataTestId: 'dimension-item-eventStatus',
                enabled: false,
            },
            {
                label: 'Program status',
                dataTestId: 'dimension-item-programStatus',
                enabled: true,
            },
            {
                label: dims[DIMENSION_ID_EVENT_DATE].label,
                dataTestId: 'dimension-item-eventDate',
                enabled: dims[DIMENSION_ID_EVENT_DATE].enabled,
            },
            {
                label: dims[DIMENSION_ID_ENROLLMENT_DATE].label,
                dataTestId: 'dimension-item-enrollmentDate',
                enabled: dims[DIMENSION_ID_ENROLLMENT_DATE].enabled,
            },
            {
                label: dims[DIMENSION_ID_SCHEDULED_DATE].label,
                dataTestId: 'dimension-item-scheduledDate',
                enabled: dims[DIMENSION_ID_SCHEDULED_DATE].enabled,
            },
            {
                label: dims[DIMENSION_ID_INCIDENT_DATE].label,
                dataTestId: 'dimension-item-incidentDate',
                enabled: dims[DIMENSION_ID_INCIDENT_DATE].enabled,
            },
            {
                label: dims[DIMENSION_ID_LAST_UPDATED].label,
                dataTestId: 'dimension-item-lastUpdated',
                enabled: dims[DIMENSION_ID_LAST_UPDATED].enabled,
            },
        ])
        .filter(({ dataTestId }) =>
            Boolean(
                scheduleDateIsSupported ||
                    dataTestId !== 'dimension-item-scheduledDate'
            )
        )
        .forEach(({ label, dataTestId, enabled }) => {
            assertDimensionEnabledState(dataTestId, enabled)
            cy.getBySel(dataTestId).contains(label)
        })
}

const runTests = ({ scheduleDateIsSupported } = {}) => {
    describe('event', () => {
        it('program can be selected and cleared', () => {
            const program = HIV_PROGRAM
            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('program-clear-button').should('not.exist')

            assertDimensionsForEvent(
                scheduleDateIsSupported,
                getNoProgram(true)
            )

            // select program

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            cy.contains(program.programName).click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a stage above to add program dimensions.'
            )

            cy.getBySel('program-select').find('.disabled').should('be.visible')

            cy.getBySel('program-clear-button').should('be.visible')

            cy.getBySelLike('program-select').trigger('mouseover')

            cy.getBySelLike('tooltip-content').contains(
                'Clear program first to choose another'
            )

            assertDimensionsForEvent(
                scheduleDateIsSupported,
                program,
                'No stage'
            )

            // add main and time dimensions

            const expectedSelectedDimensions = [
                program.stages['No stage'][DIMENSION_ID_EVENT_DATE].label,
                program.stages['No stage'][DIMENSION_ID_LAST_UPDATED].label,
                'Event status',
                'Created by',
                'Last updated by',
            ]

            const expectedUnselectedDimensions = [
                program.stages['No stage'][DIMENSION_ID_ENROLLMENT_DATE].label,
                'Program status',
            ]

            if (
                scheduleDateIsSupported &&
                program.stages['No stage'][DIMENSION_ID_SCHEDULED_DATE].enabled
            ) {
                expectedUnselectedDimensions.push(
                    program.stages['No stage'][DIMENSION_ID_SCHEDULED_DATE]
                        .label
                )
            }

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

            assertDimensionsForEvent(
                scheduleDateIsSupported,
                getNoProgram(true)
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
            const program = HIV_PROGRAM
            const stage = 'Initial Case Report'
            const nostage = 'No stage'

            // select program

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            cy.contains(program.programName).click()

            cy.getBySel('accessory-sidebar').contains('Stage')

            cy.getBySel('stage-clear-button').should('not.exist')

            // select stage

            cy.getBySel('accessory-sidebar').contains('Stage').click()

            cy.contains(program.stages[stage].stageName).click()

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

            assertDimensionsForEvent(scheduleDateIsSupported, program, stage)

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

            assertDimensionsForEvent(scheduleDateIsSupported, program, nostage)

            // assert that the Data Element was removed but the Program Attribute remained

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

            assertDimensionsForEnrollment(
                scheduleDateIsSupported,
                getNoProgram(false)
            )

            // select program
            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            cy.contains(ENROLLMENT_ANALYTICS_PROGRAM.programName).click()

            cy.getBySel('program-select').find('.disabled').should('be.visible')

            cy.getBySel('program-clear-button').should('be.visible')

            cy.getBySel('accessory-sidebar').contains('All types')

            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .its('length')
                .should('be.gte', 1)

            assertDimensionsForEnrollment(
                scheduleDateIsSupported,
                ENROLLMENT_ANALYTICS_PROGRAM
            )

            // clear program

            cy.getBySel('program-clear-button').click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('accessory-sidebar').contains('Choose a program')

            cy.getBySel('program-select').find('.disabled').should('not.exist')

            cy.getBySel('program-clear-button').should('not.exist')

            assertDimensionsForEnrollment(
                scheduleDateIsSupported,
                getNoProgram(false)
            )
        })
    })

    describe('switching input type', () => {
        it('layout is cleared when input type is changed', () => {
            const program = ANALYTICS_PROGRAM
            const stage = 'Stage 1 - Repeatable'
            const mainAndTimeDimensions = [
                { label: 'Organisation unit', expected: true },
                { label: 'Event status', expected: false },
                { label: 'Program status', expected: true },
                { label: 'Created by', expected: true },
                { label: 'Last updated by', expected: true },
                {
                    label: program.stages[stage][DIMENSION_ID_EVENT_DATE].label,
                    labelWithoutProgram: 'Event date',
                    expected: false,
                },
                {
                    label: program.stages[stage][DIMENSION_ID_ENROLLMENT_DATE]
                        .label,
                    labelWithoutProgram: 'Enrollment date',
                    expected: true,
                },
                {
                    label: program.stages[stage][DIMENSION_ID_INCIDENT_DATE]
                        .label,
                    labelWithoutProgram: 'Incident date',
                    expected: false,
                },
                {
                    label: program.stages[stage][DIMENSION_ID_LAST_UPDATED]
                        .label,
                    labelWithoutProgram: 'Last updated on',
                    expected: true,
                },
            ]

            if (scheduleDateIsSupported) {
                mainAndTimeDimensions.push({
                    label: program.stages[stage][DIMENSION_ID_SCHEDULED_DATE]
                        .label,
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
                stageName: ANALYTICS_PROGRAM.stages[stage].stageName,
            })

            //assertDimensionsForEvent(event)

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

            assertDimensionsForEnrollment(
                scheduleDateIsSupported,
                getNoProgram(false)
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
