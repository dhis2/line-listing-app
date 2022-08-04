import { DIMENSION_ID_ENROLLMENT_DATE } from '../../src/modules/dimensionConstants.js'
import { TEST_ENROLLMENT_DATA, TEST_FIXED_PERIODS } from '../data/index.js'
import { selectEnrollmentProgramDimensions } from '../helpers/dimensions.js'
import { selectFixedPeriod } from '../helpers/period.js'
import {
    getTableRows,
    getTableHeaderCells,
    expectTableToBeVisible,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const enrollment = TEST_ENROLLMENT_DATA[0]
const dimensionName = enrollment.dimensions[0]
const periodLabel = enrollment[DIMENSION_ID_ENROLLMENT_DATE]

const setUpTable = () => {
    selectEnrollmentProgramDimensions(enrollment)

    selectFixedPeriod({ label: periodLabel, period: TEST_FIXED_PERIODS[0] })

    cy.getWithDataTest('{menubar}').contains('Update').click()

    expectTableToBeVisible()

    cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)
}

describe('enrollment', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
    })
    it('creates an enrollment line list', () => {
        // check the number of columns
        getTableHeaderCells().its('length').should('equal', 3)

        // check that there is at least 1 row
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
        // move date from "Columns" to "Filter"
        cy.get('#axis-group-1')
            .findWithDataTest('{dimension-menu-button-enrollmentDate}')
            .click()
        cy.contains('Move to Filter').click()

        cy.contains('Update').click()
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
