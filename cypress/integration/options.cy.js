import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
} from '../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_AO,
    TEST_DIM_PHONE_NUMBER,
    TEST_DIM_INTEGER,
    TEST_DIM_NUMBER,
    TEST_REL_PE_THIS_YEAR,
} from '../data/index.js'
import { goToAO } from '../helpers/common.js'
import {
    selectEnrollmentWithProgramDimensions,
    selectEventWithProgramDimensions,
    selectTrackedEntityWithTypeAndProgramDimensions,
} from '../helpers/dimensions.js'
import { saveVisualization } from '../helpers/fileMenu.js'
import {
    openDataOptionsModal,
    openStyleOptionsModal,
    clickMenubarUpdateButton,
} from '../helpers/menubar.js'
import { clickOptionsModalUpdateButton } from '../helpers/options.js'
import {
    getCurrentYearStr,
    selectFixedPeriod,
    selectRelativePeriod,
} from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    expectAOTitleToContain,
    expectTableToBeUpdated,
    expectTableToBeVisible,
    getTableDataCells,
    getTableHeaderCells,
    getTableRows,
} from '../helpers/table.js'

const currentYear = getCurrentYearStr()

describe('options', () => {
    it('sets display density', () => {
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
        clickOptionsModalUpdateButton()

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
        clickOptionsModalUpdateButton()

        // assert compact density
        getTableDataCells()
            .invoke('css', 'padding')
            .should('equal', '6px 6px 4px')
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
        openStyleOptionsModal()

        cy.getBySel('font-size-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('Small').click()
        clickOptionsModalUpdateButton()

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
        clickOptionsModalUpdateButton()

        // assert large font size
        getTableDataCells()
            .invoke('css', 'font-size')
            .then((fontSize) => parseInt(fontSize))
            .should('be.gt', REGULAR_FONT_SIZE)
    })

    it('sets digit group separator', () => {
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
        getTableRows().eq(0).find('td').eq(1).should('have.text', PHONE_NUMBER)
        getTableRows().eq(0).find('td').eq(2).should('have.text', '333 333 444')

        // set dgs to comma
        openStyleOptionsModal()

        cy.getBySel('dgs-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('Comma').click()
        clickOptionsModalUpdateButton()

        getTableRows().eq(0).find('td').eq(1).should('have.text', PHONE_NUMBER)
        getTableRows().eq(0).find('td').eq(2).should('have.text', '333,333,444')

        // set dgs to none
        openStyleOptionsModal()

        cy.getBySel('dgs-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('None').click()
        clickOptionsModalUpdateButton()

        getTableRows().eq(0).find('td').eq(1).should('have.text', PHONE_NUMBER)
        getTableRows().eq(0).find('td').eq(2).should('have.text', '333333444')

        // set dgs to space
        openStyleOptionsModal()

        cy.getBySel('dgs-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('Space').click()
        clickOptionsModalUpdateButton()

        getTableRows().eq(0).find('td').eq(1).should('have.text', PHONE_NUMBER)
        getTableRows().eq(0).find('td').eq(2).should('have.text', '333 333 444')
    })
})

describe('ou hierarchy', () => {
    it('sets organisation unit hierarchy', () => {
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
        clickOptionsModalUpdateButton()
        getTableRows().eq(0).find('td').eq(0).containsExact(NAME_WITH_HIERARCHY)

        // save / load - hierarchy is still shown
        const AO_NAME = `OPTIONS-${Date.now()}`

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
        clickOptionsModalUpdateButton()
        getTableRows()
            .eq(0)
            .find('td')
            .eq(0)
            .containsExact(NAME_WITHOUT_HIERARCHY)
    })
})

const testSkipRoundingForEvent = (roundedValue) => {
    goToStartPage()

    // set up table
    selectEventWithProgramDimensions({
        ...E2E_PROGRAM,
        dimensions: [TEST_DIM_NUMBER],
    })

    selectRelativePeriod({
        label: E2E_PROGRAM[DIMENSION_ID_EVENT_DATE],
        period: TEST_REL_PE_THIS_YEAR,
    })

    clickMenubarUpdateButton()

    getTableHeaderCells().find(`button[title*="${TEST_DIM_NUMBER}"]`).click()

    expectTableToBeUpdated()

    getTableRows().eq(0).find('td').eq(1).should('have.text', roundedValue)

    openDataOptionsModal()

    cy.getBySel('skip-rounding').click()
    clickOptionsModalUpdateButton()

    getTableRows().eq(0).find('td').eq(1).should('have.text', 3.123456)
}

const testSkipRoundingForEnrollment = (roundedValue) => {
    goToStartPage()

    // set up table
    selectEnrollmentWithProgramDimensions({
        ...E2E_PROGRAM,
        dimensions: [TEST_DIM_NUMBER],
    })

    selectRelativePeriod({
        label: E2E_PROGRAM[DIMENSION_ID_ENROLLMENT_DATE],
        period: TEST_REL_PE_THIS_YEAR,
    })

    clickMenubarUpdateButton()

    getTableHeaderCells().find(`button[title*="${TEST_DIM_NUMBER}"]`).click()

    expectTableToBeUpdated()

    getTableRows().eq(0).find('td').eq(1).should('have.text', roundedValue)

    openDataOptionsModal()

    cy.getBySel('skip-rounding').click()
    clickOptionsModalUpdateButton()

    getTableRows().eq(0).find('td').eq(1).should('have.text', 3.123456)
}

describe('skip rounding', () => {
    it('sets skip rounding for event', () => {
        testSkipRoundingForEvent('3.12')
    })
    /* Skip rounding for enrollment is implemented in v40.
     * However, in our v40 test instance the data we use for this
     * test is missing, which makes this test fail.
     * Until https://dhis2.atlassian.net/browse/DHIS2-17884 is resolved,
     * we will have to disable tests for these versions. */
    // VERSION-TOGGLE
    it(['>=41'], 'sets skip rounding for enrollment (41 and above)', () => {
        testSkipRoundingForEnrollment('3.12')
    })
    // VERSION-TOGGLE
    it(['>=41'], 'sets skip rounding for tracked entity (41 and above)', () => {
        goToStartPage()

        // set up table
        selectTrackedEntityWithTypeAndProgramDimensions({
            typeName: 'Person',
            programName: E2E_PROGRAM.programName,
            dimensions: [TEST_DIM_NUMBER],
        })

        selectRelativePeriod({
            label: E2E_PROGRAM[DIMENSION_ID_ENROLLMENT_DATE],
            period: TEST_REL_PE_THIS_YEAR,
        })

        clickMenubarUpdateButton()

        getTableHeaderCells()
            .find(`button[title*="${TEST_DIM_NUMBER}"]`)
            .click()

        expectTableToBeUpdated()

        getTableRows().eq(0).find('td').eq(1).should('have.text', 3.12)

        openDataOptionsModal()

        cy.getBySel('skip-rounding').click()
        clickOptionsModalUpdateButton()

        getTableRows().eq(0).find('td').eq(1).should('have.text', 3.123456)
    })
})
