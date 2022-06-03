import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('event', () => {
    it('creates an event line list', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        cy.contains('Program dimensions').click()
        cy.contains('Choose a program').click()
        cy.contains('Child Programme').click()
        cy.contains('Stage').click()
        cy.contains('Birth').click()
        cy.contains('Apgar Score').click()
        cy.contains('Add to Columns').click()
        cy.contains('Program dimensions').click()
        cy.contains('Report date').click()
        cy.contains('Last 12 months').dblclick()
        cy.contains('Add to Columns').click()

        cy.contains('Update').click()

        cy.getWithDataTest('{line-list-table}', EXTENDED_TIMEOUT).should(
            'be.visible'
        )

        cy.getWithDataTest('{line-list-table}')
            .find('thead')
            .find('th')
            .its('length')
            .should('equal', 3)
        cy.getWithDataTest('{line-list-table}')
            .find('tbody')
            .find('tr')
            .its('length')
            .should('be.gte', 1)

        cy.get('th').contains('Organisation unit').should('be.visible')
        cy.get('th').contains('Apgar Score').should('be.visible')
        cy.get('th').contains('Report date').should('be.visible')

        //check the chips in the layout
        cy.getWithDataTest('{layout-chip}')
            .contains('Organisation unit: 1 selected')
            .should('be.visible')
    })

    it('moves a dimension to filter', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        cy.contains('Program dimensions').click()
        cy.contains('Choose a program').click()
        cy.contains('Child Programme').click()
        cy.contains('Stage').click()
        cy.contains('Birth').click()
        cy.contains('Apgar Score').click()
        cy.contains('Add to Columns').click()
        cy.contains('Program dimensions').click()
        cy.contains('Report date').click()
        cy.contains('Last 12 months').dblclick()
        cy.contains('Add to Columns').click()

        cy.contains('Update').click()

        cy.get('#axis-group-1')
            .findWithDataTest('{layout-dimension-menu-button-eventDate}')
            .click()
        cy.contains('Move to Filter').click()

        cy.contains('Update').click()

        cy.getWithDataTest('{line-list-table}')
            .find('thead')
            .find('th')
            .its('length')
            .should('equal', 2)

        cy.get('th').contains('Organisation unit').should('be.visible')
        cy.get('th').contains('Apgar Score').should('be.visible')
        cy.get('th').contains('Report date').should('not.exist')
    })
})
