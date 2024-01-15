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

describe(['>=41'], 'program status (tracked entity)', () => {
    const dimensionName = 'Program status'

    const setUpTable = () => {
        goToStartPage()

        selectTrackedEntityWithType('Malaria Entity')

        openProgramDimensionsSidebar()

        selectProgramForTE(
            'Malaria case diagnosis, treatment and investigation'
        )

        clickAddRemoveProgramDimension(dimensionName)

        clickMenubarUpdateButton()

        expectTableToBeVisible()
    }

    it('can be filtered by status COMPLETED', () => {
        setUpTable()

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        getTableRows().its('length').should('be.gte', 10)

        // getTableHeaderCells().contains(dimensionName).should('be.visible')
        // Backend issue, once resolved change back to the line above
        getTableHeaderCells()
            .contains('Enrollment PROGRAM_STATUS')
            .should('be.visible')

        assertChipContainsText(dimensionName, 'all')

        // Add filter 'Completed'

        cy.getBySel('columns-axis').contains(dimensionName).click()

        cy.getBySel('program-status-checkbox')
            .contains('Completed')
            .click()
            .find('[type="checkbox"]')
            .should('be.checked')

        cy.getBySelLike('programStatus-modal-action-confirm')
            .contains('Update')
            .click()

        expectTableToBeVisible()

        expectTableToMatchRows(['Completed'])

        assertChipContainsText(`${dimensionName}: 1 selected`)

        assertTooltipContainsEntries(['Completed'])
    })
})
