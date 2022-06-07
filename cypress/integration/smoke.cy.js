import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('Smoke Test', () => {
    it('loads', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        cy.contains('Getting started', EXTENDED_TIMEOUT).should('be.visible')
        cy.title().should('equal', 'Line Listing | DHIS2')
    })

    it('loads with visualization id', () => {
        cy.visit('#/R4wAb2yMLik', EXTENDED_TIMEOUT)

        cy.getWithDataTest('{visualization-title}', EXTENDED_TIMEOUT)
            .should('be.visible')
            .and('contain', 'Inpatient: Cases last quarter (case)')
    })
})
