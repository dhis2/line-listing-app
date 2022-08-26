import { goToStartPage } from '../helpers/startScreen.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('viewing the start screen', () => {
    it('getting started and most viewed section are shown', () => {
        goToStartPage()
        cy.contains('Your most viewed line lists', EXTENDED_TIMEOUT).should(
            'be.visible'
        )
        cy.getBySel(
            'start-screen-most-viewed-list-item',
            EXTENDED_TIMEOUT
        ).should('have.length', 6)
    })
})
