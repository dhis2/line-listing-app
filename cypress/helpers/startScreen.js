import { EXTENDED_TIMEOUT } from '../support/util.js'

export const goToStartPage = (skipEval) => {
    cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))

    cy.intercept('GET', '**/system/info**', (req) => {
        expect(req.url).to.equal('http://localhost:8080/api/system/info')
    }).as('systemInfoRequest')

    cy.wait('@systemInfoRequest').its('response.statusCode').should('eq', 200)

    const cypressEnv = Cypress.env()

    expect(cypressEnv.dhis2BaseUrl).to.eq('http://localhost:8080')
    expect(cypressEnv.dhis2InstanceVersion).be.oneOf(['2.40.1', '2.38.4.3'])
    expect(cypressEnv.dhis2Password).to.eq('district')
    expect(cypressEnv.dhis2Username).to.eq('admin')

    if (!skipEval) {
        expectStartScreenToBeVisible()
    }
}

export const expectStartScreenToBeVisible = () =>
    cy.contains('Getting started', EXTENDED_TIMEOUT).should('be.visible')
