import { EXTENDED_TIMEOUT } from '../support/util.js'

const orgUnitModalEl = 'ou-modal'
const levelSelectEl = 'org-unit-level-select'
const levelSelectOptionEl = 'org-unit-level-select-option'
const groupSelectEl = 'org-unit-group-select'
const groupSelectOptionEl = 'org-unit-group-select-option'
const orgUnitTreeEl = 'org-unit-tree'
const orgUnitTreeNodeEl = 'org-unit-tree-node'
const orgUnitTreeNodeLabelEl = 'org-unit-tree-node-label'
const orgUnitTreeNodeSelectEl = '[type="checkbox"]'
const orgUnitTreeNodeToggleEl = 'org-unit-tree-node-toggle'

export const clickOrgUnitDimensionModalUpdateButton = () =>
    cy.getBySelLike(`${orgUnitModalEl}-action-confirm`).click()

export const openOuDimension = () => cy.getBySelLike('layout-chip-ou').click()

export const expectOrgUnitDimensionModalToBeVisible = () =>
    cy.getBySelLike(orgUnitModalEl).should('be.visible')

export const expectOrgUnitDimensionToNotBeLoading = () =>
    cy
        .getBySel(orgUnitTreeEl)
        .find('[role="progressbar"]', EXTENDED_TIMEOUT)
        .should('not.exist')

export const expectOrgUnitItemToBeSelected = (itemName) =>
    cy
        .getBySel(orgUnitTreeNodeLabelEl)
        .contains(itemName)
        .find(orgUnitTreeNodeSelectEl)
        .should('be.checked')

export const expectOrgUnitItemToNotBeSelected = (itemName) =>
    cy
        .getBySel(orgUnitTreeNodeLabelEl)
        .contains(itemName)
        .find(orgUnitTreeNodeSelectEl)
        .should('not.be.checked')

export const selectOrgUnitTreeItem = (itemName) => {
    expectOrgUnitItemToNotBeSelected(itemName)
    cy.getBySel(orgUnitTreeNodeLabelEl)
        .contains(itemName)
        .find(orgUnitTreeNodeSelectEl)
        .click()
    expectOrgUnitItemToBeSelected(itemName)
}

export const deselectOrgUnitTreeItem = (itemName) => {
    expectOrgUnitItemToBeSelected(itemName)
    cy.getBySel(orgUnitTreeNodeLabelEl)
        .contains(itemName)
        .find(orgUnitTreeNodeSelectEl)
        .click()
    expectOrgUnitItemToNotBeSelected(itemName)
}

export const openOrgUnitTreeItem = (itemName) =>
    cy
        .getBySel(orgUnitTreeNodeLabelEl)
        .contains(itemName)
        .closest(`[data-test=${orgUnitTreeNodeEl}]`)
        .children(`[data-test=${orgUnitTreeNodeToggleEl}]`)
        .click()

export const toggleOrgUnitLevel = (name) => {
    cy.getBySel(levelSelectEl).click()
    cy.getBySelLike(levelSelectOptionEl)
        .contains(name)
        .click()
        .closest('[data-test=dhis2-uicore-layer]')
        .click('center')
}

export const toggleOrgUnitGroup = (name) => {
    cy.getBySel(groupSelectEl).click()
    cy.getBySelLike(groupSelectOptionEl)
        .contains(name)
        .click()
        .closest('[data-test=dhis2-uicore-layer]')
        .click('center')
}

export const selectUserOrgUnit = (name) => {
    cy.getBySelLike(orgUnitModalEl)
        .contains(name)
        .find('[type="checkbox"]')
        .should('not.be.checked')
    cy.getBySelLike(orgUnitModalEl).contains(name).click()
    cy.getBySelLike(orgUnitModalEl)
        .contains(name)
        .find('[type="checkbox"]')
        .should('be.checked')
}

export const deselectUserOrgUnit = (name) => {
    cy.getBySelLike(orgUnitModalEl)
        .contains(name)
        .find('[type="checkbox"]')
        .should('be.checked')
    cy.getBySelLike(orgUnitModalEl).contains(name).click()
    cy.getBySelLike(orgUnitModalEl)
        .contains(name)
        .find('[type="checkbox"]')
        .should('not.be.checked')
}

export const expectOrgUnitTreeToBeDisabled = () => {
    cy.getBySel(orgUnitTreeEl).should('have.css', 'pointer-events', 'none')
    cy.getBySel(levelSelectEl).should('have.css', 'pointer-events', 'none')
    cy.getBySel(groupSelectEl).should('have.css', 'pointer-events', 'none')
}

export const expectOrgUnitTreeToBeEnabled = () => {
    cy.getBySel(orgUnitTreeEl).should('not.have.css', 'pointer-events', 'none')
    cy.getBySel(levelSelectEl).should('not.have.css', 'pointer-events', 'none')
    cy.getBySel(groupSelectEl).should('not.have.css', 'pointer-events', 'none')
}
