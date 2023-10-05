import { EXTENDED_TIMEOUT } from '../support/util.js'

export const goToStartPage = (skipEval) => {
    cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))

    if (!skipEval) {
        expectStartScreenToBeVisible()
    }
}

export const expectStartScreenToBeVisible = () =>
    cy.contains('Getting started', EXTENDED_TIMEOUT).should('be.visible')
