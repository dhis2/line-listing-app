import { goToStartPage } from '../helpers/startScreen.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const UPDATE_BUTTON_ORIGINAL = 'Update'
const UPDATE_BUTTON_TRANSLATED = 'Oppdater'
const WELCOME_MSG_ORIGINAL = 'Getting started'
const WELCOME_MSG_TRANSLATED = 'Komme i gang'

const setUserLocale = (locale) => {
    const dhis2BaseUrl = Cypress.env('dhis2BaseUrl')
    const dhis2InstanceVersion = Cypress.env('dhis2InstanceVersion')
    const versionParts = dhis2InstanceVersion.split('.')
    const apiVersion =
        versionParts.length === 1 ? versionParts[0] : versionParts[1]
    const url = `${dhis2BaseUrl}/api/${apiVersion}/userSettings/keyUiLocale`

    if (locale) {
        cy.request({
            url,
            method: 'POST',
            body: 'nb',
        })
            .its('status')
            .should('equal', 200)
    } else {
        cy.request({
            url,
            method: 'DELETE',
        })
            .its('status')
            .should('equal', 200)
    }
}

describe('Translations', () => {
    it('translated language display correctly in the app', () => {
        setUserLocale('nb')
        goToStartPage(true)

        cy.contains(WELCOME_MSG_TRANSLATED, EXTENDED_TIMEOUT).should(
            'be.visible'
        )

        cy.contains(WELCOME_MSG_ORIGINAL).should('not.exist')
        setUserLocale(null)
    })
    it('translated language display correctly in an Analytics component', () => {
        setUserLocale('nb')
        goToStartPage(true)

        cy.contains(UPDATE_BUTTON_TRANSLATED, EXTENDED_TIMEOUT).should(
            'be.visible'
        )

        cy.contains(UPDATE_BUTTON_ORIGINAL).should('not.exist')
        setUserLocale(null)
    })
    it('original language display correctly in the app', () => {
        setUserLocale(null)
        goToStartPage(true)

        cy.contains(WELCOME_MSG_ORIGINAL, EXTENDED_TIMEOUT).should('be.visible')

        cy.contains(WELCOME_MSG_TRANSLATED).should('not.exist')
    })
    it('original language display correctly in an Analytics component', () => {
        setUserLocale(null)
        goToStartPage(true)

        cy.contains(UPDATE_BUTTON_ORIGINAL, EXTENDED_TIMEOUT).should(
            'be.visible'
        )

        cy.contains(UPDATE_BUTTON_TRANSLATED).should('not.exist')
    })
})
