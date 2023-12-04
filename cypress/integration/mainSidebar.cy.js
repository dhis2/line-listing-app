import { TEST_AO } from '../data/index.js'
import { goToAO } from '../helpers/common.js'
import { clickMenubarViewButton } from '../helpers/menubar.js'
import { goToStartPage } from '../helpers/startScreen.js'

describe('main sidebar', () => {
    it('the main sidebar can be toggled by clicking the option in the view menu', () => {
        cy.setTestDescription(
            'Checks the ability to toggle the main sidebar using the option in the view menu.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'MainSidebar' },
            { key: 'action', value: 'ToggleUsingViewMenu' },
        ])

        goToStartPage()

        // Hiding
        clickMenubarViewButton()

        cy.getBySel('dhis2-uicore-hovermenulistitem')
            .contains('Hide dimensions sidebar')
            .should('be.visible')
            .click()

        cy.getBySel('main-sidebar').should('not.be.visible')

        // Showing
        clickMenubarViewButton()

        cy.getBySel('dhis2-uicore-hovermenulistitem')
            .contains('Show dimensions sidebar')
            .should('be.visible')
            .click()

        cy.getBySel('main-sidebar').should('be.visible')
    })

    it('the main sidebar can be toggled by clicking the fullscreen button', () => {
        cy.setTestDescription(
            'Verifies the functionality of toggling the main sidebar using the fullscreen button.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'MainSidebar' },
            { key: 'action', value: 'ToggleUsingFullscreen' },
        ])

        // Fullscreen button is only visible when a visualisation is showing
        goToAO(TEST_AO.id)

        // Hiding
        cy.getBySel('fullscreen-toggler')
            .should('be.visible')
            .trigger('mouseover')

        cy.getBySel('fullscreen-toggle-tooltip-content')
            .should('be.visible')
            .and('contain', 'Expand visualization and hide panels')

        cy.getBySel('fullscreen-toggler').click()

        cy.getBySel('main-sidebar').should('not.be.visible')

        // Showing
        cy.getBySel('fullscreen-toggler')
            .should('be.visible')
            .trigger('mouseover')

        cy.getBySel('fullscreen-toggle-tooltip-content')
            .should('be.visible')
            .and('contain', 'Show panels')

        cy.getBySel('fullscreen-toggler').should('be.visible').click()

        cy.getBySel('main-sidebar').should('be.visible')
    })
})
