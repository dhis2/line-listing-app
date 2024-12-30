import { EXTENDED_TIMEOUT } from '../support/util.js'

export const goToStartPage = (skipEval) => {
    const appPath = '/api/apps/line-listing/index.html';
    const baseUrl = Cypress.env('dhis2BaseUrl') + appPath;
    cy.visit(baseUrl, EXTENDED_TIMEOUT).then(() => {
        cy.task('log', `Visiting the base URL: ${baseUrl}`)
        if (!skipEval) {
            expectStartScreenToBeVisible()
        }
    })
}

export const expectStartScreenToBeVisible = () =>
    cy.contains('Getting started', EXTENDED_TIMEOUT).should('be.visible')
