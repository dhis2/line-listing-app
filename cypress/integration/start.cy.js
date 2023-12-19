import { goToStartPage } from '../helpers/startScreen.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('viewing the start screen', () => {
    it('getting started and most viewed section are shown', () => {
        cy.setTestDescription(
            'Ensures that the start screen displays both the "Getting Started" guide and the "Most Viewed" section correctly.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'StartScreenDisplay' },
            { key: 'action', value: 'DisplayGettingStartedAndMostViewed' },
            { key: 'component', value: 'StartScreen' },
        ])

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
