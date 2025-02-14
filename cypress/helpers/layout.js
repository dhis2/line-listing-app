import { EXTENDED_TIMEOUT } from '../support/util.js'

const getAxisSelector = (axisId) => `${axisId}-axis`
const getDimensionChipSelector = (dimensionId) => `layout-chip-${dimensionId}`

export const expectAxisToHaveDimension = (axisId, dimensionId) => {
    if (axisId && dimensionId) {
        cy.getBySel(getAxisSelector(axisId))
            .findBySel(getDimensionChipSelector(dimensionId))
            .should('have.length', 1)
            .and('be.visible')
    } else {
        throw new Error('axisId and dimensionId not provided')
    }
}

export const expectAxisToNotHaveDimension = (axisId, dimensionId) => {
    if (axisId && dimensionId) {
        cy.getBySel(getAxisSelector(axisId))
            .findBySel(getDimensionChipSelector(dimensionId))
            .should('not.exist')
    } else {
        throw new Error('axisId and dimensionId not provided')
    }
}

export const assertTooltipContainsEntries = (primary, entries) => {
    cy.getBySelLike('layout-chip')
        .containsExact(primary, EXTENDED_TIMEOUT)
        .trigger('mouseover')

    entries.forEach((entry) => cy.getBySel('tooltip-content').contains(entry))

    // close the tooltip to avoid it covering other elements in subsequent tests
    cy.get('body').type('{esc}')
    cy.getBySel('tooltip-content').should('not.exist')
}

export const assertChipContainsText = (primary, items, secondary) => {
    if (items) {
        cy.getBySelLike('layout-chip')
            .containsExact(primary, EXTENDED_TIMEOUT)
            .parent()
            .parent()
            .findBySelLike('chip-items')
            .contains(items, EXTENDED_TIMEOUT)
    } else {
        cy.getBySelLike('layout-chip')
            .containsExact(primary, EXTENDED_TIMEOUT)
            .parent()
            .parent()
            .findBySelLike('chip-items')
            .should('not.exist')
    }
    if (secondary) {
        cy.getBySelLike('layout-chip').containsExact(
            secondary,
            EXTENDED_TIMEOUT
        )
    }
}
