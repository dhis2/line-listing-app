import { TEST_AO } from '../data/index.js'
import { goToAO } from '../helpers/common.js'
import { goToStartPage } from '../helpers/startScreen.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('Smoke Test', () => {
    it('loads', () => {
        goToStartPage()
        cy.contains('Getting started', EXTENDED_TIMEOUT).should('be.visible')
        cy.title().should('equal', 'Line Listing | DHIS2')
    })

    it('loads with visualization id', () => {
        goToAO(TEST_AO.id)

        cy.getBySel('titlebar', EXTENDED_TIMEOUT)
            .should('be.visible')
            .and('contain', TEST_AO.name)
    })

    it('system and user settings are correct', () => {
        cy.intercept('**userSettings**').as('userSettings')
        cy.intercept('**systemSettings**').as('systemSettings')
        goToStartPage()
        cy.wait('@userSettings').then((interception) => {
            cy.log('userSettings', interception.response.body)
            expect(interception.response.body.keyUiLocale).to.equal('en')
            expect(
                interception.response.body.keyAnalysisDisplayProperty
            ).to.equal('name')
        })
        cy.wait('@systemSettings').then((interception) => {
            cy.log('systemsettings', interception.response.body)
            expect(
                interception.response.body.keyAnalysisRelativePeriod
            ).to.equal('LAST_6_MONTHS')
        })
    })
})
