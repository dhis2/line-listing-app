import { selectEventProgram } from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const BUTTON_NEW = 'file-menu-new'
const BUTTON_OPEN = 'file-menu-open'
const BUTTON_SAVE = 'file-menu-save'
const BUTTON_SAVEAS = 'file-menu-saveas'
const BUTTON_RENAME = 'file-menu-rename'
const BUTTON_TRANSLATE = 'file-menu-translate'
const BUTTON_SHARING = 'file-menu-sharing'
const BUTTON_GETLINK = 'file-menu-getlink'
const BUTTON_DELETE = 'file-menu-delete'

const itemIsEnabled = (id) =>
    cy.getBySel(id).should('have.css', 'cursor', 'pointer')

const itemIsDisabled = (id) =>
    cy.getBySel(id).should('have.css', 'cursor', 'not-allowed')

describe('file menu', () => {
    it('reflects empty state', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        cy.getBySel('menubar').contains('File').click()

        itemIsEnabled(BUTTON_NEW)
        itemIsEnabled(BUTTON_OPEN)
        itemIsDisabled(BUTTON_SAVE)
        itemIsDisabled(BUTTON_SAVEAS)
        itemIsDisabled(BUTTON_RENAME)
        itemIsDisabled(BUTTON_TRANSLATE)
        itemIsDisabled(BUTTON_SHARING)
        itemIsDisabled(BUTTON_GETLINK)
        itemIsDisabled(BUTTON_DELETE)
    })

    it('reflects unsaved state', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventProgram({
            programName: 'Adverse events following immunization',
        })

        clickMenubarUpdateButton()

        cy.getBySel('menubar').contains('File').click()

        itemIsEnabled(BUTTON_NEW)
        itemIsEnabled(BUTTON_OPEN)
        itemIsEnabled(BUTTON_SAVE)
        itemIsDisabled(BUTTON_SAVEAS)
        itemIsDisabled(BUTTON_RENAME)
        itemIsDisabled(BUTTON_TRANSLATE)
        itemIsDisabled(BUTTON_SHARING)
        itemIsDisabled(BUTTON_GETLINK)
        itemIsDisabled(BUTTON_DELETE)
    })
})

// selectEventProgram(event)

// selectFixedPeriod({
//     label: periodLabel,
//     period: TEST_FIX_PE_DEC_LAST_YEAR,
// })

// clickMenubarUpdateButton()

// expectTableToBeVisible()

// getTableRows().its('length').should('be.gte', 1)
