import { EXTENDED_TIMEOUT } from '../support/util.js'

// Helper function to log page state and check if specific content is present
const logPageState = () => {
    cy.url().then((url) => {
        cy.log(`Current URL: ${url}`)
    })

    cy.get('body').then((body) => {
        const bodyText = body.text()
        cy.log(`Page Body Content: ${bodyText.slice(0, 500)}...`)
    })
}

export const goToStartPage = (skipEval) => {
    cy.visit('/', EXTENDED_TIMEOUT).then(() => {
        cy.log(`Visiting the base URL: ${Cypress.env('dhis2BaseUrl')}`)
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
        })
        .catch((error) => {
            cy.log('Failed to find "Getting started" content')
            logPageState()
            throw error
        })
}
