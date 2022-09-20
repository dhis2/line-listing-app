import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_LAST_UPDATED,
    DIMENSION_ID_SCHEDULED_DATE,
} from '../../src/modules/dimensionConstants.js'
import { ANALYTICS_PROGRAM, TEST_REL_PE_THIS_YEAR } from '../data/index.js'
import { selectEventProgram } from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod } from '../helpers/period.js'
import {
    getTableRows,
    getTableHeaderCells,
    expectTableToBeVisible,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const event = ANALYTICS_PROGRAM
const timeDimensions = [
    { id: DIMENSION_ID_EVENT_DATE, rowsLength: 6 },
    { id: DIMENSION_ID_ENROLLMENT_DATE, rowsLength: 4 },
    { id: DIMENSION_ID_SCHEDULED_DATE, rowsLength: 6 },
    { id: DIMENSION_ID_INCIDENT_DATE, rowsLength: 4 },
    { id: DIMENSION_ID_LAST_UPDATED, rowsLength: 13 },
]

describe('event', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        selectEventProgram(event)
    })

    timeDimensions.forEach((dimension) => {
        it(`${dimension.id} shows the correct title in layout and table header`, () => {
            const label = event[dimension.id]
            selectRelativePeriod({ label, period: TEST_REL_PE_THIS_YEAR })

            clickMenubarUpdateButton()

            expectTableToBeVisible()

            // check the correct number of columns
            getTableHeaderCells().its('length').should('equal', 2)

            // check the correct number of rows
            getTableRows().should('have.length', dimension.rowsLength)

            // check the label in the column header
            getTableHeaderCells().contains(label).should('be.visible')

            //check the chip in the layout
            cy.getBySel('columns-axis')
                .findBySelLike('layout-chip')
                .contains(`${label}: 1 selected`)
                .should('be.visible')
        })
    })
})
