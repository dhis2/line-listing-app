import { EXTENDED_TIMEOUT } from '../support/util.js'

export const goToStartPage = () => {
    cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
    expectStartScreenToBeVisible()
}

export const expectStartScreenToBeVisible = () =>
    cy.contains('Getting started', EXTENDED_TIMEOUT).should('be.visible')
