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
    // Hardcoded URL for testing
    const hardcodedUrl =
        'https://test.e2e.dhis2.org/analytics-2.41/api/apps/line-listing/index.html'
    cy.task('log', `** Hardcoded URL: ${hardcodedUrl}`)

    cy.visit(hardcodedUrl, EXTENDED_TIMEOUT)
        .then(() => {
            cy.task('log', `***Visited URL: ${hardcodedUrl}`)
            logPageState()

            if (!skipEval) {
                expectStartScreenToBeVisible()
            }
        })
        .catch((error) => {
            cy.task('log', `Error visiting URL: ${error.message}`)
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
