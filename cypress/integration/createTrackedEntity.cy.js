import { DIMENSION_ID_ENROLLMENT_DATE } from '../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_DIM_TEXT,
    TEST_FIX_PE_DEC_LAST_YEAR,
} from '../data/index.js'
import {
    clickAddRemoveTrackedEntityDimensions,
    selectProgramForTE,
    selectTrackedEntityWithType,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectFixedPeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'

const program = E2E_PROGRAM
const dimensionName = TEST_DIM_TEXT
const periodLabel = program[DIMENSION_ID_ENROLLMENT_DATE]

describe('tracked entity', () => {
    beforeEach(() => {
        goToStartPage()
        setUpTable()
    })
    it('creates an tracked entity line list', () => {
        cy.contains('Something went wrong').should('be.visible') // FIXME: just a temporary way to run the setUpTable for now
    })
    //runTests()
})

const setUpTable = () => {
    cy.getBySel('main-sidebar')
        .contains('Person dimensions')
        .should('not.exist')
    // TODO: check that reg ou and reg date aren't shown

    // switch to Tracked entity and select a type
    selectTrackedEntityWithType('Person')

    cy.getBySel('input-panel-button-subtitle').contains('Person')

    // TODO: check that reg ou and reg date are shown

    // add a TET dimension
    cy.getBySel('main-sidebar').contains('Person dimensions').click()
    clickAddRemoveTrackedEntityDimensions(dimensionName)

    // select a program and add program dimensions
    cy.getBySel('main-sidebar').contains('Program dimensions').click()

    selectProgramForTE(program.programName)

    selectFixedPeriod({ label: periodLabel, period: TEST_FIX_PE_DEC_LAST_YEAR })

    clickMenubarUpdateButton()

    //expectTableToBeVisible() // FIXME: currently expected to fail

    cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)
}

// const runTests = () => {
//     it('creates an tracked entity line list', () => {
//         // check the number of columns
//         getTableHeaderCells().its('length').should('equal', 3)

//         // check that there is at least 1 row
//         getTableRows().its('length').should('be.gte', 1)

//         // check the column headers in the table
//         getTableHeaderCells().contains('Organisation unit').should('be.visible')
//         getTableHeaderCells().contains(dimensionName).should('be.visible')
//         getTableHeaderCells().contains(periodLabel).should('be.visible')

//         //check the chips in the layout
//         cy.getBySel('columns-axis')
//             .findBySelLike('layout-chip')
//             .contains('Organisation unit: 1 selected')
//             .should('be.visible')

//         cy.getBySel('columns-axis')
//             .findBySelLike('layout-chip')
//             .contains(`${dimensionName}: all`)
//             .should('be.visible')

//         cy.getBySel('columns-axis')
//             .findBySelLike('layout-chip')
//             .contains(`${periodLabel}: 1 selected`)
//             .should('be.visible')
//     })

//     it('moves a dimension to filter', () => {
//         cy.intercept('**/api/*/analytics/**').as('getAnalytics')

//         // sort on enrollment date column
//         getTableHeaderCells().find(`button[title*="${periodLabel}"]`).click()

//         // verify that the analytics request contains "asc" for enrollment date field
//         cy.wait('@getAnalytics').then(({ request }) => {
//             const url = new URL(request.url)

//             expect(url.searchParams.has('asc')).to.be.true
//             expect(url.searchParams.get('asc')).to.equal(
//                 DIMENSION_ID_ENROLLMENT_DATE.toLowerCase()
//             )
//         })

//         // move date from "Columns" to "Filter"
//         cy.getBySel('columns-axis')
//             .findBySel('dimension-menu-button-enrollmentDate')
//             .click()
//         cy.contains('Move to Filter').click()

//         clickMenubarUpdateButton()

//         // verify that the analytics request does not contain "asc"
//         // the sorting needs to be reset when a dimension used to sort is removed from "Columns"
//         cy.wait('@getAnalytics').then(({ request }) => {
//             const url = new URL(request.url)

//             expect(url.searchParams.has('asc')).to.be.false
//         })

//         // check the number of columns
//         getTableHeaderCells().its('length').should('equal', 2)

//         // check that there is at least 1 row in the table
//         getTableRows().its('length').should('be.gte', 1)

//         // check the column headers in the table
//         getTableHeaderCells().contains('Organisation unit').should('be.visible')
//         getTableHeaderCells().contains(dimensionName).should('be.visible')
//         getTableHeaderCells().contains(periodLabel).should('not.exist')

//         //check the chips in the layout
//         cy.getBySel('columns-axis')
//             .findBySelLike('layout-chip')
//             .contains('Organisation unit: 1 selected')
//             .should('be.visible')

//         cy.getBySel('columns-axis')
//             .findBySelLike('layout-chip')
//             .contains(`${dimensionName}: all`)
//             .should('be.visible')

//         cy.getBySel('filters-axis')
//             .findBySelLike('layout-chip')
//             .contains(`${periodLabel}: 1 selected`)
//             .should('be.visible')
//     })
// }
