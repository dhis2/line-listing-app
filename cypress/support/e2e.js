import './commands.js'

// Log in before each test, if not already logged in
beforeEach(() => {
    cy.login({
        username: Cypress.env('dhis2Username'),
        password: Cypress.env('dhis2Password'),
        baseUrl: Cypress.env('dhis2BaseUrl'),
    })
})
