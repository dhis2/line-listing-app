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
import { selectEventWithProgramDimensions } from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectFixedPeriod, selectRelativePeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    getTableRows,
    getTableHeaderCells,
    expectTableToBeVisible,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const runTests = ({ scheduledDateIsSupported } = {}) => {
    it('creates an event line list (tracker program)', () => {
        cy.setTestDescription(
            'Ensures that an event line list can be created using a tracker program with specified dimensions and periods.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'EventLineList' },
            { key: 'type', value: 'TrackerProgram' },
        ])
        const eventProgram = E2E_PROGRAM
        const dimensionName = TEST_DIM_TEXT
        const periodLabel = eventProgram[DIMENSION_ID_EVENT_DATE]

        cy.getBySel('dimension-item-lastUpdated').contains(
            eventProgram[DIMENSION_ID_LAST_UPDATED]
        )

        // select program
        selectEventWithProgramDimensions({
            ...eventProgram,
            dimensions: [dimensionName],
        })

        // check that the time dimensions are shown with the correct names
        cy.getBySel('dimension-item-eventDate').contains(
            eventProgram[DIMENSION_ID_EVENT_DATE]
        )

        cy.getBySel('dimension-item-enrollmentDate').contains(
            eventProgram[DIMENSION_ID_ENROLLMENT_DATE]
        )
        if (scheduledDateIsSupported) {
            cy.getBySel('dimension-item-scheduledDate').contains(
                eventProgram[DIMENSION_ID_SCHEDULED_DATE]
            )
        }

        cy.getBySel('dimension-item-incidentDate').contains(
            eventProgram[DIMENSION_ID_INCIDENT_DATE]
        )

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
        cy.setTestDescription(
            'Validates the creation of an event line list using an event program with appropriate dimensions.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'EventLineList' },
            { key: 'type', value: 'EventProgram' },
        ])
        const eventProgram = {
            programName: 'Inpatient morbidity and mortality',
            [DIMENSION_ID_EVENT_DATE]: 'Report date',
            [DIMENSION_ID_ENROLLMENT_DATE]: 'Enrollment date',
            ...(scheduledDateIsSupported
                ? { [DIMENSION_ID_SCHEDULED_DATE]: 'Scheduled date' }
                : {}),
            [DIMENSION_ID_INCIDENT_DATE]: 'Date of Discharge',
            [DIMENSION_ID_LAST_UPDATED]: 'Last updated on',
        }
        const dimensionName = 'Mode of Discharge'
        const periodLabel = eventProgram[DIMENSION_ID_EVENT_DATE]

        cy.getBySel('dimension-item-lastUpdated').contains('Last updated on')

        // select program
        selectEventWithProgramDimensions({
            ...eventProgram,
            dimensions: [dimensionName],
        })

        // check that the time dimensions are shown with the correct names

        cy.getBySel('dimension-item-eventDate').contains(
            eventProgram[DIMENSION_ID_EVENT_DATE]
        )

        cy.getBySel('dimension-item-enrollmentDate').should('not.exist')

        if (scheduledDateIsSupported) {
            cy.getBySel('dimension-item-scheduledDate').should('not.exist')
        }

        cy.getBySel('dimension-item-incidentDate').should('not.exist')

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
        cy.setTestDescription(
            'Checks the functionality of moving a dimension to the filter section in an event line list.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'EventLineList' },
            { key: 'action', value: 'MoveDimensionToFilter' },
        ])
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
    runTests({ scheduledDateIsSupported: true })
})

describe(['<39'], 'event', () => {
    beforeEach(() => {
        goToStartPage()
        cy.getBySel('main-sidebar', EXTENDED_TIMEOUT)
    })
    runTests()
})
