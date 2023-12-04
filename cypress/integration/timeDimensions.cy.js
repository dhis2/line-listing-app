import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_LAST_UPDATED,
    DIMENSION_ID_SCHEDULED_DATE,
} from '../../src/modules/dimensionConstants.js'
import { E2E_PROGRAM, TEST_REL_PE_THIS_YEAR } from '../data/index.js'
import {
    openInputSidebar,
    openProgramDimensionsSidebar,
    selectEventWithProgram,
} from '../helpers/dimensions.js'
import { assertChipContainsText } from '../helpers/layout.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    getTableRows,
    getTableHeaderCells,
    expectTableToBeVisible,
} from '../helpers/table.js'

const trackerProgram = E2E_PROGRAM

const assertTimeDimension = (dimension) => {
    it(`${dimension.id} shows the correct title in layout and table header`, () => {
        selectEventWithProgram(trackerProgram)
        openProgramDimensionsSidebar()
        const label = trackerProgram[dimension.id]
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
        assertChipContainsText(label, 1)
    })
}

describe(['>37', '<39'], 'time dimensions', () => {
    beforeEach(() => {
        goToStartPage()
    })

    // Note: The rowsLengths needs to be updated when events are changed or added to the database
    const timeDimensions = [
        { id: DIMENSION_ID_EVENT_DATE, rowsLength: 7 },
        { id: DIMENSION_ID_ENROLLMENT_DATE, rowsLength: 12 },
        { id: DIMENSION_ID_INCIDENT_DATE, rowsLength: 12 },
        { id: DIMENSION_ID_LAST_UPDATED, rowsLength: 11 },
    ]

    timeDimensions.forEach((dimension) => {
        assertTimeDimension(dimension)
    })
})

describe(['>=39'], 'time dimensions', () => {
    beforeEach(() => {
        goToStartPage()
    })

    // Note: The rowsLengths needs to be updated when events are changed or added to the database
    const timeDimensions = [
        { id: DIMENSION_ID_EVENT_DATE, rowsLength: 7 },
        { id: DIMENSION_ID_ENROLLMENT_DATE, rowsLength: 13 },
        { id: DIMENSION_ID_INCIDENT_DATE, rowsLength: 13 },
        { id: DIMENSION_ID_LAST_UPDATED, rowsLength: 12 },
        { id: DIMENSION_ID_SCHEDULED_DATE, rowsLength: 7 },
    ]

    timeDimensions.forEach((dimension) => {
        assertTimeDimension(dimension)
    })

    it('scheduled date disabled state is set based on stage setting ', () => {
        // select a program, the default stage has hideDueDate = false
        selectEventWithProgram({ programName: 'Child Programme' })
        openProgramDimensionsSidebar()

        // scheduled date is shown when a program is selected as stage is auto-selected
        cy.getBySel('dimension-item-scheduledDate').should('exist')

        // incident date is shown because Child Programme has show incident date = true
        cy.getBySel('dimension-item-incidentDate').should('exist')

        // select a program with a stage that has hideDueDate = true
        openInputSidebar()
        cy.getBySel('accessory-sidebar').contains('Child Programme').click()
        cy.contains(
            'Malaria case diagnosis, treatment and investigation'
        ).click()

        // scheduled date is hidden when a stage that hides it is selected
        cy.getBySel('dimension-item-scheduledDate').should('not.exist')

        // incident date is shown because the program has hideDueDate = true
        cy.getBySel('dimension-item-incidentDate').should('not.exist')
    })
})
// TODO: add tests for disabling incidentDate per program, e.g. enabled for Analytics program, disabled for HIV Case Surveillance
