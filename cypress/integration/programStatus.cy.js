import {
    clickAddRemoveProgramDimension,
    openProgramDimensionsSidebar,
    selectProgramForTE,
    selectTrackedEntityWithType,
} from '../helpers/dimensions.js'
import {
    assertChipContainsText,
    assertTooltipContainsEntries,
} from '../helpers/layout.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    getTableHeaderCells,
    expectTableToBeVisible,
    expectTableToMatchRows,
    getTableRows,
} from '../helpers/table.js'

describe(['>=41'], 'program status (TE)', () => {
    const setUpTable = () => {
        goToStartPage()

        selectTrackedEntityWithType('Person')

        openProgramDimensionsSidebar()

        selectProgramForTE('Child Programme')

        clickAddRemoveProgramDimension('Program status')

        clickMenubarUpdateButton()

        expectTableToBeVisible()
    }

    it('can be filtered by status COMPLETED', () => {
        setUpTable()

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        getTableRows().its('length').should('be.gte', 10)

        getTableHeaderCells()
            .contains('Program status, Child Programme')
            .should('be.visible')

        assertChipContainsText('Program status', 'all', 'Child Programme')

        // Add filter 'Completed'

        cy.getBySel('columns-axis').contains('Program status').click()

        cy.getBySel('program-status-checkbox')
            .contains('Completed')
            .click()
            .find('[type="checkbox"]')
            .should('be.checked')

        cy.getBySelLike('programStatus-modal-action-confirm')
            .contains('Update')
            .click()

        expectTableToBeVisible()

        expectTableToMatchRows([
            'Completed',
            'Completed',
            'Completed',
            'Completed',
        ])

        assertChipContainsText('Program status', 1, 'Child Programme')

        assertTooltipContainsEntries(['Completed'])
    })
})
