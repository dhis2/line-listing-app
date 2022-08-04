import { DIMENSION_ID_ENROLLMENT_DATE } from '../../src/modules/dimensionConstants.js'
import { TEST_ENROLLMENT_DATA, TEST_FIXED_PERIODS } from '../data/index.js'
import { selectEnrollmentProgramDimensions } from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectFixedPeriod } from '../helpers/period.js'
import {
    getTableHeaderCells,
    expectTableToBeVisible,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const enrollment = TEST_ENROLLMENT_DATA[0]
const periodLabel = enrollment[DIMENSION_ID_ENROLLMENT_DATE]
const TEST_DIMENSIONS = ['Created by', 'Last updated by']

describe('user dimensions', () => {
    TEST_DIMENSIONS.forEach((dimensionName) => {
        it(dimensionName, () => {
            // set up table
            cy.visit('/', EXTENDED_TIMEOUT)
            selectEnrollmentProgramDimensions(enrollment)
            selectFixedPeriod({
                label: periodLabel,
                period: TEST_FIXED_PERIODS[0],
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
