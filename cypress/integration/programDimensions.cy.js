import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('program dimensions', () => {
    beforeEach(() => {
        cy.visit('/')

        cy.getBySel('main-sidebar', EXTENDED_TIMEOUT).should('be.visible')
    })

    describe('event', () => {
        it('program can be selected and cleared', () => {
            cy.getBySel('main-sidebar').contains('Program dimensions').click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('program-clear-button').should('not.exist')

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            // select program

            cy.contains('HIV Case Surveillance').click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a program and stage above to add program dimensions.'
            )

            cy.getBySel('program-select').find('.disabled').should('be.visible')

            cy.getBySel('program-clear-button').should('be.visible')

            // clear program

            cy.getBySel('program-clear-button').click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('accessory-sidebar').contains('Choose a program')

            cy.getBySel('program-select').find('.disabled').should('not.exist')

            cy.getBySel('program-clear-button').should('not.exist')
        })

        it('stage can be selected and cleared', () => {
            cy.getBySel('main-sidebar').contains('Program dimensions').click()

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            cy.contains('HIV Case Surveillance').click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a program and stage above to add program dimensions.'
            )

            cy.getBySel('accessory-sidebar').contains('Stage')

            cy.getBySel('stage-clear-button').should('not.exist')

            // select stage

            cy.getBySel('accessory-sidebar').contains('Stage').click()

            cy.contains('Initial Case Report').click()

            cy.getBySel('stage-select').find('.disabled').should('be.visible')

            cy.getBySel('stage-clear-button').should('be.visible')

            cy.getBySel('accessory-sidebar').contains('All types')

            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .its('length')
                .should('be.gte', 1)

            // clear stage

            cy.getBySel('stage-clear-button').click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a program and stage above to add program dimensions.'
            )

            cy.getBySel('accessory-sidebar').contains('Stage')

            cy.getBySel('stage-select').find('.disabled').should('not.exist')

            cy.getBySel('stage-clear-button').should('not.exist')
        })
    })

    describe('enrollment', () => {
        beforeEach(() => {
            cy.getBySel('main-sidebar').contains('Input: Event').click()

            cy.getBySel('input-enrollment').click()

            cy.getBySel('main-sidebar').contains('Input: Enrollment').click()
        })

        it('program can be selected and cleared', () => {
            cy.getBySel('main-sidebar').contains('Program dimensions').click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('program-clear-button').should('not.exist')

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            // select program

            cy.contains('HIV Case Surveillance').click()

            cy.getBySel('program-select').find('.disabled').should('be.visible')

            cy.getBySel('program-clear-button').should('be.visible')

            cy.getBySel('accessory-sidebar').contains('All types')

            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .its('length')
                .should('be.gte', 1)

            // clear program

            cy.getBySel('program-clear-button').click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('accessory-sidebar').contains('Choose a program')

            cy.getBySel('program-select').find('.disabled').should('not.exist')

            cy.getBySel('program-clear-button').should('not.exist')
        })
    })
})

// TODO: add tests for search, type filtering and selecting dimensions
