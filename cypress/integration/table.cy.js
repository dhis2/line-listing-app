import {
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_LAST_UPDATED,
} from '../../src/modules/dimensionConstants.js'
import {
    ANALYTICS_PROGRAM,
    TEST_DIM_TEXT,
    TEST_FIX_PE_DEC_LAST_YEAR,
} from '../data/index.js'
import { selectEventProgramDimensions } from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectFixedPeriod } from '../helpers/period.js'
import {
    getTableHeaderCells,
    expectTableToBeVisible,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const event = ANALYTICS_PROGRAM
const dimensionName = TEST_DIM_TEXT
const periodLabel = event[DIMENSION_ID_EVENT_DATE]

const setUpTable = () => {
    selectEventProgramDimensions({
        ...event,
        dimensions: [dimensionName],
    })

    selectFixedPeriod({
        label: periodLabel,
        period: TEST_FIX_PE_DEC_LAST_YEAR,
    })

    clickMenubarUpdateButton()

    expectTableToBeVisible()
}

describe('table', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
    })

    it('click on column header opens the dimension dialog', () => {
        const testDimensions = [
            event[DIMENSION_ID_ENROLLMENT_DATE],
            event[DIMENSION_ID_INCIDENT_DATE],
            event[DIMENSION_ID_SCHEDULED_DATE],
            event[DIMENSION_ID_LAST_UPDATED],
            'Event status',
            'Program status',
            'Created by',
            'Last updated by',
        ]

        // add main and time dimensions
        testDimensions.forEach((dimension) => {
            cy.getBySel('main-sidebar')
                .contains(dimension)
                .closest(`[data-test*="dimension-item"]`)
                .find('button')
                .click({ force: true })

            cy.contains('Add to Columns').click()
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        // check the correct number of columns
        getTableHeaderCells().its('length').should('equal', 11)

        // extend list with the dimensions that were added in other parts of the test
        const labels = [
            ...testDimensions,
            'Organisation unit',
            event[DIMENSION_ID_EVENT_DATE],
            dimensionName,
        ]

        // check the column headers in the table
        labels.forEach((label) => {
            getTableHeaderCells()
                .contains(label)
                .scrollIntoView()
                .should('be.visible')
                .click()
            cy.getBySelLike('modal-title').contains(label)
            cy.getBySelLike('modal-action-cancel').click()
        })
    })
})
