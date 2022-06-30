import { TEST_AOS } from '../data/index.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const TEST_AO = TEST_AOS[0]

describe('Smoke Test', () => {
    it('loads', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        cy.contains('Getting started', EXTENDED_TIMEOUT).should('be.visible')
        cy.title().should('equal', 'Line Listing | DHIS2')
    })

    it('loads with visualization id', () => {
        cy.visit(`#/${TEST_AO.id}`, EXTENDED_TIMEOUT)

        cy.getWithDataTest('{visualization-title}', EXTENDED_TIMEOUT)
            .should('be.visible')
            .and('contain', TEST_AO.name)
    })
})
