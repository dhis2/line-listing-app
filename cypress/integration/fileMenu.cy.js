import { TEST_REL_PE_LAST_YEAR } from '../data/index.js'
import { goToAO } from '../helpers/common.js'
import {
    clickAddRemoveProgramDimension,
    openInputSidebar,
    openProgramDimensionsSidebar,
    selectEventWithProgram,
} from '../helpers/dimensions.js'
import {
    ITEM_NEW,
    ITEM_OPEN,
    ITEM_SAVE,
    ITEM_SAVEAS,
    ITEM_RENAME,
    ITEM_TRANSLATE,
    ITEM_SHARING,
    ITEM_GETLINK,
    ITEM_DELETE,
    saveVisualization,
    deleteVisualization,
} from '../helpers/fileMenu.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod, unselectAllPeriods } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    expectAOTitleToContain,
    expectTableToBeVisible,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const defaultItemsMap = {
    [ITEM_NEW]: true,
    [ITEM_OPEN]: true,
    [ITEM_SAVE]: false,
    [ITEM_SAVEAS]: false,
    [ITEM_RENAME]: false,
    [ITEM_TRANSLATE]: false,
    [ITEM_SHARING]: false,
    [ITEM_GETLINK]: false,
    [ITEM_DELETE]: false,
}

const assertFileMenuItems = (enabledItemsMap = {}) => {
    const itemsMap = Object.assign({}, defaultItemsMap, enabledItemsMap)

    cy.getBySel('dhis2-analytics-hovermenubar', EXTENDED_TIMEOUT)
        .contains('File')
        .click()

    Object.entries(itemsMap).forEach(([itemName, enabled]) => {
        enabled
            ? cy.getBySel(itemName).should('not.have.class', 'disabled')
            : cy.getBySel(itemName).should('have.class', 'disabled')
    })

    cy.get('body').click()
    cy.getBySel('file-menu-container').should('not.exist')
}

const assertDownloadIsEnabled = () =>
    cy
        .getBySel('dhis2-analytics-hovermenubar', EXTENDED_TIMEOUT)
        .contains('Download')
        .should('not.have.attr', 'disabled')

const assertDownloadIsDisabled = () =>
    cy
        .getBySel('dhis2-analytics-hovermenubar', EXTENDED_TIMEOUT)
        .contains('Download')
        .should('have.attr', 'disabled')

