import {
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_LAST_UPDATED,
} from '../../src/modules/dimensionConstants.js'
import { E2E_PROGRAM, TEST_REL_PE_THIS_YEAR } from '../data/index.js'
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
    const event = E2E_PROGRAM
    const dimensionName = 'Event status'

    const setUpTable = (periodLabel) => {
        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventProgram(event)

        selectRelativePeriod({
            label: periodLabel,
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
    }

    it(['>=39'], 'can be filtered by status SCHEDULED', () => {
        setUpTable(event[DIMENSION_ID_SCHEDULED_DATE])

        expectTableToMatchRows([
            'Completed',
            'Completed',
            'Completed',
            'Completed',
            'Completed',
            'Active',
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

        expectTableToMatchRows([`${getCurrentYearStr()}-02-01`])

        expectTableToMatchRows(['Active'])

        assertChipContainsText(`${dimensionName}: 2 selected`)

        assertTooltipContainsEntries(['Scheduled'])
    })

    it('can be filtered by status ACTIVE', () => {
        setUpTable(event[DIMENSION_ID_LAST_UPDATED])

        // TODO determine expected once 2.38analytics_dev is available
        // expectTableToMatchRows(['Active', 'Completed', 'Completed'])

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

        expectTableToMatchRows([`${getCurrentYearStr()}-11-18`])

        assertChipContainsText(`${dimensionName}: 1 selected`)

        assertTooltipContainsEntries(['Active'])
    })
})
