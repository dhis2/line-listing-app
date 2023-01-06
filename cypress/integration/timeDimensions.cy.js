import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_LAST_UPDATED,
    DIMENSION_ID_SCHEDULED_DATE,
} from '../../src/modules/dimensionConstants.js'
import { E2E_PROGRAM, TEST_REL_PE_THIS_YEAR } from '../data/index.js'
import {
    dimensionIsDisabled,
    dimensionIsEnabled,
    selectEventWithProgram,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    getTableRows,
    getTableHeaderCells,
    expectTableToBeVisible,
} from '../helpers/table.js'

const trackerProgram = E2E_PROGRAM

const assertTimeDimension = (dimension) => {
    it(`${dimension.id} shows the correct title in layout and table header`, () => {
        selectEventWithProgram(trackerProgram)
        const label = trackerProgram[dimension.id]
        selectRelativePeriod({ label, period: TEST_REL_PE_THIS_YEAR })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        // check the correct number of columns
        getTableHeaderCells().its('length').should('equal', 2)

        // check the correct number of rows
        getTableRows().should('have.length', dimension.rowsLength)

        // check the label in the column header
        getTableHeaderCells().contains(label).should('be.visible')

        //check the chip in the layout
        cy.getBySel('columns-axis')
            .findBySelLike('layout-chip')
            .contains(`${label}: 1 selected`)
            .should('be.visible')
    })
}

describe(['>37', '<39'], 'time dimensions', () => {
    beforeEach(() => {
        goToStartPage()
    })

    // Note: The rowsLengths needs to be updated when events are changed or added to the database
    const timeDimensions = [
        { id: DIMENSION_ID_EVENT_DATE, rowsLength: 7 },
        { id: DIMENSION_ID_ENROLLMENT_DATE, rowsLength: 12 },
        { id: DIMENSION_ID_INCIDENT_DATE, rowsLength: 12 },
        { id: DIMENSION_ID_LAST_UPDATED, rowsLength: 11 },
    ]

    timeDimensions.forEach((dimension) => {
        assertTimeDimension(dimension)
    })
})

describe(['>=39'], 'time dimensions', () => {
    beforeEach(() => {
        goToStartPage()
    })

    // Note: The rowsLengths needs to be updated when events are changed or added to the database
    const timeDimensions = [
        { id: DIMENSION_ID_EVENT_DATE, rowsLength: 7 },
        { id: DIMENSION_ID_ENROLLMENT_DATE, rowsLength: 13 },
        { id: DIMENSION_ID_INCIDENT_DATE, rowsLength: 13 },
        { id: DIMENSION_ID_LAST_UPDATED, rowsLength: 12 },
        { id: DIMENSION_ID_SCHEDULED_DATE, rowsLength: 7 },
    ]

    timeDimensions.forEach((dimension) => {
        assertTimeDimension(dimension)
    })

    it('scheduled date disabled state is set based on stage setting ', () => {
        const scheduleDateHasTooltip = (tooltip) => {
            cy.getBySelLike('dimension-item-scheduledDate').trigger('mouseover')
            cy.getBySelLike('tooltip-content').contains(tooltip)
        }

        // both are disabled by default
        dimensionIsDisabled('dimension-item-scheduledDate')
        dimensionIsDisabled('dimension-item-incidentDate')
        scheduleDateHasTooltip('No program selected')

        // select a program
        selectEventWithProgram({ programName: 'Child Programme' })

        // scheduled date is still disabled when a program but no stage is selected
        dimensionIsDisabled('dimension-item-scheduledDate')

        // incident date is enabled because Child Programme has show incident date = true
        dimensionIsEnabled('dimension-item-incidentDate')

        cy.getBySelLike('tooltip-content').contains('No stage selected')

        // select a stage which has hideDueDate = false
        cy.getBySel('accessory-sidebar').contains('Stage').click()
        cy.containsExact('Birth').click()

        // schedule date is enabled when a stage that doesn't hide it is selected
        dimensionIsEnabled('dimension-item-scheduledDate')

        // incident date is still enabled, stage is not relevant
        dimensionIsEnabled('dimension-item-incidentDate')

        cy.getBySel('stage-clear-button').click()

        // both are disabled when the stage is cleared
        dimensionIsDisabled('dimension-item-scheduledDate')
        dimensionIsEnabled('dimension-item-incidentDate')
        scheduleDateHasTooltip('No stage selected')

        // select a program with a stage that has hideDueDate = true
        cy.getBySel('program-clear-button').click()

        selectEventWithProgram({
            programName: 'Malaria case diagnosis, treatment and investigation',
        })

        cy.getBySel('accessory-sidebar').contains('Stage').click()
        cy.containsExact('Case outcome').click()

        // schedule date is disabled when a stage that hides it is selected
        dimensionIsDisabled('dimension-item-scheduledDate')
        dimensionIsDisabled('dimension-item-incidentDate')
        scheduleDateHasTooltip('Disabled by the selected program stage')
    })
})
// TODO: add tests for disabling incidentDate per program, e.g. enabled for Analytics program, disabled for HIV Case Surveillance