describe('file menu', () => {
    it('reflects "empty" state', () => {
        cy.setTestDescription(
            'Checks if the file menu correctly reflects an "empty" state.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'FileMenuState' },
            { key: 'state', value: 'Empty' },
        ])

        goToStartPage()

        assertDownloadIsDisabled()

        assertFileMenuItems()
    })

    it('reflects "unsaved, no program" state', () => {
        cy.setTestDescription(
            'Verifies the file menu state for an "unsaved, no program" condition.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'FileMenuState' },
            { key: 'state', value: 'UnsavedNoProgram' },
        ])

        goToStartPage()

        clickMenubarUpdateButton()

        // without program, with org unit

        assertDownloadIsDisabled()

        assertFileMenuItems()
    })

    it('reflects "unsaved, valid: save" state', () => {
        cy.setTestDescription(
            'Ensures the file menu reflects "unsaved, valid: save" state correctly.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'FileMenuState' },
            { key: 'state', value: 'UnsavedValidSave' },
        ])

        goToStartPage()

        selectEventWithProgram({
            programName: 'Child Programme',
        })

        openProgramDimensionsSidebar()

        clickAddRemoveProgramDimension('Organisation unit')

        // with program, without org unit

        clickMenubarUpdateButton()

        assertDownloadIsDisabled()

        assertFileMenuItems({
            [ITEM_SAVE]: true,
        })
    })

    it('reflects "unsaved, valid: data" state', () => {
        cy.setTestDescription(
            'Verifies file menu state for "unsaved, valid: data" conditions.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'FileMenuState' },
            { key: 'state', value: 'UnsavedValidData' },
        ])

        goToStartPage()

        selectEventWithProgram({
            programName: 'Child Programme',
        })

        openProgramDimensionsSidebar()

        // with program, with org unit

        clickMenubarUpdateButton()

        assertDownloadIsEnabled()

        assertFileMenuItems({
            [ITEM_SAVE]: true,
        })
    })

    it('reflects "unsaved, valid: data" state 2', () => {
        cy.setTestDescription(
            'Checks file menu state for "unsaved, valid: data" with specific conditions.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'FileMenuState' },
            { key: 'state', value: 'UnsavedValidData2' },
        ])

        goToStartPage()

        selectEventWithProgram({
            programName: 'Child Programme',
        })

        openProgramDimensionsSidebar()

        selectRelativePeriod({
            label: 'Report date',
            period: TEST_REL_PE_LAST_YEAR,
        })

        // with program, with org unit, with period

        clickMenubarUpdateButton()

        assertDownloadIsEnabled()

        assertFileMenuItems({
            [ITEM_SAVE]: true,
        })
    })

    it('reflects "saved, valid: save" state', () => {
        cy.setTestDescription(
            'Ensures file menu state is correctly updated for "saved, valid: save" conditions.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'FileMenuState' },
            { key: 'state', value: 'SavedValidSave' },
        ])

        goToStartPage()

        selectEventWithProgram({
            programName: 'Child Programme',
        })

        clickMenubarUpdateButton()

        const AO_NAME = `TEST ${new Date().toLocaleString()} - "saved, valid: save" state`

        saveVisualization(AO_NAME)

        expectAOTitleToContain(AO_NAME)

        // saved with program, with org unit

        assertDownloadIsEnabled()

        assertFileMenuItems({
            [ITEM_SAVEAS]: true,
            [ITEM_RENAME]: true,
            [ITEM_TRANSLATE]: true,
            [ITEM_SHARING]: true,
            [ITEM_GETLINK]: true,
            [ITEM_DELETE]: true,
        })
    })

    it('reflects "saved, valid: data" state', () => {
        cy.setTestDescription(
            'Verifies file menu state for "saved, valid: data" conditions.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'FileMenuState' },
            { key: 'state', value: 'SavedValidData' },
        ])

        goToStartPage()

        selectEventWithProgram({
            programName: 'Child Programme',
        })

        openProgramDimensionsSidebar()

        selectRelativePeriod({
            label: 'Report date',
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        const AO_NAME = `TEST ${new Date().toLocaleString()} - "saved, valid: data" state`

        saveVisualization(AO_NAME)

        expectAOTitleToContain(AO_NAME)

        // saved with program, with org unit, with period

        assertDownloadIsEnabled()

        assertFileMenuItems({
            [ITEM_SAVEAS]: true,
            [ITEM_RENAME]: true,
            [ITEM_TRANSLATE]: true,
            [ITEM_SHARING]: true,
            [ITEM_GETLINK]: true,
            [ITEM_DELETE]: true,
        })

        deleteVisualization()
        assertFileMenuItems()
    })

    it('reflects "dirty" state', () => {
        cy.setTestDescription(
            'Checks if file menu correctly reflects a "dirty" state after changes.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'FileMenuState' },
            { key: 'state', value: 'Dirty' },
        ])

        goToStartPage()

        selectEventWithProgram({
            programName: 'Child Programme',
        })

        openProgramDimensionsSidebar()

        selectRelativePeriod({
            label: 'Report date',
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        const AO_NAME = `TEST ${new Date().toLocaleString()} - "dirty" state`

        saveVisualization(AO_NAME)

        expectAOTitleToContain(AO_NAME)

        // "dirty, valid: data" state
        clickMenubarUpdateButton()

        cy.getBySel('titlebar').contains('Edited')
        assertDownloadIsEnabled()

        assertFileMenuItems({
            [ITEM_SAVE]: true,
            [ITEM_SAVEAS]: true,
            [ITEM_RENAME]: true,
            [ITEM_TRANSLATE]: true,
            [ITEM_SHARING]: true,
            [ITEM_GETLINK]: true,
            [ITEM_DELETE]: true,
        })

        // "dirty, no program" state
        openInputSidebar()
        cy.getBySel('input-enrollment').click()

        clickMenubarUpdateButton()

        assertDownloadIsDisabled()

        assertFileMenuItems({
            [ITEM_RENAME]: true,
            [ITEM_TRANSLATE]: true,
            [ITEM_SHARING]: true,
            [ITEM_GETLINK]: true,
            [ITEM_DELETE]: true,
        })

        deleteVisualization()
        assertFileMenuItems()
    })

    it('reflects "saved" and "dirty" state (legacy: do not allow saving)', () => {
        cy.setTestDescription(
            'Ensures file menu correctly reflects "saved" and "dirty" states, especially in legacy conditions.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'FileMenuState' },
            { key: 'state', value: 'SavedAndDirtyLegacy' },
        ])

        goToAO('TIuOzZ0ID0V')

        cy.getBySel('titlebar').contains(
            'Inpatient: Cases 5 to 15 years this year (case)'
        )

        // saved
        assertDownloadIsEnabled()

        assertFileMenuItems({
            [ITEM_SAVEAS]: true,
            [ITEM_RENAME]: true,
            [ITEM_TRANSLATE]: true,
            [ITEM_SHARING]: true,
            [ITEM_GETLINK]: true,
            [ITEM_DELETE]: true,
        })

        // "dirty, valid: data" state
        clickMenubarUpdateButton()

        cy.getBySel('titlebar').contains('Edited')

        assertDownloadIsEnabled()

        // if we don't do this file menu opens in the wrong place
        expectTableToBeVisible()

        assertFileMenuItems({
            [ITEM_SAVEAS]: true,
            [ITEM_RENAME]: true,
            [ITEM_TRANSLATE]: true,
            [ITEM_SHARING]: true,
            [ITEM_GETLINK]: true,
            [ITEM_DELETE]: true,
        })

        openProgramDimensionsSidebar()

        // "dirty, valid: save" state
        unselectAllPeriods({
            label: 'Report date',
        })

        clickMenubarUpdateButton()

        assertDownloadIsEnabled()

        assertFileMenuItems({
            [ITEM_SAVEAS]: true,
            [ITEM_RENAME]: true,
            [ITEM_TRANSLATE]: true,
            [ITEM_SHARING]: true,
            [ITEM_GETLINK]: true,
            [ITEM_DELETE]: true,
        })

        // "dirty, no program" state
        openInputSidebar()
        cy.getBySel('input-enrollment').click()

        clickMenubarUpdateButton()

        assertDownloadIsDisabled()

        assertFileMenuItems({
            [ITEM_RENAME]: true,
            [ITEM_TRANSLATE]: true,
            [ITEM_SHARING]: true,
            [ITEM_GETLINK]: true,
            [ITEM_DELETE]: true,
        })
    })
})
