import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('enrollment', () => {
    it('creates an enrollment line list', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        // open input selector and choose Enrollment
        cy.getWithDataTest('{main-sidebar}').contains('Input:').click()
        cy.getWithDataTest('{input-enrollment}').click()

        // select program dimensions
        cy.getWithDataTest('{main-sidebar}')
            .contains('Program dimensions')
            .click()
        cy.contains('Choose a program').click()
        cy.contains('Child Programme').click()

        cy.contains('BCG doses').click()
        cy.contains('Add to Columns').click()

        // close accessory panel
        cy.contains('Program dimensions').click()

        // add a date
        cy.contains('Date of enrollment').click()
        cy.contains('Last 12 months').dblclick()
        cy.contains('Add to Columns').click()

        cy.contains('Update').click()

        // assert
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
        cy.get('th').contains('BCG doses').should('be.visible')
        cy.get('th').contains('Date of enrollment').should('be.visible')

        //check the chips in the layout
        cy.getWithDataTest('{layout-chip}')
            .contains('Organisation unit: 1 selected')
            .should('be.visible')
    })

    it('moves a dimension to filter', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        // open input selector and choose Enrollment
        cy.getWithDataTest('{main-sidebar}').contains('Input:').click()
        cy.getWithDataTest('{input-enrollment}').click()

        // select program dimensions
        cy.getWithDataTest('{main-sidebar}')
            .contains('Program dimensions')
            .click()
        cy.contains('Choose a program').click()
        cy.contains('Child Programme').click()

        cy.contains('BCG doses', { matchCase: false }).click()
        cy.contains('Add to Columns').click()

        // close accessory panel
        cy.getWithDataTest('{main-sidebar}')
            .contains('Program dimensions')
            .click()

        // add a date
        cy.contains('Date of enrollment').click()
        cy.contains('Last 12 months').dblclick()
        cy.contains('Add to Columns').click()

        cy.contains('Update').click()

        cy.get('#axis-group-1')
            .findWithDataTest('{layout-dimension-menu-button-enrollmentDate}')
            .click()
        cy.contains('Move to Filter').click()

        cy.contains('Update').click()

        cy.getWithDataTest('{line-list-table}')
            .find('thead')
            .find('th')
            .its('length')
            .should('equal', 2)

        cy.get('th').contains('Organisation unit').should('be.visible')
        cy.get('th').contains('BCG doses').should('be.visible')
        cy.get('th').contains('Date of enrollment').should('not.exist')
    })
})
