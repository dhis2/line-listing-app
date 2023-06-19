import './commands.js'

beforeEach(() => {
    cy.login({
        username: Cypress.env('dhis2Username'),
        password: Cypress.env('dhis2Password'),
        baseUrl: Cypress.env('dhis2BaseUrl'),
    })
})
