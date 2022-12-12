import { EXTENDED_TIMEOUT } from '../support/util.js'
import { typeInput } from './common.js'

export const searchAndSelectInTransfer = (name) => {
    const searchRegex = new RegExp(encodeURI(name))
    cy.intercept('GET', searchRegex).as('fetchOptions')
    typeInput('option-set-left-header-filter-input-field', name)
    cy.wait('@fetchOptions').its('response.statusCode').should('eq', 200)

    cy.getBySel('option-set-left-header-filter-input-field')
        .find('input')
        .should('have.value', name)

    cy.getBySel('option-set-transfer-leftside')
        .get('[data-test="dhis2-uicore-circularloader"]', EXTENDED_TIMEOUT)
        .should('not.exist')

    cy.getBySel('option-set-transfer-sourceoptions').contains(name).dblclick()

    cy.getBySel('option-set-transfer-pickedoptions').contains(name)
}
