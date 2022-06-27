const getAxisEl = (axisId) => `${axisId}-axis`
const getDimensionChipEl = (dimensionId) => `layout-chip-${dimensionId}`

export const expectAxisToHaveDimension = (axisId, dimensionId) => {
    if (axisId && dimensionId) {
        cy.getBySel(getAxisEl(axisId))
            .findBySel(getDimensionChipEl(dimensionId))
            .should('have.length', 1)
            .and('be.visible')
    } else {
        throw new Error('axisId and dimensionId not provided')
    }
}

export const expectAxisToNotHaveDimension = (axisId, dimensionId) => {
    if (axisId && dimensionId) {
        cy.getBySel(getAxisEl(axisId))
            .findBySel(getDimensionChipEl(dimensionId))
            .should('not.exist')
    } else {
        throw new Error('axisId and dimensionId not provided')
    }
}
