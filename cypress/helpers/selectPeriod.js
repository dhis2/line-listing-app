export const FIXED = 'fixed'
export const RELATIVE = 'relative'
export const START_END = 'startEnd'

const selectPeriod = ({ periodLabel, category, period }) => {
    cy.contains(periodLabel).click()
    switch (category) {
        case FIXED:
            cy.contains('Choose from presets').click()
            cy.contains('Fixed periods').click()
            cy.getWithDataTest(
                '{period-dimension-fixed-period-filter-period-type-content}'
            ).click()
            cy.contains(period.type).click()
            cy.getWithDataTest(
                '{period-dimension-fixed-period-filter-year-content}'
            )
                .clear()
                .type(period.year)
            cy.contains(period.name).dblclick()
            break
        case RELATIVE:
            cy.contains('Choose from presets').click()
            cy.contains('Relative periods').click()

            // TODO: not ideal to have conditionals like this, but if the default
            // period type is the same as what the test is selecting, and if
            // we try to select it again, then the dropdown does not get removed
            if (
                !cy
                    .getWithDataTest(
                        '{period-dimension-relative-period-filter-content}'
                    )
                    .contains(period.type)
            ) {
                cy.getWithDataTest(
                    '{period-dimension-relative-period-filter-content}'
                ).click()
                cy.getWithDataTest('{dhis2-uicore-select-menu-menuwrapper}')
                    .contains(period.type)
                    .click()
            }
            cy.contains(period.name).dblclick()
            break
        case START_END:
            // TODO: implement when a start/end date test is added
            // cy.contains('Define start - end dates').click()
            break
    }

    cy.contains('Add to Columns').click()
}

export { selectPeriod }
