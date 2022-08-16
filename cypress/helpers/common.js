export const typeInput = (target, text) =>
    cy.getBySel(target).find('input').type(text)

export const clearInput = (target) => cy.getBySel(target).find('input').clear()
