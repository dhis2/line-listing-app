import { TEST_REL_PE_LAST_YEAR } from '../data/index.js'
import { goToAO, typeInput } from '../helpers/common.js'
import { selectEventWithProgram } from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod, unselectAllPeriods } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import { expectTableToBeVisible } from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const ITEM_NEW = 'file-menu-new'
const ITEM_OPEN = 'file-menu-open'
const ITEM_SAVE = 'file-menu-save'
const ITEM_SAVEAS = 'file-menu-saveas'
const ITEM_RENAME = 'file-menu-rename'
const ITEM_TRANSLATE = 'file-menu-translate'
const ITEM_SHARING = 'file-menu-sharing'
const ITEM_GETLINK = 'file-menu-getlink'
const ITEM_DELETE = 'file-menu-delete'

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

    cy.getBySel('menubar', EXTENDED_TIMEOUT).contains('File').click()

    Object.entries(itemsMap).forEach(([itemName, enabled]) => {
        enabled
            ? cy.getBySel(itemName).should('not.have.class', 'disabled')
            : cy.getBySel(itemName).should('have.class', 'disabled')
    })
}

const assertDownloadIsEnabled = () =>
    cy
        .getBySel('menubar', EXTENDED_TIMEOUT)
        .contains('Download')
        .should('not.have.attr', 'disabled')

const assertDownloadIsDisabled = () =>
    cy
        .getBySel('menubar', EXTENDED_TIMEOUT)
        .contains('Download')
        .should('have.attr', 'disabled')

const closeFileMenu = () => {
    cy.getBySel('file-menu-toggle-layer').click()
    cy.getBySel('file-menu-container').should('not.exist')
}

const saveVisualization = (name) => {
    cy.getBySel('menubar').contains('File').click()

    cy.getBySel(ITEM_SAVE).click()

    typeInput('file-menu-saveas-modal-name-content', name)

    cy.getBySel('file-menu-saveas-modal-save').click()

    cy.getBySel('visualization-title').contains(name)
}

const deleteVisualization = () => {
    cy.getBySel(ITEM_DELETE).click()

    cy.getBySel('file-menu-delete-modal-delete').click()

    cy.getBySel('visualization-title').should('not.exist')

    assertFileMenuItems()
}

describe('file menu', () => {
    it('reflects "empty" state', () => {
        goToStartPage()

        assertDownloadIsDisabled()

        assertFileMenuItems()
    })

    it('reflects "unsaved, no program" state', () => {
        goToStartPage()

        clickMenubarUpdateButton()

        assertDownloadIsDisabled()

        assertFileMenuItems()
    })

    it('reflects "unsaved, valid: save" state', () => {
        goToStartPage()

        selectEventWithProgram({
            programName: 'Child Programme',
        })

        clickMenubarUpdateButton()

        assertDownloadIsDisabled()

        assertFileMenuItems({
            [ITEM_SAVE]: true,
        })
    })

    it('reflects "unsaved, valid: data" state', () => {
        goToStartPage()

        selectEventWithProgram({
            programName: 'Child Programme',
            stageName: 'Birth',
        })

        selectRelativePeriod({
            label: 'Report date',
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        assertDownloadIsEnabled()

        assertFileMenuItems({
            [ITEM_SAVE]: true,
        })
    })

    it('reflects "saved, valid: save" state', () => {
        goToStartPage()

        selectEventWithProgram({
            programName: 'Child Programme',
        })

        clickMenubarUpdateButton()

        saveVisualization('Cypress test "saved, valid: save" state')

        assertDownloadIsDisabled()

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
        goToStartPage()

        selectEventWithProgram({
            programName: 'Child Programme',
            stageName: 'Birth',
        })

        selectRelativePeriod({
            label: 'Report date',
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        saveVisualization('Cypress test "saved, valid: data" state')

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
    })

    it('reflects "dirty" state', () => {
        goToStartPage()

        selectEventWithProgram({
            programName: 'Child Programme',
            stageName: 'Birth',
        })

        selectRelativePeriod({
            label: 'Report date',
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        saveVisualization('Cypress test "dirty" state')

        // "dirty, valid: data" state
        clickMenubarUpdateButton()

        cy.getBySel('visualization-title').contains('Edited')

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

        closeFileMenu()

        // "dirty, valid: save" state
        cy.getBySel('stage-clear-button').click()

        clickMenubarUpdateButton()

        assertDownloadIsDisabled()

        assertFileMenuItems({
            [ITEM_SAVE]: true,
            [ITEM_SAVEAS]: true,
            [ITEM_RENAME]: true,
            [ITEM_TRANSLATE]: true,
            [ITEM_SHARING]: true,
            [ITEM_GETLINK]: true,
            [ITEM_DELETE]: true,
        })

        closeFileMenu()

        // "dirty, no program" state
        cy.getBySel('program-clear-button').click()

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
    })

    it('reflects "saved" and "dirty" state (legacy: do not allow saving)', () => {
        goToAO('TIuOzZ0ID0V')

        cy.getBySel('visualization-title').contains(
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

        closeFileMenu()

        // "dirty, valid: data" state
        clickMenubarUpdateButton()

        cy.getBySel('visualization-title').contains('Edited')

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

        closeFileMenu()

        // "dirty, valid: save" state
        unselectAllPeriods({
            label: 'Report date',
        })

        clickMenubarUpdateButton()

        assertDownloadIsDisabled()

        assertFileMenuItems({
            [ITEM_SAVEAS]: true,
            [ITEM_RENAME]: true,
            [ITEM_TRANSLATE]: true,
            [ITEM_SHARING]: true,
            [ITEM_GETLINK]: true,
            [ITEM_DELETE]: true,
        })

        closeFileMenu()

        // "dirty, no program" state
        cy.getBySel('main-sidebar').contains('Program dimensions').click()

        cy.getBySel('program-clear-button').click()

        clickMenubarUpdateButton()

        assertDownloadIsDisabled()

        assertFileMenuItems({
            [ITEM_RENAME]: true,
            [ITEM_TRANSLATE]: true,
            [ITEM_SHARING]: true,
            [ITEM_GETLINK]: true,
            [ITEM_DELETE]: true,
        })

        closeFileMenu()
    })
})
