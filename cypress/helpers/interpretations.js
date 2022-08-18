import { EXTENDED_TIMEOUT } from '../support/util.js'

export const expectInterpretationsButtonToBeEnabled = () =>
    cy.getBySel('menubar').contains('Interpretations').should('be.enabled')

export const expectInterpretationFormToBeVisible = () =>
    cy
        .getBySel('interpretation-form', EXTENDED_TIMEOUT)
        .find('input[placeholder="Write an interpretation"]')
        .should('be.visible')

export const expectInterpretationThreadToBeVisible = () =>
    cy
        .getBySel('interpretation-modal', EXTENDED_TIMEOUT)
        .find('input[placeholder="Write a reply"]')
        .should('be.visible')
