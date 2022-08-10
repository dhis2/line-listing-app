import { TEST_AOS } from '../data/index.js'
import { expectInterpretationFormToBeVisible } from '../helpers/interpretations.js'
import { clickMenubarInterpretationsButton } from '../helpers/menubar.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const TEST_AO_ID = TEST_AOS[0].id

describe('interpretations', () => {
    it('opens the interpretations panel when clicking the button in the toolbar', () => {
        cy.visit(`#/${TEST_AO_ID}`, EXTENDED_TIMEOUT)

        clickMenubarInterpretationsButton()

        cy.getBySel('details-panel').contains('Interpretations')

        expectInterpretationFormToBeVisible()
    })
})
