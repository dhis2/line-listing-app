import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import { E2E_PROGRAM, TEST_FIX_PE_DEC_LAST_YEAR } from '../data/index.js'
import { selectEventWithProgram } from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectFixedPeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import { expectTableToBeVisible, getTableRows } from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const event = E2E_PROGRAM
const periodLabel = event[DIMENSION_ID_EVENT_DATE]

describe('new', () => {
    it('creates a new line list', () => {
        goToStartPage()

        cy.getBySelLike('layout-chip', EXTENDED_TIMEOUT).contains(
            `Organisation unit: 1 selected`
        )

        selectEventWithProgram(event)

        selectFixedPeriod({
            label: periodLabel,
            period: TEST_FIX_PE_DEC_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        getTableRows().its('length').should('be.gte', 1)
    })
})
