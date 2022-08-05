import { DIMENSION_ID_ENROLLMENT_DATE } from '../../src/modules/dimensionConstants.js'
import {
    ANALYTICS_PROGRAM,
    TEST_AOS,
    TEST_DIM_NUMBER,
    TEST_REL_PE_THIS_YEAR,
} from '../data/index.js'
import { selectEnrollmentProgramDimensions } from '../helpers/dimensions.js'
import {
    clickMenubarOptionsButton,
    clickMenubarUpdateButton,
} from '../helpers/menubar.js'
import { selectRelativePeriod } from '../helpers/period.js'
import { getTableDataCells, getTableRows } from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const TEST_AO_ID = TEST_AOS[0].id

describe('options', () => {
    it('sets comfortable display density', () => {
        cy.visit(`#/${TEST_AO_ID}`, EXTENDED_TIMEOUT)

        //assert the default density of table cell
        getTableDataCells().invoke('css', 'padding').should('equal', '8px')

        // set to comfortable density
        clickMenubarOptionsButton()
        cy.getWithDataTest('{display-density-select-content}')
            .findWithDataTest('{dhis2-uicore-select-input}')
            .click()
        cy.contains('Comfortable').click()
        cy.getWithDataTest('{options-modal-actions}').contains('Update').click()

        //assert new density of table cell
        getTableDataCells()
            .invoke('css', 'padding')
            .should('equal', '16px 12px')
    })

    it('sets small font size', () => {
        cy.visit(`#/${TEST_AO_ID}`, EXTENDED_TIMEOUT)

        //assert the font size of table cell
        getTableDataCells().invoke('css', 'font-size').should('equal', '12px')

        // set to small font size
        clickMenubarOptionsButton()
        cy.getWithDataTest('{font-size-select-content}')
            .findWithDataTest('{dhis2-uicore-select-input}')
            .click()
        cy.contains('Small').click()
        cy.getWithDataTest('{options-modal-actions}').contains('Update').click()

        //assert new font size
        getTableDataCells().invoke('css', 'font-size').should('equal', '10px')
    })

    it('sets digit group separator', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        //set up table
        selectEnrollmentProgramDimensions({
            ...ANALYTICS_PROGRAM,
            dimensions: [TEST_DIM_NUMBER],
        })

        selectRelativePeriod({
            label: ANALYTICS_PROGRAM[DIMENSION_ID_ENROLLMENT_DATE],
            period: TEST_REL_PE_THIS_YEAR,
        })

        clickMenubarUpdateButton()

        //assert the default dgs space
        getTableRows().eq(0).find('td').eq(1).should('contain', '2 000 000')

        // set dgs to comma
        clickMenubarOptionsButton()
        cy.getWithDataTest('{dgs-select-content}')
            .findWithDataTest('{dhis2-uicore-select-input}')
            .click()
        cy.contains('Comma').click()
        cy.getWithDataTest('{options-modal-actions}').contains('Update').click()

        getTableRows().eq(0).find('td').eq(1).should('contain', '2,000,000')

        // set dgs to none
        clickMenubarOptionsButton()
        cy.getWithDataTest('{dgs-select-content}')
            .findWithDataTest('{dhis2-uicore-select-input}')
            .click()
        cy.contains('None').click()
        cy.getWithDataTest('{options-modal-actions}').contains('Update').click()

        getTableRows().eq(0).find('td').eq(1).should('contain', '2000000')
    })
})
