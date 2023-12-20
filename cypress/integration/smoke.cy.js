import { TEST_AO } from '../data/index.js'
import { goToAO } from '../helpers/common.js'
import { goToStartPage } from '../helpers/startScreen.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('Smoke Test', () => {
    it('loads', () => {
        cy.setTestDescription(
            'Verifies that the main page of the application loads correctly and displays the expected content.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'ApplicationLoad' },
            { key: 'action', value: 'LoadMainPage' },
            { key: 'type', value: 'SmokeTest' },
        ])

        goToStartPage()
        cy.contains('Getting started', EXTENDED_TIMEOUT).should('be.visible')
        cy.title().should('equal', 'Line Listing | DHIS2')
    })

    it('loads with visualization id', () => {
        cy.setTestDescription(
            'Ensures that the application correctly loads a specific visualization identified by its ID.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'VisualizationLoad' },
            { key: 'action', value: 'LoadVisualizationById' },
            { key: 'type', value: 'SmokeTest' },
        ])

        goToAO(TEST_AO.id)

        cy.getBySel('titlebar', EXTENDED_TIMEOUT)
            .should('be.visible')
            .and('contain', TEST_AO.name)
    })
})
