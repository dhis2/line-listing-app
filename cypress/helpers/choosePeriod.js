export const FIXED = 'fixed'
export const RELATIVE = 'relative'
export const START_END = 'startEnd'

const choosePeriod = ({ periodLabel, category, period }) => {
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
            // cy.getWithDataTest(
            //     '{period-dimension-fixed-period-filter-period-type-content}'
            // ).click()
            // cy.contains(period.type).click()
            // cy.getWithDataTest(
            //     '{period-dimension-fixed-period-filter-year-content}'
            // )
            //     .clear()
            //     .type(period.year)
            // cy.contains(period.name).dblclick()
            break
        case START_END:
            cy.contains('Define start - end dates').click()
            break
    }

    cy.contains('Add to Columns').click()
}

export { choosePeriod }
