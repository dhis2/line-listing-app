const selectFixedPeriod = ({ label, period }) => {
    cy.getWithDataTest('{main-sidebar}').contains(label).click()
    cy.contains('Choose from presets').click()
    cy.contains('Fixed periods').click()
    if (period.type) {
        cy.getWithDataTest(
            '{period-dimension-fixed-period-filter-period-type-content}'
        ).click()
        cy.contains(period.type).click()
    }
    cy.getWithDataTest('{period-dimension-fixed-period-filter-year-content}')
        .clear()
        .type(period.year)
    cy.contains(period.name).dblclick()
    cy.contains('Add to Columns').click()
}

const selectRelativePeriod = ({ label, period }) => {
    cy.getWithDataTest('{main-sidebar}').contains(label).click()
    cy.contains('Choose from presets').click()
    cy.contains('Relative periods').click()

    if (period.type) {
        cy.getWithDataTest(
            '{period-dimension-relative-period-filter-content}'
        ).click()
        cy.getWithDataTest('{dhis2-uicore-select-menu-menuwrapper}')
            .containsExact(period.type)
            .click()
    }
    cy.contains(period.name).dblclick()
    cy.contains('Add to Columns').click()
}

/*const selectStartEndDatePeriod = ({label, period}) => {
    cy.getWithDataTest('{main-sidebar}').contains(label).click()
    // TODO: implement when a start/end date test is added
    // cy.contains('Define start - end dates').click()
    cy.contains('Add to Columns').click()
}*/

const getPreviousYearStr = () => (new Date().getFullYear() - 1).toString()

const getCurrentYearStr = () => new Date().getFullYear().toString()

export {
    selectFixedPeriod,
    selectRelativePeriod,
    getPreviousYearStr,
    getCurrentYearStr,
}
