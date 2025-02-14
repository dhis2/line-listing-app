import {
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_EVENT_DATE,
} from '../../src/modules/dimensionConstants.js'
import { E2E_PROGRAM } from '../data/index.js'
import {
    clickAddRemoveProgramDimension,
    openProgramDimensionsSidebar,
    selectEventWithProgram,
} from '../helpers/dimensions.js'
import {
    assertChipContainsText,
    assertTooltipContainsEntries,
} from '../helpers/layout.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { getCurrentYearStr, selectFixedPeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    getTableHeaderCells,
    expectTableToBeVisible,
    expectTableToMatchRows,
} from '../helpers/table.js'

const currentYear = getCurrentYearStr()

describe('event status (event)', () => {
    const event = E2E_PROGRAM
    const dimensionName = 'Event status'

    const setUpTable = () => {
        goToStartPage()

        selectEventWithProgram(event)

        openProgramDimensionsSidebar()

        clickAddRemoveProgramDimension(dimensionName)
    }

    it('can be filtered by status SCHEDULED', () => {
        setUpTable()

        selectFixedPeriod({
            label: event[DIMENSION_ID_SCHEDULED_DATE],
            period: {
                year: currentYear,
                name: `January ${currentYear}`,
            },
        })

        selectFixedPeriod({
            label: event[DIMENSION_ID_SCHEDULED_DATE],
            period: {
                year: currentYear,
                name: `February ${currentYear}`,
            },
        })

        selectFixedPeriod({
            label: event[DIMENSION_ID_SCHEDULED_DATE],
            period: {
                year: currentYear,
                name: `December ${currentYear}`,
            },
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        expectTableToMatchRows([
            'Completed',
            'Active',
            'Completed',
            'Completed',
            'Scheduled',
        ])
        expectTableToMatchRows([
            `${currentYear}-01-03`,
            `${currentYear}-02-01`,
            `${currentYear}-01-01`,
            `${currentYear}-01-01`,
            `${currentYear}-12-25`,
        ])

        getTableHeaderCells().contains(dimensionName).should('be.visible')

        assertChipContainsText(dimensionName, 'all')

        // Add filter 'Active'

        cy.getBySel('columns-axis').contains(dimensionName).click()

        cy.getBySel('event-status-checkbox')
            .contains('Active')
            .click()
            .find('[type="checkbox"]')
            .should('be.checked')

        cy.getBySel('fixed-dimension-eventStatus-modal-actions')
            .contains('Update')
            .click()

        expectTableToBeVisible()

        expectTableToMatchRows([`${currentYear}-02-01`])
        expectTableToMatchRows(['Active'])

        assertChipContainsText(dimensionName, 1)
        assertTooltipContainsEntries(dimensionName, ['Active'])

        // Add filter 'Scheduled'

        cy.getBySel('columns-axis').contains(dimensionName).click()

        cy.getBySel('event-status-checkbox')
            .contains('Scheduled')
            .click()
            .find('[type="checkbox"]')
            .should('be.checked')

        cy.getBySel('fixed-dimension-eventStatus-modal-actions')
            .contains('Update')
            .click()

        expectTableToBeVisible()

        expectTableToMatchRows([`${currentYear}-02-01`, `${currentYear}-12-25`])
        expectTableToMatchRows(['Active', 'Scheduled'])

        assertChipContainsText(dimensionName, 2)
        assertTooltipContainsEntries(dimensionName, ['Scheduled'])
    })

    it('can be filtered by status ACTIVE', () => {
        setUpTable()

        selectFixedPeriod({
            label: event[DIMENSION_ID_EVENT_DATE],
            period: {
                year: currentYear,
                name: `January ${currentYear}`,
            },
        })

        selectFixedPeriod({
            label: event[DIMENSION_ID_EVENT_DATE],
            period: {
                year: currentYear,
                name: `February ${currentYear}`,
            },
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        expectTableToMatchRows([
            'Completed',
            'Active',
            'Completed',
            'Completed',
        ])
        expectTableToMatchRows([
            `${currentYear}-01-03`,
            `${currentYear}-02-01`,
            `${currentYear}-01-01`,
            `${currentYear}-01-01`,
        ])

        getTableHeaderCells().contains(dimensionName).should('be.visible')

        assertChipContainsText(dimensionName, 'all')

        // Add filter 'Active'

        cy.getBySel('columns-axis').contains(dimensionName).click()

        cy.getBySel('event-status-checkbox')
            .contains('Active')
            .click()
            .find('[type="checkbox"]')
            .should('be.checked')

        cy.getBySel('fixed-dimension-eventStatus-modal-actions')
            .contains('Update')
            .click()

        expectTableToBeVisible()

        expectTableToMatchRows([`${currentYear}-02-01`])
        expectTableToMatchRows(['Active'])

        assertChipContainsText(dimensionName, 1)
        assertTooltipContainsEntries(dimensionName, ['Active'])
    })
})
