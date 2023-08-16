import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_LAST_UPDATED,
} from '../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_DIM_TEXT,
    TEST_FIX_PE_DEC_LAST_YEAR,
} from '../data/index.js'
import {
    dimensionIsDisabled,
    dimensionIsEnabled,
    selectEnrollmentWithProgramDimensions,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectFixedPeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    getTableRows,
    getTableHeaderCells,
    expectTableToBeVisible,
} from '../helpers/table.js'

const enrollment = E2E_PROGRAM
const dimensionName = TEST_DIM_TEXT
const periodLabel = enrollment[DIMENSION_ID_ENROLLMENT_DATE]

const setUpTable = ({ scheduledDateIsSupported } = {}) => {
    // switch to Enrollment to toggle the enabled/disabled time dimensions
    cy.getBySel('input-enrollment').click()
    cy.getBySel('main-sidebar').contains('Input: Enrollment').click()

    // check that the time dimensions are correctly disabled and named
    dimensionIsDisabled('dimension-item-eventDate')
    cy.getBySel('dimension-item-eventDate').contains('Event date')

    dimensionIsEnabled('dimension-item-enrollmentDate')
    cy.getBySel('dimension-item-enrollmentDate').contains('Enrollment date')

    if (scheduledDateIsSupported) {
        dimensionIsDisabled('dimension-item-scheduledDate')
        cy.getBySel('dimension-item-scheduledDate').contains('Scheduled date')
    }

    dimensionIsDisabled('dimension-item-incidentDate')
    cy.getBySel('dimension-item-incidentDate').contains('Incident date')

    dimensionIsEnabled('dimension-item-lastUpdated')
    cy.getBySel('dimension-item-lastUpdated').contains('Last updated on')

    // select program
    selectEnrollmentWithProgramDimensions({
        ...enrollment,
        dimensions: [dimensionName],
    })

    // check that the time dimensions disabled states and names are updated correctly

    dimensionIsDisabled('dimension-item-eventDate')
    cy.getBySel('dimension-item-eventDate').contains('Event date')

    dimensionIsEnabled('dimension-item-enrollmentDate')
    cy.getBySel('dimension-item-enrollmentDate').contains(
        enrollment[DIMENSION_ID_ENROLLMENT_DATE]
    )

    if (scheduledDateIsSupported) {
        dimensionIsDisabled('dimension-item-scheduledDate')
        cy.getBySel('dimension-item-scheduledDate').contains('Scheduled date')
    }

    dimensionIsEnabled('dimension-item-incidentDate')
    cy.getBySel('dimension-item-incidentDate').contains(
        enrollment[DIMENSION_ID_INCIDENT_DATE]
    )

    dimensionIsEnabled('dimension-item-lastUpdated')
    cy.getBySel('dimension-item-lastUpdated').contains(
        enrollment[DIMENSION_ID_LAST_UPDATED]
    )

    selectFixedPeriod({ label: periodLabel, period: TEST_FIX_PE_DEC_LAST_YEAR })

    clickMenubarUpdateButton()

    expectTableToBeVisible()

    cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)
}

const runTests = () => {
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
        cy.getBySel('columns-axis')
            .findBySelLike('layout-chip')
            .contains('Organisation unit: 1 selected')
            .should('be.visible')

        cy.getBySel('columns-axis')
            .findBySelLike('layout-chip')
            .contains(`${dimensionName}: all`)
            .should('be.visible')

        cy.getBySel('columns-axis')
            .findBySelLike('layout-chip')
            .contains(`${periodLabel}: 1 selected`)
            .should('be.visible')
    })

    it('moves a dimension to filter', () => {
        cy.intercept('**/api/*/analytics/**').as('getAnalytics')

        // sort on enrollment date column
        getTableHeaderCells().find(`button[title*="${periodLabel}"]`).click()

        // verify that the analytics request contains "asc" for enrollment date field
        cy.wait('@getAnalytics').then(({ request }) => {
            const url = new URL(request.url)

            expect(url.searchParams.has('asc')).to.be.true
            expect(url.searchParams.get('asc')).to.equal(
                DIMENSION_ID_ENROLLMENT_DATE.toLowerCase()
            )
        })

        // move date from "Columns" to "Filter"
        cy.getBySel('columns-axis')
            .findBySel('dimension-menu-button-enrollmentDate')
            .click()
        cy.contains('Move to Filter').click()

        clickMenubarUpdateButton()

        // verify that the analytics request does not contain "asc"
        // the sorting needs to be reset when a dimension used to sort is removed from "Columns"
        cy.wait('@getAnalytics').then(({ request }) => {
            const url = new URL(request.url)

            expect(url.searchParams.has('asc')).to.be.false
        })

        // check the number of columns
        getTableHeaderCells().its('length').should('equal', 2)

        // check that there is at least 1 row in the table
        getTableRows().its('length').should('be.gte', 1)

        // check the column headers in the table
        getTableHeaderCells().contains('Organisation unit').should('be.visible')
        getTableHeaderCells().contains(dimensionName).should('be.visible')
        getTableHeaderCells().contains(periodLabel).should('not.exist')

        //check the chips in the layout
        cy.getBySel('columns-axis')
            .findBySelLike('layout-chip')
            .contains('Organisation unit: 1 selected')
            .should('be.visible')

        cy.getBySel('columns-axis')
            .findBySelLike('layout-chip')
            .contains(`${dimensionName}: all`)
            .should('be.visible')

        cy.getBySel('filters-axis')
            .findBySelLike('layout-chip')
            .contains(`${periodLabel}: 1 selected`)
            .should('be.visible')
    })
}

describe(['>=39'], 'enrollment', () => {
    beforeEach(() => {
        goToStartPage()
        setUpTable({ scheduledDateIsSupported: true })
    })
    runTests()
})

describe(['<39'], 'enrollment', () => {
    beforeEach(() => {
        goToStartPage()
        setUpTable()
    })
    runTests()
})
