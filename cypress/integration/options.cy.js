import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('options', () => {
    it('sets comfortable display density', () => {
        cy.visit('#/R4wAb2yMLik', EXTENDED_TIMEOUT)

        //assert the default density of table cell
        cy.getWithDataTest('{line-list-table}')
            .find('tbody')
            .find('td')
            .invoke('css', 'padding')
            .should('equal', '8px')

        // set to comfortable density
        cy.getWithDataTest('{app-menubar}').contains('Options').click()
        cy.getWithDataTest('{display-density-select-content}')
            .findWithDataTest('{dhis2-uicore-select-input}')
            .click()
        cy.contains('Comfortable').click()
        cy.getWithDataTest('{options-modal-actions}').contains('Update').click()

        //assert new density of table cell
        cy.getWithDataTest('{line-list-table}')
            .find('tbody')
            .find('td')
            .invoke('css', 'padding')
            .should('equal', '16px 12px')
    })

    it('sets small font size', () => {
        cy.visit('#/R4wAb2yMLik', EXTENDED_TIMEOUT)

        //assert the font size of table cell
        cy.getWithDataTest('{line-list-table}')
            .find('tbody')
            .find('td')
            .invoke('css', 'font-size')
            .should('equal', '12px')

        // set to small font size
        cy.getWithDataTest('{app-menubar}').contains('Options').click()
        cy.getWithDataTest('{font-size-select-content}')
            .findWithDataTest('{dhis2-uicore-select-input}')
            .click()
        cy.contains('Small').click()
        cy.getWithDataTest('{options-modal-actions}').contains('Update').click()

        //assert new font size
        cy.getWithDataTest('{line-list-table}')
            .find('tbody')
            .find('td')
            .invoke('css', 'font-size')
            .should('equal', '10px')
    })
})
