import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_LAST_UPDATED,
} from '../../src/modules/dimensionConstants.js'
import {
    clickAddRemoveProgramDataDimension,
    clickAddRemoveTrackedEntityTypeDimensions,
    openProgramDimensionsSidebar,
    selectProgramForTE,
    selectTrackedEntityWithType,
} from '../helpers/dimensions.js'
import { assertChipContainsText } from '../helpers/layout.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectFixedPeriod, getCurrentYearStr } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import { expectTableToBeVisible } from '../helpers/table.js'

const program = {
    programName: 'Child Programme',
    [DIMENSION_ID_ENROLLMENT_DATE]: 'Date of enrollment',
    [DIMENSION_ID_INCIDENT_DATE]: 'Date of birth',
    [DIMENSION_ID_LAST_UPDATED]: 'Last updated on',
    id: 'IpHINAT79UW',
}
const entityDimensionName = 'City'
const programDataDimensionName = 'MCH Infant Weight (g)'
const periodLabel = program[DIMENSION_ID_ENROLLMENT_DATE]

describe(['>=41'], 'tracked entity', () => {
    beforeEach(() => {
        goToStartPage()
    })
    it('creates a line list with dimensions', () => {
        setUpTable()
    })
    it('creates a line list without dimensions', () => {
        selectTrackedEntityWithType('Person')
        clickMenubarUpdateButton()
        expectTableToBeVisible()
    })
    //runTests()
})

describe(['<41'], 'tracked entity', () => {
    it("is hidden and doesn't show up", () => {
        goToStartPage()
        cy.getBySel('tracked-entity-button').should('not.exist')
        cy.getBySel('input-tracked-entity').should('not.exist')
    })
})

const setUpTable = () => {
    cy.getBySel('tracked-entity-button').should('not.exist')
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
    cy.getBySel('tracked-entity-dimensions-list')
        .children()
        .should('have.length', 33)
    clickAddRemoveTrackedEntityTypeDimensions(entityDimensionName)

    // select a program and add program dimensions
    openProgramDimensionsSidebar()

    selectProgramForTE(program.programName)

    // Check the correct time dimensions are displayed, and with program/stage specific name
    cy.getBySel(`dimension-item-${program.id}.enrollmentDate`).contains(
        program[DIMENSION_ID_ENROLLMENT_DATE]
    )
    cy.getBySel(`dimension-item-${program.id}.incidentDate`).contains(
        program[DIMENSION_ID_INCIDENT_DATE]
    )
    cy.getBySel('dimension-item-lastUpdated').contains(
        program[DIMENSION_ID_LAST_UPDATED]
    )
    cy.getBySel('dimension-item-eventDate').should('not.exist')
    cy.getBySel('dimension-item-scheduledDate').should('not.exist')

    // Add a program data dimension
    clickAddRemoveProgramDataDimension(programDataDimensionName)

    // Adding time dimensions
    const firstQuarterThisYear = {
        type: 'Quarterly',
        year: getCurrentYearStr(),
        name: `January - March ${getCurrentYearStr()}`,
    }
    const secondQuarterThisYear = {
        type: 'Quarterly',
        year: getCurrentYearStr(),
        name: `April - June ${getCurrentYearStr()}`,
    }

    // Add the first time dimension
    selectFixedPeriod({
        label: periodLabel,
        period: firstQuarterThisYear,
    })

    // Check the time dimension chip and tooltip content
    cy.getBySelLike('layout-chip').contains(periodLabel).trigger('mouseover')
    cy.getBySel('layout-chip-tooltip-content').contains(
        firstQuarterThisYear.name
    )
    cy.getBySelLike('layout-chip').contains(periodLabel).trigger('mouseout')
    cy.getBySel('layout-chip-tooltip-content').should('not.exist')

    // Add another time dimension
    selectFixedPeriod({
        label: periodLabel,
        period: secondQuarterThisYear,
        selected: firstQuarterThisYear,
    })

    // Check the time dimension chip and tooltip content for the new content
    cy.getBySelLike('layout-chip').contains(periodLabel).trigger('mouseover')
    cy.getBySel('layout-chip-tooltip-content').contains(
        `Program: ${program.programName}`
    )
    cy.getBySel('layout-chip-tooltip-content').contains(
        firstQuarterThisYear.name
    )
    cy.getBySel('layout-chip-tooltip-content').contains(
        secondQuarterThisYear.name
    )
    cy.getBySelLike('layout-chip').contains(periodLabel).trigger('mouseout')
    cy.getBySel('layout-chip-tooltip-content').should('not.exist')

    // Go back to person dimensions to verify that they're still listed properly
    cy.getBySel('main-sidebar').contains('Person dimensions').click()
    cy.getBySel('tracked-entity-dimensions-list')
        .children()
        .should('have.length', 33)

    clickMenubarUpdateButton()

    expectTableToBeVisible()

    assertChipContainsText(entityDimensionName, 'all')
}

// const runTests = () => {
//     it('creates an tracked entity line list', () => {
//         // check the number of columns
//         getTableHeaderCells().its('length').should('equal', 3)

//         // check that there is at least 1 row
//         getTableRows().its('length').should('be.gte', 1)

//         // check the column headers in the table
//         getTableHeaderCells().contains('Organisation unit').should('be.visible')
//         getTableHeaderCells().contains(entityDimensionName).should('be.visible')
//         getTableHeaderCells().contains(periodLabel).should('be.visible')

//         //check the chips in the layout
//         assertChipContainsText('Organisation unit', 1)

//         assertChipContainsText(entityDimensionName, 'all')

//         assertChipContainsText(periodLabel, 1)
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
//         getTableHeaderCells().contains(entityDimensionName).should('be.visible')
//         getTableHeaderCells().contains(periodLabel).should('not.exist')

//         //check the chips in the layout
//         assertChipContainsText('Organisation unit', 1)
//         assertChipContainsText(entityDimensionName, 'all')
//         assertChipContainsText(periodLabel, 1)
//     })
// }
