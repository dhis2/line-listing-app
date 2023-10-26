import { DIMENSION_ID_ENROLLMENT_DATE } from '../../src/modules/dimensionConstants.js'
import { E2E_PROGRAM, TEST_FIX_PE_DEC_LAST_YEAR } from '../data/index.js'
import {
    openProgramDimensionsSidebar,
    selectEnrollmentWithProgram,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectFixedPeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    getTableHeaderCells,
    expectTableToBeVisible,
} from '../helpers/table.js'

const enrollment = E2E_PROGRAM
const periodLabel = enrollment[DIMENSION_ID_ENROLLMENT_DATE]
const TEST_DIMENSIONS = ['Created by', 'Last updated by']

describe('user dimensions', () => {
    TEST_DIMENSIONS.forEach((dimensionName) => {
        it(`${dimensionName} is added to the layout`, () => {
            // set up table
            goToStartPage()
            selectEnrollmentWithProgram(enrollment)
            openProgramDimensionsSidebar()
            selectFixedPeriod({
                label: periodLabel,
                period: TEST_FIX_PE_DEC_LAST_YEAR,
            })

            // open modal
            cy.getBySel('main-sidebar').contains(dimensionName).click()

            // check modal content
            cy.getBySel('conditions-modal-title').contains(dimensionName)
            cy.getBySel('conditions-modal-content').contains(
                "This dimension can't be filtered. All values will be shown."
            )

            // add dimension to layout
            cy.contains('Add to Columns').click()

            // load table
            clickMenubarUpdateButton()
            expectTableToBeVisible()

            // dimension is in table header
            getTableHeaderCells().contains(dimensionName).should('be.visible')

            // dimension has a chip in the layout
            cy.getBySel('columns-axis')
                .findBySelLike('layout-chip')
                .contains(`${dimensionName}: all`)
                .should('be.visible')
        })
    })
})
