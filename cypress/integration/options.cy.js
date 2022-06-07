import { addProgramDimensions } from '../helpers/addProgramDimensions.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const previousYearStr = (new Date().getFullYear() - 1).toString()

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
        cy.getWithDataTest('{menubar}').contains('Options').click()
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
        cy.getWithDataTest('{menubar}').contains('Options').click()
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

    it('sets digit group separator', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        //set up table
        addProgramDimensions({
            programName: 'Child Programme',
            stageName: 'Birth',
            dimensions: ['MCH Weight (g)'],
        })

        // choose Jan 1 of the previous year as the period
        cy.contains('Report date').click()
        cy.contains('Choose from presets').click()
        cy.contains('Fixed periods').click()
        cy.getWithDataTest(
            '{period-dimension-fixed-period-filter-period-type-content}'
        ).click()
        cy.contains('Daily').click()
        cy.getWithDataTest(
            '{period-dimension-fixed-period-filter-year-content}'
        )
            .clear()
            .type(previousYearStr)
        cy.contains(`${previousYearStr}-01-01`).dblclick()
        cy.contains('Add to Columns').click()

        cy.getWithDataTest('{menubar}').contains('Update').click()

        cy.getWithDataTest('{line-list-table}')
            .find('tbody > tr')
            .eq(0)
            .find('td')
            .eq(1)
            .should('contain', '1 232')

        // // set dgs to comma
        cy.getWithDataTest('{menubar}').contains('Options').click()
        cy.getWithDataTest('{dgs-select-content}')
            .findWithDataTest('{dhis2-uicore-select-input}')
            .click()
        cy.contains('Comma').click()
        cy.getWithDataTest('{options-modal-actions}').contains('Update').click()

        cy.getWithDataTest('{line-list-table}')
            .find('tbody > tr')
            .eq(0)
            .find('td')
            .eq(1)
            .should('contain', '1,232')
    })
})
