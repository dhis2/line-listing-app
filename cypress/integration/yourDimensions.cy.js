import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import { E2E_PROGRAM, TEST_REL_PE_LAST_YEAR } from '../data/index.js'
import yourDimensionsFixture from '../fixtures/yourDimensionsLazyLoading.json'
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

describe('Your dimensions', () => {
    const dimensionName = 'Facility Type'
    const filteredOutItemName = 'MCHP'
    const filteredItemName = 'CHC'

    const openYourDimensionsPanel = () => {
        goToStartPage()

        selectEventWithProgram(trackerProgram)

        openProgramDimensionsSidebar()

        selectRelativePeriod({
            label: periodLabel,
            period: TEST_REL_PE_LAST_YEAR,
        })

        // open the your dimensions sidebar
        cy.getBySel('main-sidebar').contains('Your dimensions').click()
    }

    it('can be used and filtered', () => {
        openYourDimensionsPanel()

        cy.getBySel('your-dimensions-list').contains(
            dimensionName,
            EXTENDED_TIMEOUT
        )

        cy.getBySel('your-dimensions-list')
            .findBySelLike('dimension-item')
            .should('have.length.of.at.least', 4)

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
        assertChipContainsText(dimensionName, 'all')

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
        assertChipContainsText(dimensionName, 1)

        // check the chip tooltip
        assertTooltipContainsEntries(dimensionName, [filteredItemName])

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
    it('list lazy loads', () => {
        const getList = () => cy.getBySel('your-dimensions-list')
        const getListChildren = () => getList().find('div[role="button"]')
        const shouldLoadNextPage = (nextPage, nextListLength) => {
            cy.getBySel('dimensions-list-load-more').should('exist')
            // The loader is appended below the "viewport" so we need another scroll
            cy.getBySel('dimensions-list-load-more')
                .scrollIntoView()
                .should('be.visible')
            cy.wait('@getDimensions')
                .its('request.query.page')
                .should('eq', nextPage.toString())
            getListChildren().should('have.length', nextListLength)

            cy.getBySel('dimensions-list-load-more').should('not.exist')

            cy.wait(0)
        }

        cy.intercept(
            {
                pathname: '**/api/*/dimensions**',
                query: {
                    fields: 'id,dimensionType,valueType,optionSet,displayName~rename(name)',
                },
            },
            (req) => req.reply(yourDimensionsFixture[`page_${req.query.page}`])
        ).as('getDimensions')

        openYourDimensionsPanel()

        // Page 1 should be fetched without scrolling
        cy.wait('@getDimensions').its('request.query.page').should('eq', '1')
        getListChildren().should('have.length', 50)

        // Subsequent pages should be fetched when scrolling down
        getList().scrollTo('bottom')
        shouldLoadNextPage(2, 100)

        getList().scrollTo('bottom')
        shouldLoadNextPage(3, 150)

        getList().scrollTo('bottom')
        shouldLoadNextPage(4, 200)

        // This is the last page with only 10 items
        getList().scrollTo('bottom')
        shouldLoadNextPage(5, 210)

        // Nothing should happen once the end has been reached
        getList().scrollTo('bottom')
        cy.getBySel('dimensions-list-load-more').should('not.exist')
        getListChildren().should('have.length', 210)
        cy.get('@getDimensions.all').then((interceptions) => {
            const hasRequestedPageSix = interceptions.some(
                ({ request }) => request.query.page === '6'
            )
            expect(interceptions).to.have.length(5)
            expect(hasRequestedPageSix).to.be.false
        })
    })
})
