import { clearInput, typeInput } from './common.js'

export const ITEM_NEW = 'file-menu-new'
export const ITEM_OPEN = 'file-menu-open'
export const ITEM_SAVE = 'file-menu-save'
export const ITEM_SAVEAS = 'file-menu-saveas'
export const ITEM_RENAME = 'file-menu-rename'
export const ITEM_TRANSLATE = 'file-menu-translate'
export const ITEM_SHARING = 'file-menu-sharing'
export const ITEM_GETLINK = 'file-menu-getlink'
export const ITEM_DELETE = 'file-menu-delete'

export const saveVisualization = (name) => {
    cy.getBySel('menubar').contains('File').click()

    cy.getBySel(ITEM_SAVE).click()

    if (name) {
        typeInput('file-menu-saveas-modal-name-content', name)
    }

    cy.getBySel('file-menu-saveas-modal-save').click()
}

export const saveVisualizationAs = (name) => {
    cy.getBySel('menubar').contains('File').click()

    cy.getBySel(ITEM_SAVEAS).click()

    if (name) {
        clearInput('file-menu-saveas-modal-name-content')
        typeInput('file-menu-saveas-modal-name-content', name)
    }

    cy.getBySel('file-menu-saveas-modal-save').click()
}

export const deleteVisualization = () => {
    cy.getBySel('menubar').contains('File').click()

    cy.getBySel(ITEM_DELETE).click()

    cy.getBySel('file-menu-delete-modal-delete').click()

    cy.getBySel('titlebar').should('not.exist')
}
