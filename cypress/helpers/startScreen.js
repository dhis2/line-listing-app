import { EXTENDED_TIMEOUT } from '../support/util.js'

export const goToStartPage = (skipEval) => {
    cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
    if (!skipEval) {
        expectStartScreenToBeVisible()
    }
}

export const expectStartScreenToBeVisible = () => {
    const envVars = {
        name: Cypress.env('dhis2Username'),
        password: Cypress.env('dhis2Password'),
        server: Cypress.env('dhis2BaseUrl'),
    }
    cy.log(`ENV VARS:\n ${JSON.stringify(envVars, null, 4)}`)
    return cy.contains('Getting started', EXTENDED_TIMEOUT).should('be.visible')
}
