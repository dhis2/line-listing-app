const selectFixedPeriod = ({ label, period }) => {
    cy.getBySel('main-sidebar').contains(label).click()
    cy.contains('Choose from presets').click()
    cy.contains('Fixed periods').click()
    if (period.type) {
        cy.getBySel(
            'period-dimension-fixed-period-filter-period-type-content'
        ).click()
        cy.contains(period.type).click()
    }
    cy.getBySel('period-dimension-fixed-period-filter-year-content')
        .clear()
        .type(period.year)
    cy.contains(period.name).dblclick()
    assertSelectedPeriodInModal(period.name)
    cy.getBySel('period-dimension-modal-action-confirm').click()
}

const selectRelativePeriod = ({ label, period }) => {
    cy.getBySel('main-sidebar').contains(label).click()
    cy.contains('Choose from presets').click()
    cy.contains('Relative periods').click()

    console.log('jj period', period)

    if (period.type) {
        cy.getBySel('period-dimension-relative-period-filter-content').click()
        cy.getBySel('dhis2-uicore-select-menu-menuwrapper')
            .containsExact(period.type)
            .click()
    }
    cy.contains(period.name).dblclick()
    assertSelectedPeriodInModal(period.name)
    cy.getBySel('period-dimension-modal-action-confirm').click()
}

const assertSelectedPeriodInModal = (periodName) => {
    cy.getBySelLike('period-dimension-transfer-pickedoptions').should(
        'contain',
        periodName
    )
}

const clickPeriodModalUpdateButton = () => {
    cy.getBySel('period-dimension-modal-action-confirm')
        .contains('Update')
        .click()
}

const unselectAllPeriods = ({ label }) => {
    cy.getBySel('main-sidebar').contains(label).click()
    cy.contains('Choose from presets').click()

    cy.getBySel('period-dimension-transfer-actions-removeall').click()
    cy.getBySel('period-dimension-modal-action-confirm').click()
}

const getPreviousYearStr = () => (new Date().getFullYear() - 1).toString()

const getCurrentYearStr = () => new Date().getFullYear().toString()

export {
    selectFixedPeriod,
    selectRelativePeriod,
    unselectAllPeriods,
    getPreviousYearStr,
    getCurrentYearStr,
    assertSelectedPeriodInModal,
    clickPeriodModalUpdateButton,
}
