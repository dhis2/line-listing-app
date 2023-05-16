// import { enableAutoLogin } from '@dhis2/cypress-commands'

import './commands.js'

// enableAutoLogin()

/**
 * Custom login command, can be used to login or switch between sessions.
 * Will cache and restore cookies, localStorage, and sessionStorage. See:
 * https://docs.cypress.io/api/commands/session
 */
Cypress.Commands.add('login', (user) => {
    cy.session(
        user,
        () => {
            // Login via API
            cy.request({
                url: `${user.server}/dhis-web-commons-security/login.action`,
                method: 'POST',
                form: true,
                followRedirect: true,
                body: {
                    j_username: user.name,
                    j_password: user.password,
                    '2fa_code': '',
                },
            })

            // Set base url for the app platform
            window.localStorage.setItem('DHIS2_BASE_URL', user.server)
        },
        {
            validate: () => {
                cy.request(`${user.server}/api/me`).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.username).to.eq(user.name)
                })
            },
        }
    )
})

// Log in before each test, if not already logged in
beforeEach(() => {
    cy.login({
        name: Cypress.env('dhis2Username'),
        password: Cypress.env('dhis2Password'),
        server: Cypress.env('dhis2BaseUrl'),
    })
})
