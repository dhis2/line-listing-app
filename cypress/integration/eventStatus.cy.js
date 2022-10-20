import { DIMENSION_ID_SCHEDULED_DATE } from '../../src/modules/dimensionConstants.js'
import { ANALYTICS_PROGRAM, TEST_REL_PE_THIS_YEAR } from '../data/index.js'
import { selectEventProgram } from '../helpers/dimensions.js'
import {
    assertChipContainsText,
    assertTooltipContainsEntries,
} from '../helpers/layout.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod, getCurrentYearStr } from '../helpers/period.js'
import {
    getTableHeaderCells,
    expectTableToBeVisible,
    expectTableToMatchRows,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('event status', () => {
    it('can be filtered', () => {
        const event = ANALYTICS_PROGRAM
        const dimensionName = 'Event status'

        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventProgram(event)

        selectRelativePeriod({
            label: event[DIMENSION_ID_SCHEDULED_DATE],
            period: TEST_REL_PE_THIS_YEAR,
        })

        cy.getBySel('main-sidebar')
            .contains(dimensionName)
            .closest(`[data-test*="dimension-item"]`)
            .findBySel('dimension-menu-button')
            .invoke('attr', 'style', 'visibility: initial')
            .click()

        cy.contains('Add to Columns').click()

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        expectTableToMatchRows([
            'Active',
            'Scheduled',
            'Completed',
            'Completed',
            'Completed',
            'Completed',
            'Completed',
        ])

        getTableHeaderCells().contains(dimensionName).should('be.visible')

        cy.getBySel('columns-axis')
            .findBySelLike('layout-chip')
            .contains(`${dimensionName}: all`)
            .should('be.visible')

        // Add filter 'Active'

        cy.getBySel('columns-axis').contains(dimensionName).click()

        cy.getBySel('event-status-checkbox')
            .contains('Active')
            .click()
            .find('[type="checkbox"]')
            .should('be.checked')

        cy.getBySel('fixed-dimension-modal-actions').contains('Update').click()

        expectTableToBeVisible()

        expectTableToMatchRows([`${getCurrentYearStr()}-02-01`])

        assertChipContainsText(`${dimensionName}: 1 selected`)

        assertTooltipContainsEntries(['Active'])

        // Add filter 'Scheduled'

        cy.getBySel('columns-axis').contains(dimensionName).click()

        cy.getBySel('event-status-checkbox')
            .contains('Scheduled')
            .click()
            .find('[type="checkbox"]')
            .should('be.checked')

        cy.getBySel('fixed-dimension-modal-actions').contains('Update').click()

        expectTableToBeVisible()

        expectTableToMatchRows([
            `${getCurrentYearStr()}-02-01`,
            `${getCurrentYearStr()}-12-25`,
        ])

        expectTableToMatchRows(['Active', 'Scheduled'])

        assertChipContainsText(`${dimensionName}: 2 selected`)

        assertTooltipContainsEntries(['Scheduled'])
    })
})
