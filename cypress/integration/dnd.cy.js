import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_LAST_UPDATED,
    DIMENSION_ID_SCHEDULED_DATE,
} from '../../src/modules/dimensionConstants.js'
import {
    ANALYTICS_PROGRAM,
    TEST_DIM_TEXT,
    TEST_DIM_TEXT_ID,
    TEST_FIX_PE_DEC_LAST_YEAR,
    TEST_REL_PE_LAST_12_MONTHS,
} from '../data/index.js'
import {
    selectEventProgramDimensions,
    selectProgramAndStage,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import {
    selectFixedPeriod,
    selectRelativePeriod,
    assertSelectedPeriodInModal,
    clickPeriodModalUpdateButton,
} from '../helpers/period.js'
import {
    getTableRows,
    getTableHeaderCells,
    expectTableToBeVisible,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('dnd', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)

        cy.getBySel('main-sidebar', EXTENDED_TIMEOUT)
    })

    it('creates an event line list with dnd', () => {
        const event = ANALYTICS_PROGRAM
        const dimensionName = TEST_DIM_TEXT
        const periodLabel = event[DIMENSION_ID_ENROLLMENT_DATE]

        const { inputType, programName, stageName } = event

        selectProgramAndStage({ inputType, programName, stageName })

        cy.get('#axis-group-1').then(($el) => {
            const layoutRect = $el.get(0).getBoundingClientRect()

            // dnd the dimension to the layout
            cy.getBySel(`dimension-item-${TEST_DIM_TEXT_ID}`).mouseMoveTo(
                layoutRect.left + layoutRect.width / 2,
                layoutRect.top + layoutRect.height / 2
            )

            cy.getBySel('time-enrollmentDate').mouseMoveTo(
                layoutRect.left + layoutRect.width / 2,
                layoutRect.top + layoutRect.height / 2
            )

            // open enrollmentDate and set the date
            cy.getBySel('main-sidebar').contains(periodLabel).click()
            cy.contains('Choose from presets').click()
            cy.contains('Relative periods').click()

            cy.contains(TEST_REL_PE_LAST_12_MONTHS.name).dblclick()

            assertSelectedPeriodInModal(TEST_REL_PE_LAST_12_MONTHS.name)

            clickPeriodModalUpdateButton()

            expectTableToBeVisible()

            cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)

            // // check the correct number of columns
            getTableHeaderCells().its('length').should('equal', 3)

            // // check that there is at least 1 row in the table
            getTableRows().its('length').should('be.gte', 1)

            // // check the column headers in the table
            getTableHeaderCells()
                .contains('Organisation unit')
                .should('be.visible')
            getTableHeaderCells().contains(dimensionName).should('be.visible')
            getTableHeaderCells().contains(periodLabel).should('be.visible')

            // //check the chips in the layout
            cy.getBySel('columns-axis')
                .findBySelLike('layout-chip')
                .contains('Organisation unit: 1 selected')
                .should('be.visible')

            cy.getBySel('columns-axis')
                .findBySelLike('layout-chip')
                .contains(`${dimensionName}: all`)
                .should('be.visible')

            cy.getBySel('columns-axis')
                .findBySelLike('layout-chip')
                .contains(`${periodLabel}: 1 selected`)
                .should('be.visible')
        })
    })

    it('moves a dimension to filter with dnd', () => {
        const event = ANALYTICS_PROGRAM
        const dimensionName = TEST_DIM_TEXT
        const periodLabel = event[DIMENSION_ID_EVENT_DATE]

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

        cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)

        cy.get('#axis-group-2').then(($el) => {
            const layoutRect = $el.get(0).getBoundingClientRect()

            // dnd the event date to the layout
            cy.getBySel('columns-axis')
                .findBySel('layout-chip-eventDate')
                .mouseMoveTo(
                    layoutRect.left + layoutRect.width / 2,
                    layoutRect.top + layoutRect.height / 2
                )

            // dnd the Analytics-Text to the first position

            cy.get('#axis-group-1').then((columnsLayoutEl) => {
                const columnsLayoutRect = columnsLayoutEl
                    .get(0)
                    .getBoundingClientRect()

                cy.getBySel(`dimension-item-${TEST_DIM_TEXT_ID}`).mouseMoveTo(
                    columnsLayoutRect.left + 3,
                    columnsLayoutRect.top + 3
                )

                clickMenubarUpdateButton()

                // check the number of columns
                getTableHeaderCells().its('length').should('equal', 2)

                // check that there is at least 1 row in the table
                getTableRows().its('length').should('be.gte', 1)

                // check the column headers in the table
                getTableHeaderCells()
                    .contains('Organisation unit')
                    .should('be.visible')
                getTableHeaderCells()
                    .contains(dimensionName)
                    .should('be.visible')
                getTableHeaderCells().contains(periodLabel).should('not.exist')

                //check the chips in the layout
                cy.getBySel('columns-axis')
                    .findBySelLike('layout-chip')
                    .contains('Organisation unit: 1 selected')
                    .should('be.visible')

                cy.getBySel('columns-axis')
                    .findBySelLike('layout-chip')
                    .contains(`${dimensionName}: all`)
                    .should('be.visible')

                cy.getBySel('filters-axis')
                    .findBySelLike('layout-chip')
                    .contains(`${periodLabel}: 1 selected`)
                    .should('be.visible')
            })
        })
    })
})
