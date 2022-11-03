import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('simple', () => {
    before(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        cy.getBySel('main-sidebar', EXTENDED_TIMEOUT)

        clickMenubarUpdateButton()
    })

    it('something', () => {
        clickMenubarUpdateButton()
    })
    after(() => {
        cy.getBySel('menubar').contains('File').click()
    })
})
