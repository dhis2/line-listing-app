export const addConditions = (dimensionName, conditions) => {
    cy.getBySelLike('layout-chip').contains(dimensionName).click()
    conditions.forEach(({ conditionName, value, useCaseSensitive }, index) => {
        cy.getBySel('button-add-condition').click()
        cy.contains('Choose a condition type').click()
        cy.contains(conditionName).click()
        if (value) {
            cy.getBySel('alphanumeric-condition')
                .eq(index)
                .find('input[type="text"]')
                .type(value)
        }
        if (useCaseSensitive) {
            cy.getBySel('alphanumeric-condition')
                .eq(index)
                .findBySel('condition-case-sensitive-checkbox')
                .click()
                .find('[type="checkbox"]')
                .should('be.checked')
        }
    })
    cy.getBySel('conditions-modal').contains('Update').click()
}
