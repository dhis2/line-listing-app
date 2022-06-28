import { getCurrentYearStr } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'

describe('period dimension', () => {
    const TEST_DIM_ID = 'eventDate'
    const TEST_DIM_NAME = 'Event date'
    const TEST_RELATIVE_PERIOD_NAME = 'Last 3 months'
    const TEST_FIXED_PERIOD_NAME = `January ${getCurrentYearStr()}`

    it('opens modal', () => {
        goToStartPage()

        cy.getBySel('main-sidebar')
            .findBySel(`dimension-item-${TEST_DIM_ID}`)
            .click()

        cy.getBySel('period-dimension-modal').should('be.visible')
    })
    it('modal has title', () => {
        cy.getBySel('period-dimension-modal-title').should(
            'contain',
            TEST_DIM_NAME
        )
    })
    it('default selection is selected', () => {
        cy.contains('Choose from presets').should('have.class', 'selected')

        cy.getBySel('period-dimension-relative-periods-button').should(
            'have.class',
            'selected'
        )

        cy.getBySelLike(
            'period-dimension-relative-period-filter-content'
        ).should('contain', 'Months')
    })
    it('a relative period can be added', () => {
        cy.getBySelLike('period-dimension-transfer-sourceoptions')
            .contains(TEST_RELATIVE_PERIOD_NAME)
            .dblclick()

        cy.getBySelLike('period-dimension-transfer-pickedoptions').should(
            'contain',
            TEST_RELATIVE_PERIOD_NAME
        )
    })
    it('a fixed period can be added', () => {
        cy.getBySel('period-dimension-fixed-periods-button')
            .click()
            .should('have.class', 'selected')

        cy.getBySelLike(
            'period-dimension-fixed-period-filter-period-type-content'
        ).should('contain', 'Monthly')

        cy.getBySelLike('period-dimension-transfer-sourceoptions')
            .contains(TEST_FIXED_PERIOD_NAME)
            .dblclick()

        cy.getBySelLike('period-dimension-transfer-pickedoptions').should(
            'contain',
            TEST_FIXED_PERIOD_NAME
        )
    })
    it('a custom period can be selected', () => {
        cy.contains('Define start - end dates')
            .click()
            .should('have.class', 'selected')

        // TODO:
        // set dates
        // close modal (add to Columns)
        // check that the old periods were cleared and that the tooltip contains the custom date
        // reopen modal to see that they are still set
        // remove one of the dates
        // close and reopen modal to see that both dates are cleared when one is removed
        // set dates
        // change to preset dates and back to custom dates again to see that the custom date was cleared
    })
})
