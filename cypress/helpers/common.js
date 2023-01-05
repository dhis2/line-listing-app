import { EXTENDED_TIMEOUT } from '../support/util.js'
import { expectRouteToEqual } from './route.js'

export const typeInput = (target, text) =>
    cy.getBySelLike(target).find('input').type(text)

export const clearInput = (target) => cy.getBySel(target).find('input').clear()

export const typeTextarea = (target, text) =>
    cy.getBySel(target).find('textarea').type(text)

export const clearTextarea = (target) =>
    cy.getBySel(target).find('textarea').clear()

export const goToAO = (id) => {
    cy.visit(`#/${id}`, EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
    expectRouteToEqual(id)
    cy.getBySel('visualization-title', EXTENDED_TIMEOUT).should('be.visible')
}
