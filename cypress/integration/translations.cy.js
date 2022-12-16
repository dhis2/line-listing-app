import { goToStartPage } from '../helpers/startScreen.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const UPDATE_BUTTON_ORIGINAL = 'Update'
const UPDATE_BUTTON_TRANSLATED = 'Oppdater'
const WELCOME_MSG_ORIGINAL = 'Getting started'
const WELCOME_MSG_TRANSLATED = 'Komme i gang'

const interceptLanguage = () => {
    cy.intercept('**userSettings**', (req) => {
        req.reply((res) => {
            res.send({
                body: {
                    ...res.body,
                    keyUiLocale: 'nb',
                },
            })
        })
    })
    cy.intercept(
        '**me?fields=authorities,avatar,email,name,settings**',
        (req) => {
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
        }
    )
}

describe('Translations', () => {
    it('translated language display correctly in the app', () => {
        interceptLanguage()

        goToStartPage()

        cy.contains(WELCOME_MSG_TRANSLATED, EXTENDED_TIMEOUT).should(
            'be.visible'
        )

        cy.contains(WELCOME_MSG_ORIGINAL).should('not.exist')
    })
    it('translated language display correctly in an Analytics component', () => {
        interceptLanguage()

        goToStartPage()

        cy.contains(UPDATE_BUTTON_TRANSLATED, EXTENDED_TIMEOUT).should(
            'be.visible'
        )

        cy.contains(UPDATE_BUTTON_ORIGINAL).should('not.exist')
    })
    it('original language display correctly in the app', () => {
        goToStartPage()

        cy.contains(WELCOME_MSG_ORIGINAL, EXTENDED_TIMEOUT).should('be.visible')

        cy.contains(WELCOME_MSG_TRANSLATED).should('not.exist')
    })
    it('original language display correctly in an Analytics component', () => {
        goToStartPage()

        cy.contains(UPDATE_BUTTON_ORIGINAL, EXTENDED_TIMEOUT).should(
            'be.visible'
        )

        cy.contains(UPDATE_BUTTON_TRANSLATED).should('not.exist')
    })
})
