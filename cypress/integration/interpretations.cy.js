import { TEST_AO } from '../data/index.js'
import { clearTextarea, typeTextarea } from '../helpers/common.js'
import {
    expectInterpretationsButtonToBeEnabled,
    expectInterpretationFormToBeVisible,
    expectInterpretationThreadToBeVisible,
} from '../helpers/interpretations.js'
import { clickMenubarInterpretationsButton } from '../helpers/menubar.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const CANCEL_LABEL = 'Cancel'
const POST_INTERPRETATION_LABEL = 'Post interpretation'
const WRITE_INTERPRETATION_LABEL = 'Write an interpretation'
const WRITE_REPLY_LABEL = 'Write a reply'
const TEST_INTERPRETATION_TEXT =
    'Interpretation at ' + new Date().toUTCString().slice(-12, -4)
const TEST_INTERPRETATION_TEXT_EDITED = `${TEST_INTERPRETATION_TEXT} (edited)`
const TEST_INTERPRETATION_COMMENT_TEXT =
    'Reply at ' + new Date().toUTCString().slice(-12, -4)

describe('interpretations', () => {
    it('the interpretations panel can be toggled when clicking the button in the toolbar', () => {
        cy.visit(`#/${TEST_AO.id}`, EXTENDED_TIMEOUT)

        expectInterpretationsButtonToBeEnabled()

        clickMenubarInterpretationsButton()

        cy.getBySel('details-panel').should('be.visible')

        clickMenubarInterpretationsButton()

        cy.getBySel('details-panel').should('not.exist')

        clickMenubarInterpretationsButton()

        // Interpretations section is visible
        cy.getBySel('details-panel').contains('Interpretations')

        // default form for adding interpretation is visible
        expectInterpretationFormToBeVisible()
    })

    it('a new interpretation can be added', () => {
        // the rich text editor shows when clicking the input
        cy.getBySel('interpretation-form', EXTENDED_TIMEOUT)
            .find(`input[placeholder="${WRITE_INTERPRETATION_LABEL}"]`)
            .click()

        cy.getBySel('interpretation-form').contains(POST_INTERPRETATION_LABEL)
        cy.getBySel('interpretation-form').contains(CANCEL_LABEL)

        // the rich text editor is removed when clicking Cancel
        cy.getBySel('interpretation-form').contains(CANCEL_LABEL).click()

        cy.getBySel('interpretation-form').should(
            'not.contain',
            POST_INTERPRETATION_LABEL
        )
        cy.getBySel('interpretation-form').should('not.contain', CANCEL_LABEL)

        cy.intercept(
            'POST',
            /\/interpretations\/eventVisualization\/[A-Za-z0-9]{11}/
        ).as('postInterpretation')

        // it's possible to write a new interpretation text
        cy.getBySel('interpretation-form')
            .find(`input[placeholder="${WRITE_INTERPRETATION_LABEL}"]`)
            .click()

        typeTextarea('interpretation-form', TEST_INTERPRETATION_TEXT)

        // the new interpretation can be saved and shows up in the list
        cy.getBySel('interpretation-form')
            .contains(POST_INTERPRETATION_LABEL)
            .click()
        cy.wait('@postInterpretation')
            .its('response.statusCode')
            .should('eq', 201)

        cy.getBySel('interpretations-list').contains(TEST_INTERPRETATION_TEXT)
        cy.getBySel('interpretations-list').contains('See interpretation')
    })

    it('the new interpretation can be edited', () => {
        cy.getBySel('interpretation-edit-button', EXTENDED_TIMEOUT).click()

        cy.getBySel('interpretations-list').contains('Update')
        cy.getBySel('interpretations-list').contains(CANCEL_LABEL)

        clearTextarea('interpretations-list')
        typeTextarea('interpretations-list', TEST_INTERPRETATION_TEXT_EDITED)

        cy.intercept('PUT', /\/interpretations\/[A-Za-z0-9]{11}/).as(
            'updateInterpretation'
        )
        cy.getBySel('interpretations-list').contains('Update').click()
        cy.wait('@updateInterpretation')
            .its('response.statusCode')
            .should('eq', 204)

        expectInterpretationFormToBeVisible()

        cy.getBySel('interpretations-list').contains(
            TEST_INTERPRETATION_TEXT_EDITED
        )
    })

    it('the new interpretation can be viewed in the modal and interacted with', () => {
        cy.getBySel('interpretations-list', EXTENDED_TIMEOUT)
            .contains('See interpretation')
            .click()
        cy.getBySel('interpretation-modal').contains('Viewing interpretation:')
        cy.getBySel('interpretation-modal').contains(
            TEST_INTERPRETATION_TEXT_EDITED
        )

        // it's possible to add a comment to the new interpretation
        expectInterpretationThreadToBeVisible()

        cy.getBySel('interpretation-modal')
            .find(`input[placeholder="${WRITE_REPLY_LABEL}"]`)
            .click()

        typeTextarea('interpretation-modal', TEST_INTERPRETATION_COMMENT_TEXT)

        // the comment can be saved and shows up in the interpretation thread
        cy.getBySel('interpretation-modal').contains('Post reply').click()

        cy.getBySel('interpretation-modal').contains(
            TEST_INTERPRETATION_COMMENT_TEXT
        )

        // the page size can be changed
        // (change page size for testing that the sorting does not apply to the main view)
        cy.getBySel('interpretation-modal').contains('Rows per page').click()
        cy.getBySel('dhis2-uicore-select-menu-menuwrapper')
            .contains('5')
            .click()
        cy.getBySel('interpretation-modal')
            .findBySel('dhis2-uiwidgets-pagination-pagesize-select')
            .contains('5')

        // the interpretation modal can be closed
        cy.contains('Hide interpretation').click()

        // the Rows per page change in the modal does not affect the main view
        cy.getBySel('dhis2-uiwidgets-pagination-pagesize-select').contains(
            '100'
        )
    })

    it('the new interpretation can be deleted', () => {
        cy.getBySel('interpretation-delete-button', EXTENDED_TIMEOUT).click()

        expectInterpretationFormToBeVisible()

        cy.getBySel('details-panel').should(
            'not.contain',
            TEST_INTERPRETATION_TEXT_EDITED
        )
    })
})
