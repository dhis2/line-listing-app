import { EXTENDED_TIMEOUT } from '../support/util.js'

export const goToStartPage = (skipEval) => {
    cy.intercept('GET', '**/system/info**', (req) => {
        expect(req.url).to.equal('http://localhost:8080/api/system/info')
    }).as('systemInfoRequest')

    cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))

    cy.wait('@systemInfoRequest').its('response.statusCode').should('eq', 200)

    const cypressEnv = Cypress.env()

    expect(cypressEnv.dhis2BaseUrl).to.eq('http://localhost:8080')
    expect(cypressEnv.dhis2InstanceVersion).be.oneOf(['2.40.1', '2.38.4.3'])
    expect(cypressEnv.dhis2Password).to.eq('district')
    expect(cypressEnv.dhis2Username).to.eq('admin')

    cy.log(`dhis2BaseUrl: ${cypressEnv.dhis2BaseUrl}`)
    cy.log(`dhis2InstanceVersion: ${cypressEnv.dhis2InstanceVersion}`)
    cy.log(`dhis2Password: ${cypressEnv.dhis2Password}`)
    cy.log(`dhis2Username: ${cypressEnv.dhis2Username}`)

    if (!skipEval) {
        expectStartScreenToBeVisible()
    }
}

export const expectStartScreenToBeVisible = () =>
    cy.contains('Getting started', EXTENDED_TIMEOUT).should('be.visible')
