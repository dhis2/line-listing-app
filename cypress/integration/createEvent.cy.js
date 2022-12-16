import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_LAST_UPDATED,
    DIMENSION_ID_SCHEDULED_DATE,
} from '../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_DIM_TEXT,
    TEST_FIX_PE_DEC_LAST_YEAR,
    TEST_REL_PE_THIS_YEAR,
} from '../data/index.js'
import {
    dimensionIsDisabled,
    dimensionIsEnabled,
    selectEventWithProgramDimensions,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectFixedPeriod, selectRelativePeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    getTableRows,
    getTableHeaderCells,
    expectTableToBeVisible,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const runTests = ({ scheduleDateIsSupported } = {}) => {
    it('creates an event line list (tracker program)', () => {
        const eventProgram = E2E_PROGRAM
        const dimensionName = TEST_DIM_TEXT
        const periodLabel = eventProgram[DIMENSION_ID_EVENT_DATE]

        // check that the time dimensions are correctly disabled and named
        dimensionIsEnabled('dimension-item-eventDate')
        cy.getBySel('dimension-item-eventDate').contains('Event date')

        dimensionIsDisabled('dimension-item-enrollmentDate')
        cy.getBySel('dimension-item-enrollmentDate').contains('Enrollment date')

        if (scheduleDateIsSupported) {
            dimensionIsDisabled('dimension-item-scheduledDate')
            cy.getBySel('dimension-item-scheduledDate').contains(
                'Scheduled date'
            )
        }
        dimensionIsDisabled('dimension-item-incidentDate')
        cy.getBySel('dimension-item-incidentDate').contains('Incident date')

        dimensionIsEnabled('dimension-item-lastUpdated')
        cy.getBySel('dimension-item-lastUpdated').contains('Last updated on')

        // select program
        selectEventWithProgramDimensions({
            ...eventProgram,
            dimensions: [dimensionName],
        })

        // check that the time dimensions disabled states and names are updated correctly

        dimensionIsEnabled('dimension-item-eventDate')
        cy.getBySel('dimension-item-eventDate').contains(
            eventProgram[DIMENSION_ID_EVENT_DATE]
        )

        dimensionIsEnabled('dimension-item-enrollmentDate')
        cy.getBySel('dimension-item-enrollmentDate').contains(
            eventProgram[DIMENSION_ID_ENROLLMENT_DATE]
        )
        if (scheduleDateIsSupported) {
            dimensionIsEnabled('dimension-item-scheduledDate')
            cy.getBySel('dimension-item-scheduledDate').contains(
                eventProgram[DIMENSION_ID_SCHEDULED_DATE]
            )
        }

        dimensionIsEnabled('dimension-item-incidentDate')
        cy.getBySel('dimension-item-incidentDate').contains(
            eventProgram[DIMENSION_ID_INCIDENT_DATE]
        )

        dimensionIsEnabled('dimension-item-lastUpdated')
        cy.getBySel('dimension-item-lastUpdated').contains(
            eventProgram[DIMENSION_ID_LAST_UPDATED]
        )

        selectFixedPeriod({
            label: periodLabel,
            period: TEST_FIX_PE_DEC_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)

        // check the correct number of columns
        getTableHeaderCells().its('length').should('equal', 3)

        // check that there is at least 1 row in the table
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

    it('creates an event line list (event program)', () => {
        const eventProgram = {
            programName: 'Inpatient morbidity and mortality',
            [DIMENSION_ID_EVENT_DATE]: 'Report date',
            [DIMENSION_ID_ENROLLMENT_DATE]: 'Enrollment date',
            ...(scheduleDateIsSupported
                ? { [DIMENSION_ID_SCHEDULED_DATE]: 'Scheduled date' }
                : {}),
            [DIMENSION_ID_INCIDENT_DATE]: 'Date of Discharge',
            [DIMENSION_ID_LAST_UPDATED]: 'Last updated on',
        }
        const dimensionName = 'Mode of Discharge'
        const periodLabel = eventProgram[DIMENSION_ID_EVENT_DATE]

        // check that the time dimensions are correctly disabled and named
        dimensionIsEnabled('dimension-item-eventDate')
        cy.getBySel('dimension-item-eventDate').contains('Event date')

        dimensionIsDisabled('dimension-item-enrollmentDate')
        cy.getBySel('dimension-item-enrollmentDate').contains('Enrollment date')

        if (scheduleDateIsSupported) {
            dimensionIsDisabled('dimension-item-scheduledDate')
            cy.getBySel('dimension-item-scheduledDate').contains(
                'Scheduled date'
            )
        }

        dimensionIsDisabled('dimension-item-incidentDate')
        cy.getBySel('dimension-item-incidentDate').contains('Incident date')

        dimensionIsEnabled('dimension-item-lastUpdated')
        cy.getBySel('dimension-item-lastUpdated').contains('Last updated on')

        // select program
        selectEventWithProgramDimensions({
            ...eventProgram,
            dimensions: [dimensionName],
        })

        // check that the time dimensions disabled states and names are updated correctly

        dimensionIsEnabled('dimension-item-eventDate')
        cy.getBySel('dimension-item-eventDate').contains(
            eventProgram[DIMENSION_ID_EVENT_DATE]
        )

        dimensionIsDisabled('dimension-item-enrollmentDate')
        cy.getBySel('dimension-item-enrollmentDate').contains(
            eventProgram[DIMENSION_ID_ENROLLMENT_DATE]
        )
        if (scheduleDateIsSupported) {
            dimensionIsDisabled('dimension-item-scheduledDate')
            cy.getBySel('dimension-item-scheduledDate').contains(
                eventProgram[DIMENSION_ID_SCHEDULED_DATE]
            )
        }

        dimensionIsDisabled('dimension-item-incidentDate')
        cy.getBySel('dimension-item-incidentDate').contains(
            eventProgram[DIMENSION_ID_INCIDENT_DATE]
        )

        dimensionIsEnabled('dimension-item-lastUpdated')
        cy.getBySel('dimension-item-lastUpdated').contains(
            eventProgram[DIMENSION_ID_LAST_UPDATED]
        )

        selectRelativePeriod({
            label: periodLabel,
            period: TEST_REL_PE_THIS_YEAR,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)

        // check the correct number of columns
        getTableHeaderCells().its('length').should('equal', 3)

        // check that there is at least 1 row in the table
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
        const eventProgram = E2E_PROGRAM
        const dimensionName = TEST_DIM_TEXT
        const periodLabel = eventProgram[DIMENSION_ID_EVENT_DATE]

        selectEventWithProgramDimensions({
            ...eventProgram,
            dimensions: [dimensionName],
        })

        selectFixedPeriod({
            label: periodLabel,
            period: TEST_FIX_PE_DEC_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)

        // move Report date from "Columns" to "Filter"
        cy.getBySel('columns-axis')
            .findBySelLike('layout-chip')
            .findBySel('dimension-menu-button-eventDate')
            .click()
        cy.contains('Move to Filter').click()
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

describe(['>=39'], 'event', () => {
    beforeEach(() => {
        goToStartPage()
        cy.getBySel('main-sidebar', EXTENDED_TIMEOUT)
    })
    runTests({ scheduleDateIsSupported: true })
})

describe(['<39'], 'event', () => {
    beforeEach(() => {
        goToStartPage()
        cy.getBySel('main-sidebar', EXTENDED_TIMEOUT)
    })
    runTests()
})
