import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('viewing the start screen', () => {
    it('getting started is shown', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        cy.contains('Getting started', EXTENDED_TIMEOUT).should('be.visible')
    })

    it('displays most viewed section', () => {
        cy.contains('Your most viewed line lists', EXTENDED_TIMEOUT).should(
            'be.visible'
        )
        cy.getWithDataTest(
            '{start-screen-most-viewed-list-item}',
            EXTENDED_TIMEOUT
        ).should('have.length', 6)
    })
})
