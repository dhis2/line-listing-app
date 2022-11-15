import { TEST_REL_PE_LAST_YEAR } from '../data/index.js'
import { typeInput } from '../helpers/common.js'
import { selectEventProgram } from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod, unselectAllPeriods } from '../helpers/period.js'
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

    cy.getBySel('menubar').contains('File').click()

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

const closeFileMenu = () => cy.get('body').click(0, 0)

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
        cy.visit('/', EXTENDED_TIMEOUT)

        assertDownloadIsDisabled()
        assertFileMenuItems()
    })

    it('reflects "unsaved, no program" state', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        clickMenubarUpdateButton()

        assertDownloadIsDisabled()

        assertFileMenuItems()
    })

    it('reflects "unsaved, valid: save" state', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventProgram({
            programName: 'Adverse events following immunization',
        })

        clickMenubarUpdateButton()

        assertDownloadIsDisabled()

        assertFileMenuItems({
            [ITEM_SAVE]: true,
        })
    })

    it('reflects "unsaved, valid: data" state', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventProgram({
            programName: 'Adverse events following immunization',
            stageName: 'AEFI',
        })

        selectRelativePeriod({
            label: 'Report compilation date',
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        assertDownloadIsEnabled()

        assertFileMenuItems({
            [ITEM_SAVE]: true,
        })
    })

    it('reflects "saved, valid: save" state', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventProgram({
            programName: 'Adverse events following immunization',
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
        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventProgram({
            programName: 'Adverse events following immunization',
            stageName: 'AEFI',
        })

        selectRelativePeriod({
            label: 'Report compilation date',
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
        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventProgram({
            programName: 'Adverse events following immunization',
            stageName: 'AEFI',
        })

        selectRelativePeriod({
            label: 'Report compilation date',
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
        cy.visit('/#/ZTrsv19jw9U', EXTENDED_TIMEOUT)

        cy.getBySel('visualization-title').contains('COVAC enrollment')

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
            label: 'Date of registration',
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
