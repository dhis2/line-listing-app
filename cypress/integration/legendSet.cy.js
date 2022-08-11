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
    clickOptionsTab,
    expectLegendDisplayStrategyToBeByDataItem,
    expectLegendDisplayStyleToBeFill,
    expectLegendDisplayStyleToBeText,
} from '../helpers/options.js'
import { selectRelativePeriod } from '../helpers/period.js'
import { expectTableToBeVisible } from '../helpers/table.js'
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

        cy.getBySel('options-modal-actions').contains('Update').click()

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

        cy.getBySel('options-modal-actions').contains('Update').click()

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

    // it('legend key is hidden', () => {
    //     expectLegendKeyToBeHidden()
    // })
    // it('verifies that options are persisted', () => {
    //     clickMenuBarOptionsButton()
    //     clickOptionsTab(OPTIONS_TAB_LEGEND)
    //     expectLegendDisplayStrategyToBeByDataItem()
    // })
    // it('enables legend key option', () => {
    //     toggleLegendKeyOption()
    //     expectLegendKeyOptionToBeEnabled()
    //     clickOptionsModalUpdateButton()
    //     expectVisualizationToBeVisible(VIS_TYPE_PIVOT_TABLE)
    // })
    // it('legend key is shown with 1 item', () => {
    //     expectLegendKeyToBeVisible()
    //     expectLegedKeyItemAmountToBe(1)
    // })
})
