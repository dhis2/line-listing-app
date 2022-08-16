export const clickMenubarUpdateButton = () =>
    cy.getBySel('menubar').contains('Update').click()

export const clickMenubarOptionsButton = () =>
    cy.getBySel('menubar').contains('Options').click()
