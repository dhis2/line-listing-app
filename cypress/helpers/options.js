const legendDisplayStrategyByDataItemEl = 'legend-display-strategy-BY_DATA_ITEM'
const legendDisplayStrategyFixedEl = 'legend-display-strategy-FIXED'
const legendDisplayStyleOptionTextEl = 'legend-display-style-option-TEXT'
const legendDisplayStyleOptionFillEl = 'legend-display-style-option-FILL'

export const clickOptionsTab = (name) =>
    cy.getBySel('options-modal-tab-bar-tabs').contains(name).click()

export const expectLegendDisplayStrategyToBeByDataItem = () =>
    cy
        .getBySel(legendDisplayStrategyByDataItemEl)
        .find('[type="radio"]')
        .should('be.checked')

export const expectLegendDisplayStrategyToBeFixed = () =>
    cy
        .getBySel(legendDisplayStrategyFixedEl)
        .find('[type="radio"]')
        .should('be.checked')

export const expectLegendDisplayStyleToBeText = () =>
    cy
        .getBySel(legendDisplayStyleOptionTextEl)
        .find('[type="radio"]')
        .should('be.checked')

export const expectLegendDisplayStyleToBeFill = () =>
    cy
        .getBySel(legendDisplayStyleOptionFillEl)
        .find('[type="radio"]')
        .should('be.checked')
