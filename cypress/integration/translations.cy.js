import { EXTENDED_TIMEOUT } from '../support/util.js'

const UPDATE_BUTTON_ORIGINAL = 'Update'
const UPDATE_BUTTON_TRANSLATED = 'Oppdater'
const WELCOME_MSG_ORIGINAL = 'Getting started'
const WELCOME_MSG_TRANSLATED = 'TODO - change this' // TODO: Change to what "Getting started" is translated to

describe('Translations', () => {
    it('translated language display correctly in the app', () => {
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

        cy.visit('/', EXTENDED_TIMEOUT)

        // translation from an Analytics component
        cy.contains(UPDATE_BUTTON_TRANSLATED, EXTENDED_TIMEOUT).should(
            'be.visible'
        )
        cy.contains(UPDATE_BUTTON_ORIGINAL).should('not.exist')

        // TODO: assert that a translation from the app itself (e.g. "Getting started") is translated
        // cy.contains(WELCOME_MSG_TRANSLATED).should('be.visible')
        // cy.contains(WELCOME_MSG_ORIGINAL).should('not.exist')
    })
    it('original language display correctly in the app', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        // translation from an Analytics component
        cy.contains(UPDATE_BUTTON_ORIGINAL).should('be.visible')
        cy.contains(UPDATE_BUTTON_TRANSLATED).should('not.exist')

        cy.contains(WELCOME_MSG_ORIGINAL).should('be.visible')
        cy.contains(WELCOME_MSG_TRANSLATED).should('not.exist')
    })
})
