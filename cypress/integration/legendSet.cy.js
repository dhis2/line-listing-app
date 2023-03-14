import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_DIM_LEGEND_SET,
    TEST_DIM_LEGEND_SET_NEGATIVE,
    TEST_REL_PE_LAST_YEAR,
} from '../data/index.js'
import { openDimension, selectEventWithProgram } from '../helpers/dimensions.js'
import { deleteVisualization, saveVisualization } from '../helpers/fileMenu.js'
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
import {
    getCurrentYearStr,
    selectFixedPeriod,
    selectRelativePeriod,
    unselectAllPeriods,
} from '../helpers/period.js'
import { expectRouteToBeEmpty } from '../helpers/route.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    expectLegendKeyToMatchLegendSets,
    expectLegendKeyToBeHidden,
    expectLegendKeyToBeVisible,
    expectTableToBeVisible,
    getTableRows,
    expectAOTitleToContain,
} from '../helpers/table.js'

const event = E2E_PROGRAM
const dimensionName = TEST_DIM_LEGEND_SET
const periodLabel = event[DIMENSION_ID_EVENT_DATE]

describe(['>=39'], 'Options - Legend', () => {
    const defaultBackgroundColor = 'rgb(255, 255, 255)'
    const defaultTextColor = 'rgb(33, 41, 52)'

    const TEST_LEGEND_AGE = {
        name: 'Age 10y interval',
        cells: [
            { value: 10, color: 'rgb(255, 255, 229)' },
            { value: 56, color: 'rgb(120, 198, 121)' },
        ],
    }

    const TEST_LEGEND_E2E = {
        name: 'E2E legend',
        cells: {
            positive: [
                { value: 10, color: 'rgb(209, 229, 240)' },
                { value: 56, color: 'rgb(103, 169, 207)' },
            ],
            negative: [
                { value: -10, color: 'rgb(253, 219, 199)' },
                { value: -56, color: 'rgb(239, 138, 98)' },
            ],
        },
    }

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
        goToStartPage()

        selectEventWithProgram(E2E_PROGRAM)

        selectRelativePeriod({
            label: periodLabel,
            period: TEST_REL_PE_LAST_YEAR,
        })

        cy.getBySel('columns-axis')
            .findBySelLike('layout-chip')
            .findBySel('dimension-menu-button-eventDate')
            .click()
        cy.contains('Move to Filter').click()

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
        TEST_LEGEND_AGE.cells.forEach((cell) =>
            cy
                .getBySel('table-body')
                .contains(cell.value)
                .should('have.css', 'color', defaultTextColor)
                .closest('td')
                .should('have.css', 'background-color', cell.color)
        )

        // unaffected cells (date column) have default background and text color
        assertCellsHaveDefaultColors('tr td:nth-child(1)')
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
        TEST_LEGEND_AGE.cells.forEach((cell) =>
            cy
                .getBySel('table-body')
                .contains(cell.value)
                .should('have.css', 'color', cell.color)
                .closest('td')
                .should('have.css', 'background-color', defaultBackgroundColor)
        )

        // unaffected cells (date column) have default background and text color
        assertCellsHaveDefaultColors('tr td:nth-child(1)')
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

        expectLegendKeyToMatchLegendSets([TEST_LEGEND_AGE.name])
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
            .contains(TEST_LEGEND_E2E.name)
            .click()

        cy.getBySel('options-modal-content')
            .contains('Legend changes text color')
            .click()

        expectLegendDisplayStrategyToBeFixed()

        expectLegendDisplayStyleToBeText()

        clickOptionsModalUpdateButton()

        expectTableToBeVisible()

        // affected cells have fixed text color and default background color
        TEST_LEGEND_E2E.cells.positive.forEach((cell) =>
            cy
                .getBySel('table-body')
                .contains(cell.value)
                .should('have.css', 'color', cell.color)
                .closest('td')
                .should('have.css', 'background-color', defaultBackgroundColor)
        )

        // unaffected cells (date column) have default background and text color
        assertCellsHaveDefaultColors('tr td:nth-child(1)')
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
        TEST_LEGEND_E2E.cells.positive.forEach((cell) =>
            cy
                .getBySel('table-body')
                .contains(cell.value)
                .should('have.css', 'color', defaultTextColor)
                .closest('td')
                .should('have.css', 'background-color', cell.color)
        )

        // unaffected cells (date column) have default background and text color
        assertCellsHaveDefaultColors('tr td:nth-child(1)')
    })
    it('options can be saved and loaded', () => {
        const AO_NAME = `TEST ${new Date().toLocaleString()}`
        saveVisualization(AO_NAME)
        expectAOTitleToContain(AO_NAME)
        expectTableToBeVisible()

        // affected cells have default text color and fixed background color
        TEST_LEGEND_E2E.cells.positive.forEach((cell) =>
            cy
                .getBySel('table-body')
                .contains(cell.value)
                .should('have.css', 'color', defaultTextColor)
                .closest('td')
                .should('have.css', 'background-color', cell.color)
        )

        // unaffected cells (date column) have default background and text color
        assertCellsHaveDefaultColors('tr td:nth-child(1)')

        clickMenubarOptionsButton()

        clickOptionsTab('Legend')

        expectLegendDisplayStrategyToBeFixed()

        expectLegendDisplayStyleToBeFill()

        cy.getBySel('fixed-legend-set-select-content').contains(
            TEST_LEGEND_E2E.name
        )
    })
    it('legend is applied to negative values (per data item)', () => {
        cy.getBySel('options-modal-content')
            .contains('Use pre-defined legend per data item')
            .click()

        expectLegendDisplayStrategyToBeByDataItem()

        clickOptionsModalUpdateButton()

        openDimension(TEST_DIM_LEGEND_SET_NEGATIVE)

        cy.contains('Add to Columns').click()

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        TEST_LEGEND_E2E.cells.negative.forEach((cell) =>
            cy
                .getBySel('table-body')
                .contains(cell.value)
                .should('have.css', 'color', defaultTextColor)
                .closest('td')
                .should('have.css', 'background-color', cell.color)
        )

        // unaffected cells (date column) have default background and text color
        assertCellsHaveDefaultColors('tr td:nth-child(1)')
    })
    it('legend key displays correctly when two items are in use', () => {
        expectLegendKeyToBeVisible()

        expectLegendKeyToMatchLegendSets([
            TEST_LEGEND_AGE.name,
            TEST_LEGEND_E2E.name,
        ])
    })
    it('empty values do not display a legend color', () => {
        const currentYear = getCurrentYearStr()

        unselectAllPeriods({
            label: periodLabel,
        })

        cy.intercept('**/api/*/analytics/**').as('getAnalytics')

        selectFixedPeriod({
            label: periodLabel,
            period: {
                year: currentYear,
                name: `January ${currentYear}`,
            },
        })
        cy.wait('@getAnalytics').then(({ request }) => {
            const url = new URL(request.url)

            // verify that the request url is correct, as the response from this request has been inconsistent when running on Cypress Dashboard
            expect(url.search).to.equal(
                '?dimension=ou%3AUSER_ORGUNIT,jfuXZB3A1ko.BEs9h9LOIao,jfuXZB3A1ko.vjEosHW6sAB&headers=ouname,jfuXZB3A1ko.BEs9h9LOIao,jfuXZB3A1ko.vjEosHW6sAB&totalPages=false&eventDate=202301&displayProperty=NAME&outputType=EVENT&pageSize=100&page=1&includeMetadataDetails=true&stage=jfuXZB3A1ko'
            )
        })

        getTableRows() // the first row should be empty and not have the legend background color
            .eq(0)
            .find('td')
            .eq(2)
            .should('have.css', 'background-color', defaultBackgroundColor)
            .invoke('text')
            .invoke('trim')
            .should('equal', '')

        getTableRows() // the second row should not be empty and have the legend background color
            .eq(1)
            .find('td')
            .eq(2)
            .should('not.have.css', 'background-color', defaultBackgroundColor)
            .invoke('text')
            .invoke('trim')
            .should('not.equal', '')
    })
    it('saved AO can be deleted', () => {
        deleteVisualization()

        expectRouteToBeEmpty()
    })
})
