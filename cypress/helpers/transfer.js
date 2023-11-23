import { EXTENDED_TIMEOUT } from '../support/util.js'
import { typeInput } from './common.js'

export const searchAndSelectInOptionsTransfer = (name) => {
    cy.getBySel('option-set-transfer-option', EXTENDED_TIMEOUT)
        .its('length')
        .should('be.gt', 0)

    typeInput('option-set-left-header-filter-input-field', name)

    cy.getBySel('option-set-transfer-option', EXTENDED_TIMEOUT).should(
        'have.length',
        1
    )

    cy.getBySel('option-set-transfer-leftside')
        .get('[data-test="dhis2-uicore-circularloader"]', EXTENDED_TIMEOUT)
        .should('not.exist')

    selectInOptionsTransfer(name)
}

export const selectInOptionsTransfer = (name) => {
    cy.getBySel('option-set-transfer-sourceoptions')
        .containsExact(name)
        .dblclick()

    cy.getBySel('option-set-transfer-pickedoptions').containsExact(name)
}
