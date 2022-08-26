export const clickMenubarUpdateButton = () =>
    cy.getBySel('menubar').contains('Update').click()

export const clickMenubarOptionsButton = () =>
    cy.getBySel('menubar').contains('Options').click()

export const clickMenubarInterpretationsButton = () =>
    cy.getBySel('menubar').contains('Interpretations').click()
