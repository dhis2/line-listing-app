import { typeInput } from '../helpers/common.js'
import { selectEventProgram } from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
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

const assertItems = (enabledItemsMap = {}) => {
    const itemsMap = Object.assign({}, defaultItemsMap, enabledItemsMap)

    cy.getBySel('menubar').contains('File').click()

    Object.entries(itemsMap).forEach(([itemName, enabled]) => {
        enabled
            ? cy.getBySel(itemName).should('not.have.class', 'disabled')
            : cy.getBySel(itemName).should('have.class', 'disabled')
    })
}

describe('file menu', () => {
    it('reflects empty state', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        assertItems()
    })

    it('reflects unsaved state', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventProgram({
            programName: 'Adverse events following immunization',
        })

        clickMenubarUpdateButton()

        assertItems({
            [ITEM_SAVE]: true,
        })
    })

    it('reflects saved state', () => {
        cy.visit('/#/ZTrsv19jw9U', EXTENDED_TIMEOUT)

        cy.getBySel('visualization-title').contains('COVAC enrollment')

        assertItems({
            [ITEM_SAVEAS]: true,
            [ITEM_RENAME]: true,
            [ITEM_TRANSLATE]: true,
            [ITEM_SHARING]: true,
            [ITEM_GETLINK]: true,
            [ITEM_DELETE]: true,
        })
    })

    it('reflects dirty state (legacy: do not allow saving)', () => {
        cy.visit('/#/ZTrsv19jw9U', EXTENDED_TIMEOUT)

        cy.getBySel('visualization-title').contains('COVAC enrollment')

        clickMenubarUpdateButton()

        cy.getBySel('visualization-title').contains('Edited')

        assertItems({
            [ITEM_SAVEAS]: true,
            [ITEM_RENAME]: true,
            [ITEM_TRANSLATE]: true,
            [ITEM_SHARING]: true,
            [ITEM_GETLINK]: true,
            [ITEM_DELETE]: true,
        })
    })

    it('reflects dirty state (new: created in this app)', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventProgram({
            programName: 'Adverse events following immunization',
        })

        clickMenubarUpdateButton()

        cy.getBySel('menubar').contains('File').click()

        cy.getBySel(ITEM_SAVE).click()

        const name = 'Cypress test dirty state'

        typeInput('file-menu-saveas-modal-name-content', name)

        cy.getBySel('file-menu-saveas-modal-save').click()

        cy.getBySel('visualization-title').contains(name)

        clickMenubarUpdateButton()

        cy.getBySel('visualization-title').contains('Edited')

        assertItems({
            [ITEM_NEW]: true,
            [ITEM_OPEN]: true,
            [ITEM_SAVE]: true,
            [ITEM_SAVEAS]: true,
            [ITEM_RENAME]: true,
            [ITEM_TRANSLATE]: true,
            [ITEM_SHARING]: true,
            [ITEM_GETLINK]: true,
            [ITEM_DELETE]: true,
        })

        cy.getBySel(ITEM_DELETE).click()

        cy.getBySel('file-menu-delete-modal-delete').click()

        cy.getBySel('visualization-title').should('not.exist')

        assertItems()
    })
})
