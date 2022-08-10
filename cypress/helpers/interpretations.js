import { EXTENDED_TIMEOUT } from '../support/util.js'

const getInterpretationForm = () =>
    cy.getBySel('interpretation-form', EXTENDED_TIMEOUT)

export const expectInterpretationFormToBeVisible = () =>
    getInterpretationForm().find('input').should('be.visible')
