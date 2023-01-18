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
    selectEnrollmentProgramDimensions,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectFixedPeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    getTableRows,
    getTableHeaderCells,
    expectTableToBeVisible,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const enrollment = E2E_PROGRAM
const dimensionName = TEST_DIM_TEXT
const periodLabel = enrollment[DIMENSION_ID_ENROLLMENT_DATE]

const setUpTable = ({ scheduledDateIsSupported } = {}) => {
    // switch to Enrollment to toggle the enabled/disabled time dimensions
    cy.getBySel('main-sidebar', EXTENDED_TIMEOUT)
        .contains('Input: Event')
        .click()
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
    selectEnrollmentProgramDimensions({
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
        // move date from "Columns" to "Filter"
        cy.getBySel('columns-axis')
            .findBySel('dimension-menu-button-enrollmentDate')
            .click()
        cy.contains('Move to Filter').click()

        cy.contains('Update').click()
        clickMenubarUpdateButton()

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
