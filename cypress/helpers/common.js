export const typeInput = (target, text) =>
    cy.getBySelLike(target).find('input').type(text)

export const clearInput = (target) => cy.getBySel(target).find('input').clear()

export const typeTextarea = (target, text) =>
    cy.getBySel(target).find('textarea').type(text)

export const clearTextarea = (target) =>
    cy.getBySel(target).find('textarea').clear()
