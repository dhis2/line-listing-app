import { TEST_AOS } from '../data/index.js'
import { clearTextarea, typeTextarea } from '../helpers/common.js'
import { expectInterpretationFormToBeVisible } from '../helpers/interpretations.js'
import { clickMenubarInterpretationsButton } from '../helpers/menubar.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const TEST_AO_ID = TEST_AOS[0].id

const TEST_CANCEL_LABEL = 'Cancel'
const TEST_POST_INTERPRETATION_LABEL = 'Post interpretation'
const TEST_WRITE_INTERPRETATION_LABEL = 'Write an interpretation'
const TEST_INTERPRETATION_TEXT = 'Test interpretation'
const TEST_INTERPRETATION_TEXT_EDITED = `${TEST_INTERPRETATION_TEXT} (edited)`

describe('interpretations', () => {
    it('opens the interpretations panel when clicking the button in the toolbar', () => {
        cy.visit(`#/${TEST_AO_ID}`, EXTENDED_TIMEOUT)

        clickMenubarInterpretationsButton()

        cy.getBySel('details-panel').should('be.visible')
    })

    it('Interpretations section is visible', () => {
        cy.getBySel('details-panel').should('contain', 'Interpretations')
    })

    it('default form for adding interpretation is visible', () => {
        expectInterpretationFormToBeVisible()
    })

    it('the rich text editor shows when clicking the input', () => {
        // TODO click on the input not the div as a click on the avatar does not trigger the same
        cy.getBySel('interpretation-form').click()

        cy.getBySel('interpretation-form').should(
            'contain',
            TEST_POST_INTERPRETATION_LABEL
        )
        cy.getBySel('interpretation-form').should('contain', TEST_CANCEL_LABEL)
    })

    it('the rich text editor is removed when clicking Cancel', () => {
        cy.getBySel('interpretation-form').contains(TEST_CANCEL_LABEL).click()

        cy.getBySel('interpretation-form').should(
            'not.contain',
            TEST_POST_INTERPRETATION_LABEL
        )
        cy.getBySel('interpretation-form').should(
            'not.contain',
            TEST_CANCEL_LABEL
        )
    })

    it("it's possible to write a new interpretation text", () => {
        cy.getBySel('interpretation-form')
            .get(`input[placeholder="${TEST_WRITE_INTERPRETATION_LABEL}"]`)
            .click()

        typeTextarea('interpretation-form', TEST_INTERPRETATION_TEXT)
    })

    it('the new interpretation can be saved and shows up in the list', () => {
        cy.getBySel('interpretation-form')
            .contains(TEST_POST_INTERPRETATION_LABEL)
            .click()

        expectInterpretationFormToBeVisible()

        cy.getBySel('interpretations-list').should(
            'contain',
            TEST_INTERPRETATION_TEXT
        )
        cy.getBySel('interpretations-list').should(
            'contain',
            'See interpretation'
        )
    })

    it('the new interpretation can be edited', () => {
        cy.getBySel('interpretation-edit-button').first().click()

        cy.getBySel('interpretations-list').should('contain', 'Update')
        cy.getBySel('interpretations-list').should('contain', TEST_CANCEL_LABEL)

        clearTextarea('interpretations-list')
        typeTextarea('interpretations-list', TEST_INTERPRETATION_TEXT_EDITED)

        cy.getBySel('interpretations-list').contains('Update').click()

        expectInterpretationFormToBeVisible()

        cy.getBySel('interpretations-list').should(
            'contain',
            TEST_INTERPRETATION_TEXT_EDITED
        )
    })

    it('the new interpretation can be deleted', () => {
        cy.getBySel('interpretation-delete-button').first().click()

        expectInterpretationFormToBeVisible()

        cy.getBySel('details-panel').should(
            'not.contain',
            TEST_INTERPRETATION_TEXT_EDITED
        )
    })
})
