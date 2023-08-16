import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import { E2E_PROGRAM, TEST_REL_PE_LAST_YEAR } from '../data/index.js'
import { typeInput } from '../helpers/common.js'
import {
    openProgramDimensionsSidebar,
    selectEventWithProgram,
} from '../helpers/dimensions.js'
import {
    assertChipContainsText,
    assertTooltipContainsEntries,
} from '../helpers/layout.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod, getPreviousYearStr } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    getTableHeaderCells,
    expectTableToBeVisible,
    expectTableToNotContainValue,
    expectTableToContainValue,
    expectTableToMatchRows,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const trackerProgram = E2E_PROGRAM
const periodLabel = trackerProgram[DIMENSION_ID_EVENT_DATE]

describe('event', () => {
    it('Your dimensions can be used and filtered by', () => {
        const dimensionName = 'Facility Type'
        const filteredOutItemName = 'MCHP'
        const filteredItemName = 'CHC'

        goToStartPage()

        selectEventWithProgram(trackerProgram)

        openProgramDimensionsSidebar()

        selectRelativePeriod({
            label: periodLabel,
            period: TEST_REL_PE_LAST_YEAR,
        })

        // open the your dimensions sidebar
        cy.getBySel('main-sidebar').contains('Your dimensions').click()

        cy.getBySel('your-dimensions-list').contains(
            dimensionName,
            EXTENDED_TIMEOUT
        )

        cy.getBySel('your-dimensions-list')
            .findBySelLike('dimension-item')
            .should('have.length', 4)

        // search the dimensions list
        cy.getBySel('search-dimension-input').find('input').type('facility')

        cy.getBySel('your-dimensions-list')
            .findBySelLike('dimension-item')
            .should('have.length', 2)

        // open the dimension modal
        cy.getBySel('your-dimensions-list').contains(dimensionName).click()

        cy.getBySel('button-add-condition').should('not.exist')

        cy.contains('Add to Columns').click()

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        // check the chip in the layout
        cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)

        // open the dimension and add a filter
        cy.getBySel('your-dimensions-list').contains(dimensionName).click()

        typeInput('left-header-filter-input-field', filteredItemName)

        cy.getBySelLike('transfer-sourceoptions').should(($elems) => {
            // First is the actual container, second intersection detector wrapper
            expect($elems).to.have.lengthOf(2)
            const $container = $elems.first()
            expect($container).to.have.class('container')
            // Ensure the intersection detector wrapper is excluded from options
            const $options = $container.find('[data-test*="transfer-option"]')
            // Ensure the only option remains
            expect($options).to.have.lengthOf(1)
            // And it matches the filter
            expect($options.first()).to.have.text(filteredItemName)
        })

        cy.getBySelLike('transfer-sourceoptions')
            .contains(filteredItemName)
            .dblclick()

        cy.getBySelLike('transfer-pickedoptions').contains(filteredItemName)

        cy.getBySel('dynamic-dimension-modal').contains('Update').click()

        // check the chip in the layout
        assertChipContainsText(`${dimensionName}: 1 selected`)

        // check the chip tooltip
        assertTooltipContainsEntries([filteredItemName])

        // check the label in the column header
        getTableHeaderCells().contains(dimensionName).should('be.visible')

        // check the value in the table
        expectTableToContainValue(filteredItemName)
        expectTableToNotContainValue(filteredOutItemName)

        expectTableToMatchRows([
            `${getPreviousYearStr()}-01-01`,
            `${getPreviousYearStr()}-12-11`,
        ])
    })
})
