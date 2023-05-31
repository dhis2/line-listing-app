import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_DIM_TEXT,
    TEST_FIX_PE_DEC_LAST_YEAR,
} from '../data/index.js'
import { clearTextarea, typeTextarea } from '../helpers/common.js'
import { selectEventWithProgramDimensions } from '../helpers/dimensions.js'
import { deleteVisualization, saveVisualization } from '../helpers/fileMenu.js'
import {
    expectInterpretationsButtonToBeEnabled,
    expectInterpretationFormToBeVisible,
    expectInterpretationThreadToBeVisible,
} from '../helpers/interpretations.js'
import {
    clickMenubarInterpretationsButton,
    clickMenubarUpdateButton,
    clickMenubarViewButton,
} from '../helpers/menubar.js'
import { selectFixedPeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const TEST_CANCEL_LABEL = 'Cancel'
const TEST_POST_INTERPRETATION_LABEL = 'Post interpretation'
const TEST_WRITE_INTERPRETATION_LABEL = 'Write an interpretation'
const TEST_WRITE_REPLY_LABEL = 'Write a reply'
const TEST_INTERPRETATION_TEXT = 'Test interpretation'
const TEST_INTERPRETATION_TEXT_EDITED = `${TEST_INTERPRETATION_TEXT} (edited)`
const TEST_INTERPRETATION_COMMENT_TEXT = 'Reply to test interpretation'

describe('interpretations', { testIsolation: false }, () => {
    // Use a flag to ensure the visualisation is not created multiple times
    let created = false
    // Use the `beforeEach` hook to ensure the visualisation is being created after the login takes place
    beforeEach(() => {
        if (!created) {
            goToStartPage()
            cy.getBySel('main-sidebar', EXTENDED_TIMEOUT)

            const trackerProgram = E2E_PROGRAM
            const dimensionName = TEST_DIM_TEXT
            const periodLabel = trackerProgram[DIMENSION_ID_EVENT_DATE]

            selectEventWithProgramDimensions({
                ...trackerProgram,
                dimensions: [dimensionName],
            })

            selectFixedPeriod({
                label: periodLabel,
                period: TEST_FIX_PE_DEC_LAST_YEAR,
            })

            clickMenubarUpdateButton()

            saveVisualization(
                `INTERPRETATIONS TEST ${new Date().toLocaleString()}`
            )

            // Toggle to `true` to prevent re-creation
            created = true
        }
    })

    it('the interpretations panel can be toggled when clicking the button in the toolbar', () => {
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

    it('the interpretations panel can be toggled by clicking the option in the view menu', () => {
        // Hiding (the interpretations panel is open at the start of the test)
        clickMenubarViewButton()

        cy.getBySel('dhis2-uicore-menuitem')
            .contains('Hide interpretations and details')
            .should('be.visible')
            .click()

        cy.getBySel('details-panel').should('not.exist')

        // Showing
        clickMenubarViewButton()

        cy.getBySel('dhis2-uicore-menuitem')
            .contains('Show interpretations and details')
            .should('be.visible')
            .click()

        cy.getBySel('details-panel').should('be.visible')
        cy.getBySel('details-panel').contains('Interpretations')
    })

    it('a new interpretation can be added', () => {
        // the rich text editor shows when clicking the input
        cy.getBySel('interpretation-form', EXTENDED_TIMEOUT)
            .find(`input[placeholder="${TEST_WRITE_INTERPRETATION_LABEL}"]`)
            .click()

        cy.getBySel('interpretation-form').contains(
            TEST_POST_INTERPRETATION_LABEL
        )
        cy.getBySel('interpretation-form').contains(TEST_CANCEL_LABEL)

        // the rich text editor is removed when clicking Cancel
        cy.getBySel('interpretation-form').contains(TEST_CANCEL_LABEL).click()

        cy.getBySel('interpretation-form').should(
            'not.contain',
            TEST_POST_INTERPRETATION_LABEL
        )
        cy.getBySel('interpretation-form').should(
            'not.contain',
            TEST_CANCEL_LABEL
        )

        // it's possible to write a new interpretation text
        cy.getBySel('interpretation-form')
            .find(`input[placeholder="${TEST_WRITE_INTERPRETATION_LABEL}"]`)
            .click()

        typeTextarea('interpretation-form', TEST_INTERPRETATION_TEXT)

        // the new interpretation can be saved and shows up in the list
        cy.getBySel('interpretation-form')
            .contains(TEST_POST_INTERPRETATION_LABEL)
            .click()

        cy.getBySel('interpretations-list').contains(TEST_INTERPRETATION_TEXT)
        cy.getBySel('interpretations-list').contains('See interpretation')
    })

    it('the new interpretation can be edited', () => {
        cy.getBySel('interpretation-edit-button', EXTENDED_TIMEOUT).click()

        cy.getBySel('interpretations-list').contains('Update')
        cy.getBySel('interpretations-list').contains(TEST_CANCEL_LABEL)

        clearTextarea('interpretations-list')
        typeTextarea('interpretations-list', TEST_INTERPRETATION_TEXT_EDITED)

        cy.getBySel('interpretations-list').contains('Update').click()

        expectInterpretationFormToBeVisible()

        cy.getBySel('interpretations-list')
            .contains('Update')
            .should('have.class', 'loading')

        cy.getBySel('interpretations-list').contains(
            TEST_INTERPRETATION_TEXT_EDITED
        )

        cy.getBySel('interpretations-list')
            .contains('Update')
            .should('not.exist')
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
            .find(`input[placeholder="${TEST_WRITE_REPLY_LABEL}"]`)
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

    after(() => {
        deleteVisualization()
    })
})
