import '@this-dot/cypress-indexeddb'
// import { updateBaseUrlIndexedDb } from './updateBaseUrlIndexedDb.js'
import './commands.js'

// const appName = 'Line Listing'
// const baseUrlDbName = 'dhis2-base-url-db'
// const baseUrlStoreName = 'dhis2-base-url-store'

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
            // Update indexDB to the correct baseUrl value if needed
            // updateBaseUrlIndexedDb({
            //     appName,
            //     baseUrlDbName,
            //     baseUrlStoreName,
            //     baseUrl: user.server,
            // })
        },
        {
            validate: () => {
                // Check indexedDB is updated correctly
                // cy.openIndexedDb(baseUrlDbName)
                //     .createObjectStore(baseUrlStoreName)
                //     .readItem('Line Listing')
                //     .should('deep.equal', { appName, baseUrl: user.server })

                // Check API is returning the expected response
                cy.request(`${user.server}/api/me`).should((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.username).to.eq(user.name)
                })
            },
            cacheAcrossSpecs: false,
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