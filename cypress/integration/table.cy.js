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
    getTableRows,
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

    cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)
}

describe('table', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
    })

    it('click on column header opens the dimension dialog', () => {
        // check the correct number of columns
        getTableHeaderCells().its('length').should('equal', 11)

        // check that there is at least 1 row in the table
        getTableRows().its('length').should('be.gte', 1)

        // check the column headers in the table
        getTableHeaderCells()
            .contains('Organisation unit')
            .should('be.visible')
            .click()
        cy.getBySelLike('modal-title').contains('Organisation unit')
        cy.getBySelLike('modal-action-cancel').click()

        getTableHeaderCells()
            .contains(dimensionName)
            .should('be.visible')
            .click()
        cy.getBySelLike('modal-title').contains(dimensionName)
        cy.getBySelLike('modal-action-cancel').click()

        getTableHeaderCells().contains(periodLabel).should('be.visible').click()
        cy.getBySelLike('modal-title').contains(periodLabel)
        cy.getBySelLike('modal-action-cancel').click()

        testDimensions.forEach((dimensionId) => {
            const label = event[dimensionId]

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
