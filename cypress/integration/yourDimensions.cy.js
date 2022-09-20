import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import { HIV_PROGRAM, TEST_REL_PE_LAST_YEAR } from '../data/index.js'
import { typeInput } from '../helpers/common.js'
import { selectEventProgram } from '../helpers/dimensions.js'
import {
    assertChipContainsText,
    assertTooltipContainsEntries,
} from '../helpers/layout.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod, getPreviousYearStr } from '../helpers/period.js'
import {
    getTableHeaderCells,
    expectTableToBeVisible,
    expectTableToNotContainValue,
    expectTableToContainValue,
    expectTableToMatchRows,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const event = HIV_PROGRAM
const periodLabel = event[DIMENSION_ID_EVENT_DATE]

describe('event', () => {
    it('Your dimensions can be used and filtered by', () => {
        const dimensionName = 'Organisation Unit Types'
        const optionName = 'HIV STI Health Facilities 2017'

        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventProgram(event)

        selectRelativePeriod({
            label: periodLabel,
            period: TEST_REL_PE_LAST_YEAR,
        })

        // open the your dimensions sidebar
        cy.getBySel('main-sidebar').contains('Your dimensions').click()

        cy.getBySel('your-dimensions-list').contains(dimensionName)

        cy.getBySel('your-dimensions-list')
            .findBySelLike('dimension-item')
            .should('have.length', 12)

        // search the dimensions list
        cy.getBySel('search-dimension-input').find('input').type('Org')

        cy.getBySel('your-dimensions-list')
            .findBySelLike('dimension-item')
            .should('have.length', 1)

        // open the dimension modal
        cy.getBySel('your-dimensions-list').contains(dimensionName).click()

        cy.getBySel('button-add-condition').should('not.exist')

        cy.contains('Add to Columns').click()

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        expectTableToNotContainValue(optionName)

        // check the chip in the layout
        cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)

        // open the dimension and add a filter
        cy.getBySel('your-dimensions-list').contains(dimensionName).click()

        typeInput('left-header-filter-input-field', 'sti')

        cy.getBySelLike('transfer-sourceoptions')
            .contains(optionName)
            .dblclick()

        cy.getBySel('dynamic-dimension-modal').contains('Update').click()

        // check the chip in the layout
        assertChipContainsText(`${dimensionName}: 1 selected`)

        // check the chip tooltip
        assertTooltipContainsEntries([optionName])

        // check the label in the column header
        getTableHeaderCells().contains(dimensionName).should('be.visible')

        // check the value in the table
        expectTableToContainValue(optionName)

        expectTableToMatchRows([`${getPreviousYearStr()}-09-20`])
    })
})
