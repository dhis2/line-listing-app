// "Last updated on" is in the sidebar while all the others are in program dimensiions
const openPeriod = (label) => {
    if (label === 'Last updated on') {
        cy.getBySel('main-dimensions-sidebar').contains(label).click()
    } else {
        cy.getBySel('program-dimensions').contains(label).click()
    }
}

const selectFixedPeriod = ({ label, period }) => {
    openPeriod(label)
    cy.contains('Choose from presets').click()
    cy.contains('Fixed periods').click()
    if (period.type) {
        cy.getBySel(
            'period-dimension-fixed-period-filter-period-type-content'
        ).click()
        cy.getBySelLike(
            'period-dimension-fixed-period-filter-period-type-option'
        )
            .contains(period.type)
            .click()
    }
    cy.getBySel('period-dimension-fixed-period-filter-year-content')
        .clear()
        .type(period.year)
    cy.getBySel('period-dimension-transfer-option-content')
        .contains(period.name)
        .dblclick()
    cy.getBySel('period-dimension-modal-action-confirm').click()
}

const selectRelativePeriod = ({ label, period }) => {
    openPeriod(label)
    cy.contains('Choose from presets').click()
    cy.contains('Relative periods').click()

    if (period.type) {
        cy.getBySel('period-dimension-relative-period-filter-content').click()
        cy.getBySel('dhis2-uicore-select-menu-menuwrapper')
            .containsExact(period.type)
            .click()
    }
    cy.getBySelLike('period-dimension-transfer-sourceoptions')
        .contains(period.name)
        .dblclick()
    cy.getBySel('period-dimension-modal-action-confirm').click()
}

const unselectAllPeriods = ({ label }) => {
    openPeriod(label)
    cy.contains('Choose from presets').click()

    cy.getBySel('period-dimension-transfer-actions-removeall').click()
    cy.getBySel('period-dimension-modal-action-confirm').click()
}

const getPreviousYearStr = () => (new Date().getFullYear() - 1).toString()

const getCurrentYearStr = () => new Date().getFullYear().toString()

const getOffsetYearStr = (offset) =>
    (new Date().getFullYear() - offset).toString()

export {
    selectFixedPeriod,
    selectRelativePeriod,
    unselectAllPeriods,
    getPreviousYearStr,
    getCurrentYearStr,
    getOffsetYearStr,
}
