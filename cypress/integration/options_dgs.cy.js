import { EXTENDED_TIMEOUT } from '../support/util.js'

// const analyticsEndpointRegex = /analytics\/events\/*/
describe('options dgs', () => {
    // beforeEach(() => {
    //     cy.intercept(analyticsEndpointRegex, (req) => {
    //         delete req.headers['if-none-match']
    //         req.continue()
    //     })
    // })

    it('sets digit group separator', () => {
        // cy.intercept(analyticsEndpointRegex, (req) => {
        cy.intercept(/analytics\/events\/*/, (req) => {
            delete req.headers['if-none-match']
            req.reply((res) => {
                //change the row values to be in the thousands
                res.body.rows.forEach((row) => {
                    const thousandsVal = parseInt(row[3], 10) * 1000
                    row[3] = thousandsVal.toString()
                    return row
                })

                res.send({ body: res.body })
            })
        })
        cy.visit('#/R4wAb2yMLik', EXTENDED_TIMEOUT)

        cy.getWithDataTest('{line-list-table}')
            .find('tbody > tr')
            .eq(0)
            .find('td')
            .eq(3)
            .should('contain', '12 000')

        // // set dgs to comma
        cy.getWithDataTest('{app-menubar}').contains('Options').click()
        cy.getWithDataTest('{dgs-select-content}')
            .findWithDataTest('{dhis2-uicore-select-input}')
            .click()
        cy.contains('Comma').click()
        cy.getWithDataTest('{options-modal-actions}').contains('Update').click()

        cy.getWithDataTest('{line-list-table}')
            .find('tbody > tr')
            .eq(0)
            .find('td')
            .eq(3)
            .should('contain', '12,000')
    })
})
