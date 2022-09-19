import {
    DIMENSION_ID_PROGRAM_STATUS,
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_LAST_UPDATED_BY,
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
const testDimensions = [
    DIMENSION_ID_PROGRAM_STATUS,
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_LAST_UPDATED_BY,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_LAST_UPDATED,
]

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
        // add main and time dimensions
        testDimensions.forEach((dimensionId) => {
            cy.getBySel('main-sidebar')
                .findBySel(`dimension-item-${dimensionId}`)
                .find('button')
                .click({ force: true })

            cy.contains('Add to Columns').click()
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        // check the correct number of columns
        getTableHeaderCells().its('length').should('equal', 11)

        const labels = [
            'Organisation unit',
            dimensionName,
            'Event status',
            'Program status',
            'Created by',
            'Last updated by',
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
