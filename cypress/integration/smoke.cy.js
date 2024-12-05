import { TEST_AO } from '../data/index.js'
import { goToAO } from '../helpers/common.js'
import { goToStartPage } from '../helpers/startScreen.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('Smoke Test', () => {
    it('app loads with correct system and user settings', () => {
        cy.intercept('**userSettings**').as('userSettings')
        cy.intercept('**systemSettings**').as('systemSettings')

        goToStartPage()
        cy.log('Check user settings')
        cy.wait('@userSettings').then((interception) => {
            cy.log('userSettings', interception.response.body)
            expect(interception.response.body.keyUiLocale).to.equal('en')
            expect(
                interception.response.body.keyAnalysisDisplayProperty
            ).to.equal('name')
        })
        cy.log('Check system settings')
        cy.wait('@systemSettings').then((interception) => {
            cy.log('systemsettings', interception.response.body)
            expect(
                interception.response.body.keyAnalysisRelativePeriod
            ).to.equal('LAST_12_MONTHS')
            expect(
                interception.response.body.keyAnalysisDigitGroupSeparator
            ).to.equal('SPACE')
        })

        cy.log('Check app is loaded')
        cy.contains('Getting started', EXTENDED_TIMEOUT).should('be.visible')
        cy.title().should('equal', 'Line Listing | DHIS2')
    })

    it('loads with visualization id', () => {
        cy.intercept('**/api/*/analytics/**').as('getAnalytics')
        goToAO(TEST_AO.id)

        cy.wait('@getAnalytics').then((interception) => {
            expect(interception.response.statusCode).to.equal(200)
            expect(interception.response.body.rows).to.be.an('array')
        })

        cy.getBySel('titlebar', EXTENDED_TIMEOUT)
            .should('be.visible')
            .and('contain', TEST_AO.name)

        cy.getBySel('line-list-table')
            .findBySel('table-body')
            .find('tr')
            .its('length')
            .should('be.gte', 0)
    })
})
