import {
    selectProgramDimensions,
    INPUT_EVENT,
    selectPeriod,
    FIXED,
    getPreviousYearStr,
    getLineListTable,
} from '../helpers/index.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const dimensionName = 'MCH Apgar Score'
const periodLabel = 'Report date'

const setUpTable = () => {
    selectProgramDimensions({
        inputType: INPUT_EVENT,
        programName: 'Child Programme',
        stageName: 'Birth',
        dimensions: [dimensionName],
    })

    selectPeriod({
        periodLabel: periodLabel,
        category: FIXED,
        period: {
            type: 'Daily',
            year: `${getPreviousYearStr()}`,
            name: `${getPreviousYearStr()}-01-01`,
        },
    })

    cy.getWithDataTest('{menubar}').contains('Update').click()

    getLineListTable().find('tbody').should('be.visible')

    cy.getWithDataTest('{layout-chip}').contains(`${dimensionName}: all`)
}

describe('event', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
    })

    it('creates an event line list', () => {
        // check the correct number of columns
        getLineListTable().find('th').its('length').should('equal', 3)

        // check that there is at least 1 row in the table
        getLineListTable()
            .find('tbody')
            .find('tr')
            .its('length')
            .should('be.gte', 1)

        // check the column headers in the table
        getLineListTable()
            .find('th')
            .contains('Organisation unit')
            .should('be.visible')
        getLineListTable()
            .find('th')
            .contains(dimensionName)
            .should('be.visible')
        getLineListTable().find('th').contains(periodLabel).should('be.visible')

        //check the chips in the layout
        cy.get('#axis-group-1')
            .findWithDataTest('{layout-chip}')
            .contains('Organisation unit: 1 selected')
            .should('be.visible')

        cy.get('#axis-group-1')
            .findWithDataTest('{layout-chip}')
            .contains(`${dimensionName}: all`)
            .should('be.visible')

        cy.get('#axis-group-1')
            .findWithDataTest('{layout-chip}')
            .contains(`${periodLabel}: 1 selected`)
            .should('be.visible')
    })

    it('moves a dimension to filter', () => {
        // move Report date from "Columns" to "Filter"
        cy.get('#axis-group-1')
            .findWithDataTest('{layout-chip}')
            .findWithDataTest('{dimension-menu-button-eventDate}')
            .click()
        cy.contains('Move to Filter').click()
        cy.getWithDataTest('{menubar}').contains('Update').click()

        // check the number of columns
        getLineListTable().find('th').its('length').should('equal', 2)

        // check that there is at least 1 row in the table
        getLineListTable()
            .find('tbody')
            .find('tr')
            .its('length')
            .should('be.gte', 1)

        // check the column headers in the table
        getLineListTable()
            .find('th')
            .contains('Organisation unit')
            .should('be.visible')
        getLineListTable()
            .find('th')
            .contains(dimensionName)
            .should('be.visible')
        getLineListTable().find('th').contains(periodLabel).should('not.exist')

        //check the chips in the layout
        cy.get('#axis-group-1')
            .findWithDataTest('{layout-chip}')
            .contains('Organisation unit: 1 selected')
            .should('be.visible')

        cy.get('#axis-group-1')
            .findWithDataTest('{layout-chip}')
            .contains(`${dimensionName}: all`)
            .should('be.visible')

        cy.get('#axis-group-2')
            .findWithDataTest('{layout-chip}')
            .contains(`${periodLabel}: 1 selected`)
            .should('be.visible')
    })
})
