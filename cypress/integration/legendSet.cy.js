import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import {
    ANALYTICS_PROGRAM,
    TEST_DIM_LEGEND_SET,
    TEST_REL_PE_LAST_YEAR,
} from '../data/index.js'
import { openDimension, selectEventProgram } from '../helpers/dimensions.js'
import {
    clickMenubarOptionsButton,
    clickMenubarUpdateButton,
} from '../helpers/menubar.js'
import {
    clickOptionsModalUpdateButton,
    clickOptionsTab,
    expectLegendDisplayStrategyToBeByDataItem,
    expectLegendDisplayStyleToBeFill,
    expectLegendDisplayStyleToBeText,
    expectLegendKeyOptionToBeEnabled,
} from '../helpers/options.js'
import { selectRelativePeriod } from '../helpers/period.js'
import {
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
    it('background color legend is applied', () => {
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
    it('text color legend is applied', () => {
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

    // TODO:
    // Use the tests in DV as a foundation
    // Open AO and check that no legend or legend key is applied
    // Add a legend with "per data item" strategy
    // Change strategy to "single legend", pick one from the list
    // Test both options for the legend style
    // Test the legend key, that it shows up for a single or multiple items and always displays the name
    // Being able to save and reload the AO with all options persisting
    // Being able to apply legends to negative values (but not empty strings)
})
