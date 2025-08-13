import { goToStartPage } from '../helpers/startScreen.js'
import { EXTENDED_TIMEOUT, getApiBaseUrl } from '../support/util.js'

const UPDATE_BUTTON_ORIGINAL = 'Update'
const UPDATE_BUTTON_TRANSLATED = 'Oppdater'
const WELCOME_MSG_ORIGINAL = 'Getting started'
const WELCOME_MSG_TRANSLATED = 'Komme i gang'

const interceptLanguage = () => {
    const apiBaseUrl = getApiBaseUrl()

    cy.intercept(`${apiBaseUrl}/userSettings*`, (req) => {
        req.reply((res) => {
            res.send({
                body: {
                    ...res.body,
                    keyUiLocale: 'nb',
                },
            })
        })
    })
    cy.intercept(`${apiBaseUrl}/me?fields=*`, (req) => {
        req.reply((res) => {
            res.send({
                body: {
                    ...res.body,
                    settings: {
                        ...res.body.settings,
                        keyUiLocale: 'nb',
                    },
                },
            })
        })
    })
}

describe('Translations', () => {
    it('translated language display correctly in the app', () => {
        interceptLanguage()

        goToStartPage(true)

        cy.contains(WELCOME_MSG_TRANSLATED, EXTENDED_TIMEOUT).should(
            'be.visible'
        )

        cy.contains(WELCOME_MSG_ORIGINAL).should('not.exist')
    })
    it('translated language display correctly in an Analytics component', () => {
        interceptLanguage()

        goToStartPage(true)

        cy.contains(UPDATE_BUTTON_TRANSLATED, EXTENDED_TIMEOUT).should(
            'be.visible'
        )

        cy.contains(UPDATE_BUTTON_ORIGINAL).should('not.exist')
    })
    it('original language display correctly in the app', () => {
        goToStartPage(true)

        cy.contains(WELCOME_MSG_ORIGINAL, EXTENDED_TIMEOUT).should('be.visible')

        cy.contains(WELCOME_MSG_TRANSLATED).should('not.exist')
    })
    it('original language display correctly in an Analytics component', () => {
        goToStartPage(true)

        cy.contains(UPDATE_BUTTON_ORIGINAL, EXTENDED_TIMEOUT).should(
            'be.visible'
        )

        cy.contains(UPDATE_BUTTON_TRANSLATED).should('not.exist')
    })
})
