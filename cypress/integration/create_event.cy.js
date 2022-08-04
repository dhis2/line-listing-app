import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import { TEST_EVENT_DATA, TEST_FIXED_PERIODS } from '../data/index.js'
import { selectEventProgramDimensions } from '../helpers/dimensions.js'
import { selectFixedPeriod } from '../helpers/period.js'
import {
    getTableRows,
    getTableHeaderCells,
    expectTableToBeVisible,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const event = TEST_EVENT_DATA[0]
const dimensionName = event.dimensions[0]
const periodLabel = event[DIMENSION_ID_EVENT_DATE]

const setUpTable = () => {
    selectEventProgramDimensions(event)

    selectFixedPeriod({ label: periodLabel, period: TEST_FIXED_PERIODS[0] })

    cy.getWithDataTest('{menubar}').contains('Update').click()

    expectTableToBeVisible()

    cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)
}

describe('event', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
    })

    it('creates an event line list', () => {
        // check the correct number of columns
        getTableHeaderCells().its('length').should('equal', 3)

        // check that there is at least 1 row in the table
        getTableRows().its('length').should('be.gte', 1)

        // check the column headers in the table
        getTableHeaderCells().contains('Organisation unit').should('be.visible')
        getTableHeaderCells().contains(dimensionName).should('be.visible')
        getTableHeaderCells().contains(periodLabel).should('be.visible')

        //check the chips in the layout
        cy.get('#axis-group-1')
            .findBySelLike('layout-chip')
            .contains('Organisation unit: 1 selected')
            .should('be.visible')

        cy.get('#axis-group-1')
            .findBySelLike('layout-chip')
            .contains(`${dimensionName}: all`)
            .should('be.visible')

        cy.get('#axis-group-1')
            .findBySelLike('layout-chip')
            .contains(`${periodLabel}: 1 selected`)
            .should('be.visible')
    })

    it('moves a dimension to filter', () => {
        // move Report date from "Columns" to "Filter"
        cy.get('#axis-group-1')
            .findBySelLike('layout-chip')
            .findWithDataTest('{dimension-menu-button-eventDate}')
            .click()
        cy.contains('Move to Filter').click()
        cy.getWithDataTest('{menubar}').contains('Update').click()

        // check the number of columns
        getTableHeaderCells().its('length').should('equal', 2)

        // check that there is at least 1 row in the table
        getTableRows().its('length').should('be.gte', 1)

        // check the column headers in the table
        getTableHeaderCells().contains('Organisation unit').should('be.visible')
        getTableHeaderCells().contains(dimensionName).should('be.visible')
        getTableHeaderCells().contains(periodLabel).should('not.exist')

        //check the chips in the layout
        cy.get('#axis-group-1')
            .findBySelLike('layout-chip')
            .contains('Organisation unit: 1 selected')
            .should('be.visible')

        cy.get('#axis-group-1')
            .findBySelLike('layout-chip')
            .contains(`${dimensionName}: all`)
            .should('be.visible')

        cy.get('#axis-group-2')
            .findBySelLike('layout-chip')
            .contains(`${periodLabel}: 1 selected`)
            .should('be.visible')
    })
})
