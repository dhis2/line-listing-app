import { EXTENDED_TIMEOUT } from '../support/util.js'

export const goToStartPage = (skipEval) => {
    cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
    if (!skipEval) {
        expectStartScreenToBeVisible()
    }
}

export const expectStartScreenToBeVisible = () => {
    const user = {
        name: Cypress.env('dhis2Username'),
        password: Cypress.env('dhis2Password'),
        server: Cypress.env('dhis2BaseUrl'),
    }

    cy.request(`${user.server}/api/me`).should((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.username).to.eq(user.name)
    })
    return cy.contains('Getting started', EXTENDED_TIMEOUT).should('be.visible')
}
