import { AXIS_ID_COLUMNS } from '@dhis2/analytics'
import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
} from '../../src/modules/dimensionConstants.js'
import { E2E_PROGRAM } from '../data/index.js'
import {
    clickAddRemoveMainDimension,
    clickAddRemoveProgramDimension,
    openDimension,
    openInputSidebar,
    openProgramDimensionsSidebar,
    selectEnrollmentWithProgramDimensions,
    selectEventWithProgram,
    selectProgramForTE,
    selectTrackedEntityWithType,
} from '../helpers/dimensions.js'
import { expectAxisToHaveDimension } from '../helpers/layout.js'
import { goToStartPage } from '../helpers/startScreen.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const assertDimensionsForEventWithoutProgramSelected = () => {
    cy.getBySel('dimension-item-lastUpdated').contains('Last updated on')

    cy.getBySel('dimension-item-createdBy').contains('Created by')

    cy.getBySel('dimension-item-lastUpdatedBy').contains('Last updated by')
}

const assertDimensionsForEventWithProgramSelected = (
    program,
    scheduledDateIsSupported,
    showIncidentDate
) => {
    cy.getBySel('dimension-item-ou').contains('Organisation unit')

    cy.getBySel('dimension-item-eventStatus').contains('Event status')

    cy.getBySel('dimension-item-programStatus').contains('Program status')

    cy.getBySel('dimension-item-createdBy').contains('Created by')

    cy.getBySel('dimension-item-lastUpdatedBy').contains('Last updated by')

    cy.getBySel('dimension-item-eventDate').contains(
        program[DIMENSION_ID_EVENT_DATE]
    )

    cy.getBySel('dimension-item-enrollmentDate').contains(
        program[DIMENSION_ID_ENROLLMENT_DATE]
    )

    if (scheduledDateIsSupported) {
        cy.getBySel('dimension-item-scheduledDate').contains(
            program[DIMENSION_ID_SCHEDULED_DATE]
        )
    } else {
        cy.getBySel('dimension-item-scheduledDate').should('not.exist')
    }

    if (showIncidentDate) {
        cy.getBySel('dimension-item-incidentDate').contains(
            program[DIMENSION_ID_INCIDENT_DATE]
        )
    } else {
        cy.getBySel('dimension-item-incidentDate').should('not.exist')
    }

    cy.getBySel('dimension-item-lastUpdated').contains('Last updated on')
}

const assertDimensionsForEnrollmentWithoutProgramSelected = () =>
    assertDimensionsForEventWithoutProgramSelected()

const assertDimensionsForEnrollmentWithProgramSelected = (program) => {
    cy.getBySel('dimension-item-ou').contains('Organisation unit')

    cy.getBySel('dimension-item-eventStatus').should('not.exist')

    cy.getBySel('dimension-item-programStatus').contains('Program status')

    cy.getBySel('dimension-item-createdBy').contains('Created by')

    cy.getBySel('dimension-item-lastUpdatedBy').contains('Last updated by')

    cy.getBySel('dimension-item-eventDate').should('not.exist')

    cy.getBySel('dimension-item-enrollmentDate').contains(
        program[DIMENSION_ID_ENROLLMENT_DATE]
    )

    cy.getBySel('dimension-item-scheduledDate').should('not.exist')

    cy.getBySel('dimension-item-incidentDate').should('not.exist')

    cy.getBySel('dimension-item-lastUpdated').contains('Last updated on')
}

export const programDimensionsIsEnabled = () =>
    cy
        .getBySel('program-dimensions-button')
        .should('be.visible')
        .and('not.have.css', 'user-select', 'none')
        .and('not.have.css', 'cursor', 'not-allowed')

export const programDimensionsIsDisabled = () =>
    cy
        .getBySel('program-dimensions-button')
        .should('be.visible')
        .and('have.css', 'user-select', 'none')
        .and('have.css', 'cursor', 'not-allowed')

