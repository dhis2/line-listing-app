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
        cy.setTestDescription(
            'Checks if the application correctly displays translated text for the main interface in the Norwegian language.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'Localization' },
            { key: 'action', value: 'DisplayTranslatedText' },
            { key: 'type', value: 'UILocalization' },
            { key: 'language', value: 'Norwegian' },
        ])
        interceptLanguage()

        goToStartPage(true)

        cy.contains(WELCOME_MSG_TRANSLATED, EXTENDED_TIMEOUT).should(
            'be.visible'
        )

        cy.contains(WELCOME_MSG_ORIGINAL).should('not.exist')
    })
    it('translated language display correctly in an Analytics component', () => {
        cy.setTestDescription(
            'Verifies that Analytics components render properly with translated text in Norwegian.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'Localization' },
            { key: 'action', value: 'DisplayAnalyticsTranslated' },
            { key: 'type', value: 'ComponentLocalization' },
            { key: 'language', value: 'Norwegian' },
        ])
        interceptLanguage()

        goToStartPage(true)

        cy.contains(UPDATE_BUTTON_TRANSLATED, EXTENDED_TIMEOUT).should(
            'be.visible'
        )

        cy.contains(UPDATE_BUTTON_ORIGINAL).should('not.exist')
    })
    it('original language display correctly in the app', () => {
        cy.setTestDescription(
            'Ensures that the main interface of the application displays the original English text correctly.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'Localization' },
            { key: 'action', value: 'DisplayOriginalText' },
            { key: 'type', value: 'UIOriginalLanguage' },
            { key: 'language', value: 'English' },
        ])
        goToStartPage(true)

        cy.contains(WELCOME_MSG_ORIGINAL, EXTENDED_TIMEOUT).should('be.visible')

        cy.contains(WELCOME_MSG_TRANSLATED).should('not.exist')
    })
    it('original language display correctly in an Analytics component', () => {
        cy.setTestDescription(
            'Confirms that Analytics components are correctly rendered with original English text.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'Localization' },
            { key: 'action', value: 'DisplayAnalyticsOriginal' },
            { key: 'type', value: 'ComponentOriginalLanguage' },
            { key: 'language', value: 'English' },
        ])
        goToStartPage(true)

        cy.contains(UPDATE_BUTTON_ORIGINAL, EXTENDED_TIMEOUT).should(
            'be.visible'
        )

        cy.contains(UPDATE_BUTTON_TRANSLATED).should('not.exist')
    })
})
