import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
} from '../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_AO,
    TEST_DIM_PHONE_NUMBER,
    TEST_DIM_INTEGER,
    TEST_REL_PE_THIS_YEAR,
} from '../data/index.js'
import { goToAO } from '../helpers/common.js'
import {
    selectEnrollmentWithProgramDimensions,
    selectEventWithProgramDimensions,
} from '../helpers/dimensions.js'
import { saveVisualization } from '../helpers/fileMenu.js'
import {
    openStyleOptionsModal,
    clickMenubarUpdateButton,
} from '../helpers/menubar.js'
import {
    getCurrentYearStr,
    selectFixedPeriod,
    selectRelativePeriod,
} from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    expectAOTitleToContain,
    expectTableToBeVisible,
    getTableDataCells,
    getTableRows,
} from '../helpers/table.js'

const currentYear = getCurrentYearStr()

describe('options', () => {
    it('sets display density', () => {
        cy.setTestDescription(
            'Verifies the functionality of setting display density in table cells.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'TableOptions' },
            { key: 'action', value: 'SetDisplayDensity' },
            { key: 'option', value: 'DisplayDensity' },
        ])

        goToAO(TEST_AO.id)

        // assert the default density of table cell
        getTableDataCells()
            .invoke('css', 'padding')
            .should('equal', '7px 6px 5px')

        // set to comfortable density
        openStyleOptionsModal()
        cy.getBySel('display-density-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('Comfortable').click()
        cy.getBySel('options-modal-actions').contains('Update').click()

        // assert comfortable density
        getTableDataCells()
            .invoke('css', 'padding')
            .should('equal', '10px 8px 8px')

        // set to compact density
        openStyleOptionsModal()
        cy.getBySel('display-density-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('Compact').click()
        cy.getBySel('options-modal-actions').contains('Update').click()

        // assert compact density
        getTableDataCells()
            .invoke('css', 'padding')
            .should('equal', '6px 6px 4px')
    })

    it('sets font size', () => {
        cy.setTestDescription(
            'Checks the ability to set different font sizes in table cells.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'TableOptions' },
            { key: 'action', value: 'SetFontSize' },
            { key: 'option', value: 'FontSize' },
        ])

        const REGULAR_FONT_SIZE = 12

        goToAO(TEST_AO.id)

        // assert the font size of table cell
        getTableDataCells()
            .invoke('css', 'font-size')
            .then((fontSize) => parseInt(fontSize))
            .should('equal', REGULAR_FONT_SIZE)

        // set to small font size
        openStyleOptionsModal()
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
        openStyleOptionsModal()
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
        cy.setTestDescription(
            'Ensures the digit group separator can be set and affects table cell data.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'TableOptions' },
            { key: 'action', value: 'SetDigitGroupSeparator' },
            { key: 'option', value: 'DigitGroupSeparator' },
        ])

        goToStartPage()

        // set up table
        selectEventWithProgramDimensions({
            ...E2E_PROGRAM,
            dimensions: [TEST_DIM_PHONE_NUMBER, TEST_DIM_INTEGER],
        })

        selectFixedPeriod({
            label: E2E_PROGRAM[DIMENSION_ID_EVENT_DATE],
            period: {
                year: currentYear,
                name: `April ${currentYear}`,
            },
        })

        clickMenubarUpdateButton()

        const PHONE_NUMBER = '555-1212'

        // assert the default dgs space on number but not phone number
        getTableRows().eq(0).find('td').eq(1).should('contain', PHONE_NUMBER)
        getTableRows().eq(0).find('td').eq(2).should('contain', '333 333 444')

        // set dgs to comma
        openStyleOptionsModal()
        cy.getBySel('dgs-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('Comma').click()
        cy.getBySel('options-modal-actions').contains('Update').click()

        getTableRows().eq(0).find('td').eq(1).should('contain', PHONE_NUMBER)
        getTableRows().eq(0).find('td').eq(2).should('contain', '333,333,444')

        // set dgs to none
        openStyleOptionsModal()
        cy.getBySel('dgs-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('None').click()
        cy.getBySel('options-modal-actions').contains('Update').click()

        getTableRows().eq(0).find('td').eq(1).should('contain', PHONE_NUMBER)
        getTableRows().eq(0).find('td').eq(2).should('contain', '333333444')

        // set dgs to space
        openStyleOptionsModal()
        cy.getBySel('dgs-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('Space').click()
        cy.getBySel('options-modal-actions').contains('Update').click()

        getTableRows().eq(0).find('td').eq(1).should('contain', PHONE_NUMBER)
        getTableRows().eq(0).find('td').eq(2).should('contain', '333 333 444')
    })
})

describe(['>=40'], 'ou hierarchy', () => {
    it('sets organisation unit hierarchy', () => {
        cy.setTestDescription(
            'Verifies the functionality of displaying organisation unit hierarchy in table cells.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'OrgUnitOptions' },
            { key: 'action', value: 'SetOrgUnitHierarchy' },
            { key: 'option', value: 'OrgUnitHierarchy' },
        ])

        const NAME_WITHOUT_HIERARCHY = 'Ngelehun CHC'
        const NAME_WITH_HIERARCHY = 'Sierra Leone / Bo / Badjia / Ngelehun CHC'

        goToStartPage()

        // set up table
        selectEnrollmentWithProgramDimensions({
            ...E2E_PROGRAM,
            dimensions: [TEST_DIM_INTEGER],
        })

        selectRelativePeriod({
            label: E2E_PROGRAM[DIMENSION_ID_ENROLLMENT_DATE],
            period: TEST_REL_PE_THIS_YEAR,
        })

        // create new AO - no hierarchy is shown
        clickMenubarUpdateButton()
        getTableRows()
            .eq(0)
            .find('td')
            .eq(0)
            .containsExact(NAME_WITHOUT_HIERARCHY)

        // enable show hierarchy - hierarchy is shown
        openStyleOptionsModal()
        cy.getBySel('options-modal-content')
            .contains('Display organisation unit hierarchy')
            .click()
            .find('[type="checkbox"]')
            .should('be.checked')
        cy.getBySel('options-modal-actions').contains('Update').click()
        getTableRows().eq(0).find('td').eq(0).containsExact(NAME_WITH_HIERARCHY)

        // save / load - hierarchy is still shown
        const AO_NAME = `TEST ${new Date().toLocaleString()}`
        saveVisualization(AO_NAME)
        expectAOTitleToContain(AO_NAME)
        expectTableToBeVisible()
        getTableRows().eq(0).find('td').eq(0).containsExact(NAME_WITH_HIERARCHY)

        // disable show hierarchy - no hierarchy is shown
        openStyleOptionsModal()
        cy.getBySel('options-modal-content')
            .contains('Display organisation unit hierarchy')
            .click()
            .find('[type="checkbox"]')
            .should('not.be.checked')
        cy.getBySel('options-modal-actions').contains('Update').click()
        getTableRows()
            .eq(0)
            .find('td')
            .eq(0)
            .containsExact(NAME_WITHOUT_HIERARCHY)
    })
})
