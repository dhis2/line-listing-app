import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_LAST_UPDATED,
    DIMENSION_ID_SCHEDULED_DATE,
} from '../../src/modules/dimensionConstants.js'
import { ANALYTICS_PROGRAM, TEST_REL_PE_THIS_YEAR } from '../data/index.js'
import {
    dimensionIsDisabled,
    dimensionIsEnabled,
    selectEventProgram,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod } from '../helpers/period.js'
import {
    getTableRows,
    getTableHeaderCells,
    expectTableToBeVisible,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const event = ANALYTICS_PROGRAM
const timeDimensions = [
    { id: DIMENSION_ID_EVENT_DATE, rowsLength: 6 },
    { id: DIMENSION_ID_ENROLLMENT_DATE, rowsLength: 4 },
    { id: DIMENSION_ID_SCHEDULED_DATE, rowsLength: 7 },
    { id: DIMENSION_ID_INCIDENT_DATE, rowsLength: 4 },
    { id: DIMENSION_ID_LAST_UPDATED, rowsLength: 14 },
]

describe('time dimensions', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
    })

    timeDimensions.forEach((dimension) => {
        it(`${dimension.id} shows the correct title in layout and table header`, () => {
            selectEventProgram(event)
            const label = event[dimension.id]
            selectRelativePeriod({ label, period: TEST_REL_PE_THIS_YEAR })

            clickMenubarUpdateButton()

            expectTableToBeVisible()

            // check the correct number of columns
            getTableHeaderCells().its('length').should('equal', 2)

            // check the correct number of rows
            getTableRows().should('have.length', dimension.rowsLength)

            // check the label in the column header
            getTableHeaderCells().contains(label).should('be.visible')

            //check the chip in the layout
            cy.getBySel('columns-axis')
                .findBySelLike('layout-chip')
                .contains(`${label}: 1 selected`)
                .should('be.visible')
        })
    })
    it('scheduled date disabled state is set based on stage setting ', () => {
        // both are disabled by default
        dimensionIsDisabled('dimension-item-scheduledDate')
        dimensionIsDisabled('dimension-item-incidentDate')

        selectEventProgram({ programName: 'Immunization Registry' })

        // schedule date is enabled when a program but no stage is selected
        dimensionIsEnabled('dimension-item-scheduledDate')
        dimensionIsDisabled('dimension-item-incidentDate')

        cy.getBySel('accessory-sidebar').contains('Stage').click()

        // select a stage which has hideDueDate = true
        cy.containsExact('Birth details').click()

        // schedule date is disabled when a stage that hides it is selected
        dimensionIsDisabled('dimension-item-scheduledDate')
        dimensionIsDisabled('dimension-item-incidentDate')

        cy.getBySelLike('dimension-item-scheduledDate').trigger('mouseover')

        cy.getBySelLike('tooltip-content').contains(
            'Disabled by the selected program stage'
        )

        cy.getBySel('stage-clear-button').click()

        cy.getBySel('accessory-sidebar').contains('Stage').click()

        // select a stage which has hideDueDate = false
        cy.containsExact('Immunization').click()

        // schedule date is enabled when a stage that doesn't hide it is selected
        dimensionIsEnabled('dimension-item-scheduledDate')
        dimensionIsDisabled('dimension-item-incidentDate')
    })

    // TODO: add tests for disabling incidentDate per program, e.g. enabled for Analytics program, disabled for HIV Case Surveillance
})
