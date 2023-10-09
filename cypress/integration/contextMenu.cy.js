import { AXIS_ID_COLUMNS, AXIS_ID_FILTERS } from '@dhis2/analytics'
import {
    expectAxisToHaveDimension,
    expectAxisToNotHaveDimension,
} from '../helpers/layout.js'
import { goToStartPage } from '../helpers/startScreen.js'

describe('using the layout chip context menu', () => {
    const TEST_DIM_ID = 'ou'
    const openContextMenu = (id) =>
        cy
            .getBySel(`layout-chip-${id}`)
            .findBySel('dimension-menu-button')
            .click()

    it('moves item', () => {
        cy.intercept('GET', '**/system/info**', (req) => {
            expect(req.url).to.equal('http://localhost:8080/api/system/info')
        }).as('systemInfoRequest')

        cy.wait('@systemInfoRequest')
            .its('response.statusCode')
            .should('eq', 200)

        const cypressEnv = Cypress.env()

        expect(cypressEnv.dhis2BaseUrl).to.eq('http://localhost:8080')
        expect(cypressEnv.dhis2InstanceVersion).be.oneOf(['2.40.1', '2.38.4.3'])
        expect(cypressEnv.dhis2Password).to.eq('district')
        expect(cypressEnv.dhis2Username).to.eq('admin')

        cy.log(`dhis2BaseUrl: ${cypressEnv.dhis2BaseUrl}`)
        cy.log(`dhis2InstanceVersion: ${cypressEnv.dhis2InstanceVersion}`)
        cy.log(`dhis2Password: ${cypressEnv.dhis2Password}`)
        cy.log(`dhis2Username: ${cypressEnv.dhis2Username}`)

        goToStartPage()

        expectAxisToHaveDimension(AXIS_ID_COLUMNS, TEST_DIM_ID)
        expectAxisToNotHaveDimension(AXIS_ID_FILTERS, TEST_DIM_ID)

        openContextMenu(TEST_DIM_ID)
        cy.contains('Move to Filter').click()
        expectAxisToHaveDimension(AXIS_ID_FILTERS, TEST_DIM_ID)
        expectAxisToNotHaveDimension(AXIS_ID_COLUMNS, TEST_DIM_ID)
    })
    it('removes item', () => {
        goToStartPage()
        openContextMenu(TEST_DIM_ID)
        cy.containsExact('Remove').click()
        expectAxisToNotHaveDimension(AXIS_ID_COLUMNS, TEST_DIM_ID)
        expectAxisToNotHaveDimension(AXIS_ID_FILTERS, TEST_DIM_ID)
    })
})
