import { EXTENDED_TIMEOUT } from '../support/util.js'

// Helper function to log page state and check if specific content is present
const logPageState = () => {
    cy.url().then((url) => {
        cy.log(`Current URL: ${url}`)
        cy.task('log', `Current URL: ${url}`)
        console.log(`Current URL: ${url}`)
    })

    cy.get('body').then((body) => {
        const bodyText = body.text()
        cy.log(`Page Body Content: ${bodyText.slice(0, 500)}...`)
        cy.task('log', `Page Body Content: ${bodyText.slice(0, 500)}...`)
        console.log(`Page Body Content: ${bodyText.slice(0, 500)}...`)
    })
}

export const goToStartPage = (skipEval) => {
    const appPath = '/api/apps/line-listing/index.html';
    const baseUrl = Cypress.env('dhis2BaseUrl') + appPath;
    cy.visit(baseUrl, EXTENDED_TIMEOUT).then(() => {
        cy.log(`Visiting the base URL: ${baseUrl}`)
        cy.task('log', `Visiting the base URL: ${baseUrl}`)
        console.log(`Visiting the base URL: ${baseUrl}`)
        logPageState()

        if (!skipEval) {
            expectStartScreenToBeVisible()
        }
    })
}

export const expectStartScreenToBeVisible = () => {
    cy.contains('Getting started', EXTENDED_TIMEOUT)
        .should('be.visible')
        .then(() => {
            cy.log('Confirmed: "Getting started" is visible')
            cy.task('log', 'Confirmed: "Getting started" is visible')
            console.log('Confirmed: "Getting started" is visible')
        })
    logPageState()
}
