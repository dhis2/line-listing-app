import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import { TEST_EVENT_DATA, TEST_FIXED_PERIODS } from '../data/index.js'
import { selectEventProgramDimensions } from '../helpers/dimensions.js'
import { selectFixedPeriod } from '../helpers/period.js'
import { expectTableToBeVisible, getTableRows } from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const event = TEST_EVENT_DATA[0]
const periodLabel = event[DIMENSION_ID_EVENT_DATE]

describe('new', () => {
    it('creates a new line list', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        cy.getBySelLike('layout-chip').contains(`Organisation unit: 1 selected`)

        selectEventProgramDimensions(event)

        selectFixedPeriod({ label: periodLabel, period: TEST_FIXED_PERIODS[0] })

        cy.getWithDataTest('{menubar}').contains('Update').click()

        expectTableToBeVisible()

        getTableRows().its('length').should('be.gte', 1)
    })
})
