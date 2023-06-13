import './commands.js'

enableAutoLogin()
// enableNetworkShim()

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
    // This prevents a benign error:
    //   This error means that ResizeObserver was not able to deliver all
    //   observations within a single animation frame. It is benign (your site
    //   will not break).
    //
    // Source: https://stackoverflow.com/a/50387233/1319140
    if (resizeObserverLoopErrRe.test(err.message)) {
        // returning false here prevents Cypress from failing the test
        return false
    }
// enableAutoLogin()
// '2.39' or 39?
const computeEnvVariableName = (instanceVersion) =>
    typeof instanceVersion === 'number'
        ? `${SESSION_COOKIE_NAME}_${instanceVersion}`
        : `${SESSION_COOKIE_NAME}_${instanceVersion.split('.').pop()}`

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
    const baseUrl = Cypress.env('dhis2BaseUrl')
    const instanceVersion = Cypress.env('dhis2InstanceVersion')
    const envVariableName = computeEnvVariableName(instanceVersion)
    const { name, value, ...options } = JSON.parse(Cypress.env(envVariableName))

    localStorage.setItem(LOCAL_STORAGE_KEY, baseUrl)
    cy.setCookie(name, value, options)

    cy.getAllCookies().should((cookies) => {
        expect(findSessionCookieForBaseUrl(baseUrl, cookies)).to.exist
        expect(localStorage.getItem(LOCAL_STORAGE_KEY)).to.equal(baseUrl)
    })
})
