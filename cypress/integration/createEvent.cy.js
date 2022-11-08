import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_LAST_UPDATED,
    DIMENSION_ID_SCHEDULED_DATE,
} from '../../src/modules/dimensionConstants.js'
import {
    ANALYTICS_PROGRAM,
    TEST_DIM_TEXT,
    TEST_FIX_PE_DEC_LAST_YEAR,
    TEST_REL_PE_THIS_YEAR,
} from '../data/index.js'
import {
    dimensionIsDisabled,
    dimensionIsEnabled,
    selectEventProgramDimensions,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectFixedPeriod, selectRelativePeriod } from '../helpers/period.js'
import {
    getTableRows,
    getTableHeaderCells,
    expectTableToBeVisible,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const runTests = ({ scheduleDateIsSupported } = {}) => {
    it('creates an event line list (tracker program)', () => {
        const event = ANALYTICS_PROGRAM
        const dimensionName = TEST_DIM_TEXT
        const periodLabel =
            event.stages['Stage 1 - Repeatable'][DIMENSION_ID_EVENT_DATE].label

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
        selectEventProgramDimensions({
            programName: event.programName,
            dimensions: [dimensionName],
        })

        // check that the time dimensions disabled states and names are updated correctly

        dimensionIsEnabled('dimension-item-eventDate')
        cy.getBySel('dimension-item-eventDate').contains(
            event.stages['Stage 1 - Repeatable'][DIMENSION_ID_EVENT_DATE].label
        )

        dimensionIsEnabled('dimension-item-enrollmentDate')
        cy.getBySel('dimension-item-enrollmentDate').contains(
            event.stages['Stage 1 - Repeatable'][DIMENSION_ID_ENROLLMENT_DATE]
                .label
        )
        if (scheduleDateIsSupported) {
            dimensionIsEnabled('dimension-item-scheduledDate')
            cy.getBySel('dimension-item-scheduledDate').contains(
                event.stages['Stage 1 - Repeatable'][
                    DIMENSION_ID_SCHEDULED_DATE
                ].label
            )
        }

        dimensionIsEnabled('dimension-item-incidentDate')
        cy.getBySel('dimension-item-incidentDate').contains(
            event.stages['Stage 1 - Repeatable'][DIMENSION_ID_INCIDENT_DATE]
                .label
        )

        dimensionIsEnabled('dimension-item-lastUpdated')
        cy.getBySel('dimension-item-lastUpdated').contains(
            event.stages['Stage 1 - Repeatable'][DIMENSION_ID_LAST_UPDATED]
                .label
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
        const event = {
            programName: 'COVID-19 Event',
            [DIMENSION_ID_EVENT_DATE]: 'Date of Report',
            [DIMENSION_ID_ENROLLMENT_DATE]: 'Enrollment date',
            ...(scheduleDateIsSupported
                ? { [DIMENSION_ID_SCHEDULED_DATE]: 'Scheduled date' }
                : {}),
            [DIMENSION_ID_INCIDENT_DATE]: 'Incident date',
            [DIMENSION_ID_LAST_UPDATED]: 'Last updated on',
        }
        const dimensionName = 'Case Severity'
        const periodLabel = event[DIMENSION_ID_EVENT_DATE]

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
        selectEventProgramDimensions({
            programName: event.programName,
            dimensions: [dimensionName],
        })

        // check that the time dimensions disabled states and names are updated correctly

        dimensionIsEnabled('dimension-item-eventDate')
        cy.getBySel('dimension-item-eventDate').contains(
            event[DIMENSION_ID_EVENT_DATE]
        )

        dimensionIsDisabled('dimension-item-enrollmentDate')
        cy.getBySel('dimension-item-enrollmentDate').contains(
            event[DIMENSION_ID_ENROLLMENT_DATE]
        )
        if (scheduleDateIsSupported) {
            dimensionIsDisabled('dimension-item-scheduledDate')
            cy.getBySel('dimension-item-scheduledDate').contains(
                event[DIMENSION_ID_SCHEDULED_DATE]
            )
        }

        dimensionIsDisabled('dimension-item-incidentDate')
        cy.getBySel('dimension-item-incidentDate').contains(
            event[DIMENSION_ID_INCIDENT_DATE]
        )

        dimensionIsEnabled('dimension-item-lastUpdated')
        cy.getBySel('dimension-item-lastUpdated').contains(
            event[DIMENSION_ID_LAST_UPDATED]
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
        const event = ANALYTICS_PROGRAM
        const dimensionName = TEST_DIM_TEXT
        const periodLabel =
            event.stages['Stage 1 - Repeatable'][DIMENSION_ID_EVENT_DATE].label

        selectEventProgramDimensions({ ...event, dimensions: [dimensionName] })

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
        cy.visit('/', EXTENDED_TIMEOUT)
        cy.getBySel('main-sidebar', EXTENDED_TIMEOUT)
    })
    runTests({ scheduleDateIsSupported: true })
})

describe(['<39'], 'event', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        cy.getBySel('main-sidebar', EXTENDED_TIMEOUT)
    })
    runTests()
})