const runTests = ({ scheduledDateIsSupported } = {}) => {
    /*
Test data used:
    E2E program
        Stages: 1 (i.e. stage is auto-selected)
        Scheduled date: enabled (for selected stage)
        Incident date: enabled

    WHO RMNCH Tracker
        Stages: >1
        Scheduled date: enabled (for selected stage)
        Incident date: disabled

Note that scheduled date can be toggled per program stage.
I.e. Scheduled date works like this:
    stage without scheduled date: disabled
    stage with scheduled date: enabled
*/

    const TEST_PROGRAM = {
        programName: 'WHO RMNCH Tracker',
        defaultStage: {
            stageName: 'Previous deliveries',
            [DIMENSION_ID_EVENT_DATE]: 'Date of birth',
            [DIMENSION_ID_ENROLLMENT_DATE]: 'Date of first visit',
            [DIMENSION_ID_SCHEDULED_DATE]: 'Scheduled date',
            [DIMENSION_ID_INCIDENT_DATE]: 'Date of incident',
        },
        stage: {
            stageName: 'First antenatal care visit',
            [DIMENSION_ID_EVENT_DATE]: 'Date of visit',
            [DIMENSION_ID_ENROLLMENT_DATE]: 'Date of first visit',
            [DIMENSION_ID_SCHEDULED_DATE]: 'Appointment date',
            [DIMENSION_ID_INCIDENT_DATE]: 'Date of incident',
        },
    }

    describe('event', () => {
        it('program can be selected and cleared', () => {
            const program = E2E_PROGRAM

            programDimensionsIsDisabled()

            assertDimensionsForEventWithoutProgramSelected()

            // select program

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            cy.contains(program.programName).click()

            programDimensionsIsEnabled()

            openProgramDimensionsSidebar()

            assertDimensionsForEventWithProgramSelected(
                program,
                scheduledDateIsSupported,
                true
            )

            // add main and time dimensions

            const expectedSelectedDimensions = [
                'Last updated on',
                'Created by',
                'Last updated by',
            ]

            const expectedUnselectedDimensions = [
                'Event status',
                'Program status',
                program[DIMENSION_ID_EVENT_DATE],
                program[DIMENSION_ID_ENROLLMENT_DATE],
                program[DIMENSION_ID_INCIDENT_DATE],
            ]
            if (scheduledDateIsSupported) {
                expectedUnselectedDimensions.push(
                    program[DIMENSION_ID_SCHEDULED_DATE]
                )
            }

            expectedSelectedDimensions.forEach((dimension) =>
                clickAddRemoveMainDimension(dimension)
            )
            expectedUnselectedDimensions.forEach((dimension) =>
                clickAddRemoveProgramDimension(dimension)
            )

            // clear program

            openInputSidebar()

            cy.getBySel('input-enrollment').click()

            cy.getBySel('accessory-sidebar').contains('Choose a program')

            programDimensionsIsDisabled()

            assertDimensionsForEventWithoutProgramSelected()

            // assert dimensions in layout after program is cleared

            expectedSelectedDimensions
                .concat('Organisation unit')
                .forEach((dimension) => {
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

        it('stage can be selected, dimension list reflects the selection', () => {
            // select program
            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()
            cy.contains('Child Programme').click()

            // select data element
            cy.getBySel('program-dimensions-button').click()
            cy.getBySel('accessory-sidebar').contains('All types').click()
            cy.getBySel('dhis2-uicore-popper')
                .containsExact('Data element')
                .click()

            // items from the selected stage are shown
            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .contains('MCH ARV at birth')
                .should('be.visible')
            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .contains('MCH DPT dose')
                .should('not.exist')

            // select a different stage
            cy.getBySel('input-panel-button').click()
            cy.getBySel('stage-select').click()
            cy.contains('Baby Postnatal').click()

            // items from the selected stage are shown
            cy.getBySel('program-dimensions-button').click()
            cy.getBySel('accessory-sidebar').contains('All types').click()
            cy.getBySel('dhis2-uicore-popper')
                .containsExact('Data element')
                .click()
            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .contains('MCH ARV at birth')
                .should('not.exist')
            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .contains('MCH DPT dose')
                .should('be.visible')
        })

        it('stage can be selected, dimensions are removed when stage and program are changed', () => {
            const program = TEST_PROGRAM
            const TEST_DATA_ELEMENT = 'WHOMCH Conditions in previous pregnancy'
            const TEST_PROGRAM_ATTRIBUTE = 'First name'

            programDimensionsIsDisabled()

            assertDimensionsForEventWithoutProgramSelected()

            // select program (stage is auto-selected)

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            cy.contains(program.programName).click()

            programDimensionsIsEnabled()

            cy.getBySel('stage-select').contains(program.defaultStage.stageName)

            openProgramDimensionsSidebar()

            cy.getBySel('program-dimensions-list', EXTENDED_TIMEOUT)
                .findBySelLike('dimension-item')
                .its('length')
                .should('be.gte', 1)

            assertDimensionsForEventWithProgramSelected(
                program.defaultStage,
                scheduledDateIsSupported
            )

            // add a data element

            openDimension(TEST_DATA_ELEMENT)

            cy.contains('Add to Columns').click()

            // add a program attribute

            openDimension(TEST_PROGRAM_ATTRIBUTE)

            cy.contains('Add to Columns').click()

            const expectedSelectedMainDimensions = [
                'Last updated on',
                'Created by',
                'Last updated by',
            ]

            const expectedSelectedProgramDimensions = [
                'Event status',
                'Program status',
                program.defaultStage[DIMENSION_ID_ENROLLMENT_DATE], // because both stages has the same name for this
            ]

            const expectedUnselectedDimensions = [
                program.defaultStage[DIMENSION_ID_EVENT_DATE],
            ]

            if (scheduledDateIsSupported) {
                expectedUnselectedDimensions.push(
                    program.defaultStage[DIMENSION_ID_SCHEDULED_DATE]
                )
            }

            expectedSelectedMainDimensions.forEach((dimension) =>
                clickAddRemoveMainDimension(dimension)
            )
            expectedSelectedProgramDimensions
                .concat(expectedUnselectedDimensions)
                .forEach((dimension) =>
                    clickAddRemoveProgramDimension(dimension)
                )

            // switch stage

            openInputSidebar()

            cy.getBySel('stage-select').click()

            cy.contains(program.stage.stageName).click()

            programDimensionsIsEnabled()

            openProgramDimensionsSidebar()

            assertDimensionsForEventWithProgramSelected(
                TEST_PROGRAM.stage,
                scheduledDateIsSupported
            )

            // assert that the DE was removed but the PA remained

            expectedSelectedMainDimensions
                .concat(expectedSelectedProgramDimensions)
                .concat(TEST_PROGRAM_ATTRIBUTE)
                .concat(program.stage[DIMENSION_ID_EVENT_DATE])
                .concat('Organisation unit')
                .forEach((dimension) => {
                    cy.getBySel('columns-axis')
                        .findBySelLike('layout-chip')
                        .contains(dimension)
                        .should('be.visible')
                })

            expectedUnselectedDimensions
                .concat(TEST_DATA_ELEMENT)
                .forEach((dimension) => {
                    cy.getBySel('columns-axis')
                        .findBySelLike('layout-chip')
                        .contains(dimension)
                        .should('not.exist')
                })

            // switch program

            openInputSidebar()

            cy.getBySel('program-dimensions-program-select').click()

            cy.contains(E2E_PROGRAM.programName).click()

            // assert that everything except the main dimensions and ou remain

            expectedSelectedMainDimensions
                .concat('Organisation unit')
                .forEach((dimension) => {
                    cy.getBySel('columns-axis')
                        .findBySelLike('layout-chip')
                        .contains(dimension)
                        .should('be.visible')
                })

            expectedUnselectedDimensions
                .concat(expectedSelectedProgramDimensions)
                .concat(TEST_PROGRAM_ATTRIBUTE)
                .concat(program.stage[DIMENSION_ID_EVENT_DATE])
                .concat(TEST_DATA_ELEMENT)
                .forEach((dimension) => {
                    cy.getBySel('columns-axis')
                        .findBySelLike('layout-chip')
                        .contains(dimension)
                        .should('not.exist')
                })
        })
    })

    describe('enrollment', () => {
        const trackerProgram = TEST_PROGRAM

        beforeEach(() => {
            cy.getBySel('input-enrollment').click()
        })

        it('program can be selected and changed', () => {
            assertDimensionsForEnrollmentWithoutProgramSelected()

            programDimensionsIsDisabled()

            // select program

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            cy.contains(trackerProgram.programName).click()

            openProgramDimensionsSidebar()

            cy.getBySel('program-dimensions-list', EXTENDED_TIMEOUT)
                .findBySelLike('dimension-item')
                .its('length')
                .should('be.gte', 1)

            assertDimensionsForEnrollmentWithProgramSelected(
                trackerProgram.defaultStage
            )

            // add main and time dimensions

            const expectedSelectedDimensions = [
                'Last updated on',
                'Created by',
                'Last updated by',
            ]

            const expectedUnselectedDimensions = [
                'Program status',
                trackerProgram.defaultStage[DIMENSION_ID_ENROLLMENT_DATE],
            ]

            expectedSelectedDimensions.forEach((dimension) =>
                clickAddRemoveMainDimension(dimension)
            )
            expectedUnselectedDimensions.forEach((dimension) =>
                clickAddRemoveProgramDimension(dimension)
            )

            // change program

            openInputSidebar()

            cy.getBySel('input-event').click()

            cy.getBySel('accessory-sidebar').contains('Choose a program')

            programDimensionsIsDisabled()

            assertDimensionsForEnrollmentWithoutProgramSelected()

            // assert dimensions in layout after program is changed

            expectedSelectedDimensions
                .concat('Organisation unit')
                .forEach((dimension) => {
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

        it('stage can be selected, dimension list reflects the selection', () => {
            // select Child programme
            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()
            cy.contains('Child Programme').click()

            // select data element
            cy.getBySel('program-dimensions-button').click()
            cy.getBySel('accessory-sidebar').contains('All types').click()
            cy.getBySel('dhis2-uicore-popper')
                .containsExact('Data element')
                .click()

            // items from multiple stages are shown
            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .contains('MCH ARV at birth')
                .should('be.visible')
            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .contains('MCH DPT dose')
                .should('be.visible')

            // select a specific stage
            cy.getBySel('stage-select').click()
            cy.getBySel('dhis2-uicore-popper').containsExact('Birth').click()

            // only items from the selected stage are shown
            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .contains('MCH ARV at birth')
                .should('be.visible')
            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .contains('MCH DPT dose')
                .should('not.exist')
        })
    })
    describe(['>=41'], 'tracked entity', () => {
        it('stage can be selected, dimension list reflects the selection', () => {
            selectTrackedEntityWithType('Person')

            // select child programme
            openProgramDimensionsSidebar()
            selectProgramForTE('Child Programme')

            // select data element
            cy.getBySel('accessory-sidebar').contains('All types').click()
            cy.getBySel('dhis2-uicore-popper')
                .containsExact('Data element')
                .click()

            // items from multiple stages are shown
            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .contains('MCH ARV at birth')
                .should('be.visible')
            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .contains('MCH DPT dose')
                .should('be.visible')

            // select a specific stage
            cy.getBySel('stage-select').click()
            cy.getBySel('dhis2-uicore-popper').containsExact('Birth').click()

            // only items from the selected stage are shown
            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .contains('MCH ARV at birth')
                .should('be.visible')
            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .contains('MCH DPT dose')
                .should('not.exist')
        })
    })
    describe('lazy loading', () => {
        it('loads more pages when scrolling down until last one is found', () => {
            const getList = () => cy.getBySel('program-dimensions-list')
            const getListChildren = () => getList().find('div[role="button"]')
            const shouldLoadMoreItems = (nextListLength) => {
                cy.getBySel('dimensions-list-load-more').should('exist')
                // The loader is appended below the "viewport" so we need another scroll
                getList().scrollTo('bottom')
                cy.getBySel('dimensions-list-load-more').should('be.visible')
                getListChildren().should('have.length', nextListLength)
            }

            goToStartPage()
            selectEventWithProgram({
                programName:
                    'Malaria case diagnosis, treatment and investigation',
            })
            programDimensionsIsEnabled()
            cy.getBySel('program-dimensions-button').click()

            getListChildren().should('have.length', 50)

            // Subsequent pages should be fetched when scrolling down
            getList().scrollTo('bottom')
            shouldLoadMoreItems(100)

            // This is the last page with only 6 items
            getList().scrollTo('bottom')
            shouldLoadMoreItems(106)

            // Nothing should happen once the end has been reached
            getList().scrollTo('bottom')
            cy.getBySel('dimensions-list-load-more').should('not.exist')
            getListChildren().should('have.length', 106)
        })
    })
}

describe(['>=39'], 'program dimensions', () => {
    beforeEach(() => {
        goToStartPage()
        cy.getBySel('main-sidebar', EXTENDED_TIMEOUT).should('be.visible')
    })

    runTests({ scheduledDateIsSupported: true })
})

describe(['<39'], 'program dimensions', () => {
    beforeEach(() => {
        goToStartPage()
        cy.getBySel('main-sidebar', EXTENDED_TIMEOUT).should('be.visible')
    })

    runTests()
})

describe('counting selection', () => {
    beforeEach(() => {
        goToStartPage()
        cy.getBySel('main-sidebar', EXTENDED_TIMEOUT).should('be.visible')
    })

    const verifyProgramDimensionsCount = (amount) =>
        cy.getBySel('program-dimensions-button').contains(amount)

    it('counts selection in enrollment correctly', () => {
        verifyProgramDimensionsCount(1)

        selectEnrollmentWithProgramDimensions({
            programName: 'Child Programme',
            dimensions: [
                'MCH Infant Feeding', // first duplicate, which can be found by the data element name. full id: A03MvHHogjR.X8zyunlgUfM
                'Baby Postnatal', // second duplicate, which can be found by the stage name. full id: ZzYYXq4fJie.X8zyunlgUfM
                'MCH Infant HIV Test Result',
            ],
        })

        verifyProgramDimensionsCount(4)

        const programDimensions = [
            'Program status',
            'Date of enrollment',
            'Date of birth',
        ]
        programDimensions.forEach((dimension) =>
            clickAddRemoveProgramDimension(dimension)
        )

        verifyProgramDimensionsCount(7)

        const mainDimensions = [
            'Last updated on',
            'Created by',
            'Last updated by',
        ]
        mainDimensions.forEach((dimension) =>
            clickAddRemoveMainDimension(dimension)
        )

        verifyProgramDimensionsCount(7)

        expectAxisToHaveDimension(AXIS_ID_COLUMNS, 'A03MvHHogjR.X8zyunlgUfM') // MCH Infant Feeding Birth,
        expectAxisToHaveDimension(AXIS_ID_COLUMNS, 'ZzYYXq4fJie.X8zyunlgUfM') // MCH Infant Feeding Baby Postnatal,
    })
})

// TODO: add tests for search, type filtering and selecting dimensions
