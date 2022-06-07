import {
    selectProgramDimensions,
    INPUT_ENROLLMENT,
    selectPeriod,
    RELATIVE,
    getLineListTable,
} from '../helpers/index.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const dimensionName = 'BCG doses'
const periodLabel = 'Date of enrollment'

const setUpTable = () => {
    selectProgramDimensions({
        inputType: INPUT_ENROLLMENT,
        programName: 'Child Programme',
        dimensions: [dimensionName],
    })

    selectPeriod({
        periodLabel,
        category: RELATIVE,
        period: {
            type: 'Months',
            name: 'Last 12 months',
        },
    })

    cy.getWithDataTest('{menubar}').contains('Update').click()

    cy.getWithDataTest('{line-list-table}', EXTENDED_TIMEOUT)
        .find('tbody')
        .should('be.visible')

    cy.getWithDataTest('{layout-chip}').contains(`${dimensionName}: all`)
}

describe('enrollment', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
    })
    it('creates an enrollment line list', () => {
        // check the number of columns
        getLineListTable().find('th').its('length').should('equal', 3)

        // check that there is at least 1 row
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
        // move date from "Columns" to "Filter"
        cy.get('#axis-group-1')
            .findWithDataTest('{dimension-menu-button-enrollmentDate}')
            .click()
        cy.contains('Move to Filter').click()

        cy.contains('Update').click()
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
