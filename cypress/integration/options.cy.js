import { DIMENSION_ID_ENROLLMENT_DATE } from '../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_AO,
    TEST_DIM_PHONE_NUMBER,
    TEST_DIM_INTEGER,
    TEST_REL_PE_THIS_YEAR,
} from '../data/index.js'
import { goToAO } from '../helpers/common.js'
import { selectEnrollmentProgramDimensions } from '../helpers/dimensions.js'
import {
    clickMenubarOptionsButton,
    clickMenubarUpdateButton,
} from '../helpers/menubar.js'
import { selectRelativePeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import { getTableDataCells, getTableRows } from '../helpers/table.js'

describe('options', () => {
    it('sets display density', () => {
        goToAO(TEST_AO.id)

        // assert the default density of table cell
        getTableDataCells()
            .invoke('css', 'padding')
            .should('equal', '8px 2px 6px 6px')

        // set to comfortable density
        clickMenubarOptionsButton()
        cy.getBySel('display-density-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('Comfortable').click()
        cy.getBySel('options-modal-actions').contains('Update').click()

        // assert comfortable density
        getTableDataCells()
            .invoke('css', 'padding')
            .should('equal', '10px 4px 8px 8px')

        // set to compact density
        clickMenubarOptionsButton()
        cy.getBySel('display-density-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('Compact').click()
        cy.getBySel('options-modal-actions').contains('Update').click()

        // assert compact density
        getTableDataCells()
            .invoke('css', 'padding')
            .should('equal', '6px 2px 4px 6px')
    })

    it('sets font size', () => {
        const REGULAR_FONT_SIZE = 12

        goToAO(TEST_AO.id)

        // assert the font size of table cell
        getTableDataCells()
            .invoke('css', 'font-size')
            .then((fontSize) => parseInt(fontSize))
            .should('equal', REGULAR_FONT_SIZE)

        // set to small font size
        clickMenubarOptionsButton()
        cy.getBySel('font-size-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('Small').click()
        cy.getBySel('options-modal-actions').contains('Update').click()

        //assert small font size
        getTableDataCells()
            .invoke('css', 'font-size')
            .then((fontSize) => parseInt(fontSize))
            .should('be.lt', REGULAR_FONT_SIZE)

        // set to large font size
        clickMenubarOptionsButton()
        cy.getBySel('font-size-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('Large').click()
        cy.getBySel('options-modal-actions').contains('Update').click()

        // assert large font size
        getTableDataCells()
            .invoke('css', 'font-size')
            .then((fontSize) => parseInt(fontSize))
            .should('be.gt', REGULAR_FONT_SIZE)
    })

    it('sets digit group separator', () => {
        goToStartPage()

        // set up table
        selectEnrollmentProgramDimensions({
            ...E2E_PROGRAM,
            dimensions: [TEST_DIM_PHONE_NUMBER, TEST_DIM_INTEGER],
        })

        selectRelativePeriod({
            label: E2E_PROGRAM[DIMENSION_ID_ENROLLMENT_DATE],
            period: TEST_REL_PE_THIS_YEAR,
        })

        clickMenubarUpdateButton()

        const PHONE_NUMBER = '555-1212'

        // assert the default dgs space on number but not phone number
        getTableRows().eq(0).find('td').eq(1).should('contain', PHONE_NUMBER)
        getTableRows().eq(0).find('td').eq(2).should('contain', '333 333 444')

        // set dgs to comma
        clickMenubarOptionsButton()
        cy.getBySel('dgs-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('Comma').click()
        cy.getBySel('options-modal-actions').contains('Update').click()

        getTableRows().eq(0).find('td').eq(1).should('contain', PHONE_NUMBER)
        getTableRows().eq(0).find('td').eq(2).should('contain', '333,333,444')

        // set dgs to none
        clickMenubarOptionsButton()
        cy.getBySel('dgs-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('None').click()
        cy.getBySel('options-modal-actions').contains('Update').click()

        getTableRows().eq(0).find('td').eq(1).should('contain', PHONE_NUMBER)
        getTableRows().eq(0).find('td').eq(2).should('contain', '333333444')

        // set dgs to space
        clickMenubarOptionsButton()
        cy.getBySel('dgs-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('Space').click()
        cy.getBySel('options-modal-actions').contains('Update').click()

        getTableRows().eq(0).find('td').eq(1).should('contain', PHONE_NUMBER)
        getTableRows().eq(0).find('td').eq(2).should('contain', '333 333 444')
    })
})
