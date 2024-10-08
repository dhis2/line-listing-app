import './commands.js'

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
})

const LOGIN_ENDPOINT = 'dhis-web-commons-security/login.action'
const SESSION_COOKIE_NAME = 'JSESSIONID'
const LOCAL_STORAGE_KEY = 'DHIS2_BASE_URL'

// '2.39' or 39?
const computeEnvVariableName = (instanceVersion) =>
    typeof instanceVersion === 'number'
        ? `${SESSION_COOKIE_NAME}_${instanceVersion}`
        : `${SESSION_COOKIE_NAME}_${instanceVersion.split('.').pop()}`

const findSessionCookieForBaseUrl = (baseUrl, cookies) =>
    cookies.find(
        (cookie) =>
            cookie.name === SESSION_COOKIE_NAME && baseUrl.includes(cookie.path)
    )

before(() => {
    const username = Cypress.env('dhis2Username')
    const password = Cypress.env('dhis2Password')
    const baseUrl = Cypress.env('dhis2BaseUrl')
    const instanceVersion = Cypress.env('dhis2InstanceVersion')

    cy.task(
        'log',
        `Attempting to log in with user: ${username} on base URL: ${baseUrl}`
    )

    cy.request({
        url: `${baseUrl}/${LOGIN_ENDPOINT}`,
        method: 'POST',
        form: true,
        followRedirect: true,
        body: {
            j_username: username,
            j_password: password,
            '2fa_code': '',
        },
    }).then((response) => {
        cy.task('log', `Login request returned status: ${response.status}`)
        expect(response.status).to.eq(200)
    })

    cy.getAllCookies().then((cookies) => {
        cy.task(
            'log',
            `Cookies after login attempt: ${JSON.stringify(cookies)}`
        )

        const sessionCookieForBaseUrl = findSessionCookieForBaseUrl(
            baseUrl,
            cookies
        )
        if (sessionCookieForBaseUrl) {
            cy.task(
                'log',
                `Found session cookie for base URL: ${JSON.stringify(
                    sessionCookieForBaseUrl
                )}`
            )
            Cypress.env(
                computeEnvVariableName(instanceVersion),
                JSON.stringify(sessionCookieForBaseUrl)
            )
        } else {
            cy.task('log', `Session cookie not found for base URL: ${baseUrl}`)
        }
    })
})

beforeEach(() => {
    const baseUrl = Cypress.env('dhis2BaseUrl')
    const instanceVersion = Cypress.env('dhis2InstanceVersion')
    const envVariableName = computeEnvVariableName(instanceVersion)
    const sessionCookie = Cypress.env(envVariableName)

    cy.task(
        'log',
        `Setting session cookie for base URL: ${baseUrl} with cookie data: ${sessionCookie}`
    )

    const { name, value, ...options } = JSON.parse(sessionCookie)

    localStorage.setItem(LOCAL_STORAGE_KEY, baseUrl)
    cy.setCookie(name, value, options)

    cy.getAllCookies().then((cookies) => {
        cy.task('log', `Cookies in beforeEach: ${JSON.stringify(cookies)}`)
        expect(findSessionCookieForBaseUrl(baseUrl, cookies)).to.exist
        expect(localStorage.getItem(LOCAL_STORAGE_KEY)).to.equal(baseUrl)
    })

    // Intercept and log all network requests
    cy.intercept('*').as('allRequests') // Intercept all requests
    cy.wait('@allRequests').then((interception) => {
        cy.task('log', `Intercepted request: ${JSON.stringify(interception)}`)
    })

    // Log the current URL
    cy.url().then((currentUrl) => {
        cy.task(
            'log',
            `Current URL after setting session cookie: ${currentUrl}`
        )
        if (currentUrl.includes('login')) {
            throw new Error('Still on login page after setting session cookie.')
        }
    })

    // Force a reload to ensure all resources are loaded
    cy.reload()
})
