import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import {
    ANALYTICS_PROGRAM,
    TEST_DIM_LEGEND_SET,
    TEST_REL_PE_LAST_YEAR,
} from '../data/index.js'
import { typeInput } from '../helpers/common.js'
import { openDimension, selectEventProgram } from '../helpers/dimensions.js'
import {
    clickMenubarOptionsButton,
    clickMenubarUpdateButton,
} from '../helpers/menubar.js'
import {
    clickOptionsModalUpdateButton,
    clickOptionsTab,
    expectLegendDisplayStrategyToBeByDataItem,
    expectLegendDisplayStrategyToBeFixed,
    expectLegendDisplayStyleToBeFill,
    expectLegendDisplayStyleToBeText,
    expectLegendKeyOptionToBeEnabled,
} from '../helpers/options.js'
import { selectRelativePeriod } from '../helpers/period.js'
import { expectRouteToBeEmpty } from '../helpers/route.js'
import {
    expectAOTitleToBeValue,
    expectLegedKeyToMatchLegendSets,
    expectLegendKeyToBeHidden,
    expectLegendKeyToBeVisible,
    expectTableToBeVisible,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const event = ANALYTICS_PROGRAM
const dimensionName = TEST_DIM_LEGEND_SET
const periodLabel = event[DIMENSION_ID_EVENT_DATE]

describe('Options - Legend', () => {
    const defaultBackgroundColor = 'rgb(255, 255, 255)'
    const defaultTextColor = 'rgb(33, 41, 52)'

    const TEST_CELLS = [
        { value: 60, color: 'rgb(66, 146, 198)' },
        { value: 35, color: 'rgb(158, 202, 225)' },
    ]

    const TEST_LEGEND_SET = { name: 'Alert', color: 'rgb(237, 227, 99)' }

    const assertCellsHaveDefaultColors = (selector) =>
        cy
            .getBySel('table-body')
            .find(selector)
            .each(($el) => {
                cy.wrap($el)
                    .closest('td')
                    .should(
                        'have.css',
                        'background-color',
                        defaultBackgroundColor
                    )
                    .children()
                    .should('have.css', 'color', defaultTextColor)
            })

    it('no legend is applied by default', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventProgram(ANALYTICS_PROGRAM)

        selectRelativePeriod({
            label: periodLabel,
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        openDimension(dimensionName)

        cy.contains('Add to Columns').click()

        // all cells have default background and text color
        assertCellsHaveDefaultColors('tr td')
    })
    it('background color legend is applied (per data item)', () => {
        clickMenubarOptionsButton()

        clickOptionsTab('Legend')

        cy.getBySel('options-modal-content')
            .contains('Use a legend for table cell colors')
            .click()

        cy.getBySel('options-modal-content').should('contain', 'Legend style')

        expectLegendDisplayStrategyToBeByDataItem()

        expectLegendDisplayStyleToBeFill()

        clickOptionsModalUpdateButton()

        expectTableToBeVisible()

        // affected cells have default text color and custom background color
        TEST_CELLS.forEach((cell) =>
            cy
                .getBySel('table-body')
                .contains(cell.value)
                .should('have.css', 'color', defaultTextColor)
                .closest('td')
                .should('have.css', 'background-color', cell.color)
        )

        // unaffected cells (date column) have default background and text color
        assertCellsHaveDefaultColors('tr td:nth-child(2)')
    })
    it('text color legend is applied (per data item)', () => {
        clickMenubarOptionsButton()

        clickOptionsTab('Legend')

        cy.getBySel('options-modal-content').should('contain', 'Legend style')

        expectLegendDisplayStrategyToBeByDataItem()

        expectLegendDisplayStyleToBeFill()

        cy.getBySel('options-modal-content')
            .contains('Legend changes text color')
            .click()

        expectLegendDisplayStyleToBeText()

        clickOptionsModalUpdateButton()

        expectTableToBeVisible()

        // affected cells have custom text color and default background color
        TEST_CELLS.forEach((cell) =>
            cy
                .getBySel('table-body')
                .contains(cell.value)
                .should('have.css', 'color', cell.color)
                .closest('td')
                .should('have.css', 'background-color', defaultBackgroundColor)
        )

        // unaffected cells (date column) have default background and text color
        assertCellsHaveDefaultColors('tr td:nth-child(2)')
    })

    it('legend key is hidden by default', () => {
        expectLegendKeyToBeHidden()
    })
    it('legend key displays correctly when enabled', () => {
        clickMenubarOptionsButton()

        clickOptionsTab('Legend')

        expectLegendDisplayStrategyToBeByDataItem()

        cy.getBySel('options-modal-content').contains('Show legend key').click()

        expectLegendKeyOptionToBeEnabled()

        clickOptionsModalUpdateButton()

        expectTableToBeVisible()

        expectLegendKeyToBeVisible()

        expectLegedKeyToMatchLegendSets(['Age (COVID-19)'])
    })
    it('text color legend is applied (single legend)', () => {
        clickMenubarOptionsButton()

        clickOptionsTab('Legend')

        cy.getBySel('options-modal-content').should('contain', 'Legend style')

        expectLegendDisplayStrategyToBeByDataItem()

        expectLegendDisplayStyleToBeText()

        cy.getBySel('options-modal-content')
            .contains('Choose a single legend for the entire visualization')
            .click()

        cy.getBySel('options-modal-content')
            .contains('Select from legends')
            .click()

        cy.getBySel('fixed-legend-set-option')
            .contains(TEST_LEGEND_SET.name)
            .click()

        cy.getBySel('options-modal-content')
            .contains('Legend changes text color')
            .click()

        expectLegendDisplayStrategyToBeFixed()

        expectLegendDisplayStyleToBeText()

        clickOptionsModalUpdateButton()

        expectTableToBeVisible()

        // affected cells have fixed text color and default background color
        TEST_CELLS.forEach((cell) =>
            cy
                .getBySel('table-body')
                .contains(cell.value)
                .should('have.css', 'color', TEST_LEGEND_SET.color)
                .closest('td')
                .should('have.css', 'background-color', defaultBackgroundColor)
        )

        // unaffected cells (date column) have default background and text color
        assertCellsHaveDefaultColors('tr td:nth-child(2)')
    })
    it('background color legend is applied (single legend)', () => {
        clickMenubarOptionsButton()

        clickOptionsTab('Legend')

        cy.getBySel('options-modal-content').should('contain', 'Legend style')

        expectLegendDisplayStrategyToBeFixed()

        expectLegendDisplayStyleToBeText()

        cy.getBySel('options-modal-content')
            .contains('Legend changes background color')
            .click()

        expectLegendDisplayStyleToBeFill()

        clickOptionsModalUpdateButton()

        expectTableToBeVisible()

        // affected cells have default text color and fixed background color
        TEST_CELLS.forEach((cell) =>
            cy
                .getBySel('table-body')
                .contains(cell.value)
                .should('have.css', 'color', defaultTextColor)
                .closest('td')
                .should('have.css', 'background-color', TEST_LEGEND_SET.color)
        )

        // unaffected cells (date column) have default background and text color
        assertCellsHaveDefaultColors('tr td:nth-child(2)')
    })

    it('options can be saved and loaded', () => {
        cy.getBySel('menubar').contains('File').click()

        cy.getBySel('file-menu-container').contains('Save').click()

        const AO_NAME = `TEST ${new Date().toLocaleString()}`
        typeInput('file-menu-saveas-modal-name', AO_NAME)

        cy.getBySel('file-menu-saveas-modal-save').click()

        expectAOTitleToBeValue(AO_NAME)

        expectTableToBeVisible()

        // affected cells have default text color and fixed background color
        TEST_CELLS.forEach((cell) =>
            cy
                .getBySel('table-body')
                .contains(cell.value)
                .should('have.css', 'color', defaultTextColor)
                .closest('td')
                .should('have.css', 'background-color', TEST_LEGEND_SET.color)
        )

        // unaffected cells (date column) have default background and text color
        assertCellsHaveDefaultColors('tr td:nth-child(2)')

        clickMenubarOptionsButton()

        clickOptionsTab('Legend')

        expectLegendDisplayStrategyToBeFixed()

        expectLegendDisplayStyleToBeFill()

        cy.getBySel('fixed-legend-set-select-content').contains(
            TEST_LEGEND_SET.name
        )

        cy.getBySel('options-modal-content').closePopper()

        cy.getBySel('menubar').contains('File').click()

        cy.getBySel('file-menu-container').contains('Delete').click()

        cy.getBySel('file-menu-delete-modal')
            .find('button')
            .contains('Delete')
            .click()

        expectRouteToBeEmpty()
    })

    // TODO:
    //Test that multiple legend sets show up properly in the legend key - requires better test data in the db!

    // Being able to apply legends to negative values (but not empty strings)
})
