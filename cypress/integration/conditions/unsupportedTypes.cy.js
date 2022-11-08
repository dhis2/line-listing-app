import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import {
    ANALYTICS_PROGRAM,
    TEST_REL_PE_THIS_YEAR,
    TEST_DIM_AGE,
    TEST_DIM_COORDINATE,
} from '../../data/index.js'
import { openDimension, selectEventProgram } from '../../helpers/dimensions.js'
import {
    assertChipContainsText,
    assertTooltipContainsEntries,
} from '../../helpers/layout.js'
import { clickMenubarUpdateButton } from '../../helpers/menubar.js'
import { selectRelativePeriod } from '../../helpers/period.js'
import { expectTableToBeVisible } from '../../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../../support/util.js'

const event = ANALYTICS_PROGRAM
const stageName = 'Stage 1 - Repeatable'
const periodLabel = event.stages[stageName][DIMENSION_ID_EVENT_DATE].label

const setUpTable = () => {
    selectEventProgram(event)

    selectRelativePeriod({
        label: periodLabel,
        period: TEST_REL_PE_THIS_YEAR,
    })

    clickMenubarUpdateButton()

    expectTableToBeVisible()
}

describe('unsupported types', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
    })

    const TEST_TYPES = [
        { dimension: TEST_DIM_AGE, name: 'Age' },
        { dimension: TEST_DIM_COORDINATE, name: 'Coordinate' },
    ]

    TEST_TYPES.forEach((type) => {
        it(`${type.name} displays correctly`, () => {
            cy.visit('/', EXTENDED_TIMEOUT)

            selectEventProgram(ANALYTICS_PROGRAM)

            openDimension(type.dimension)

            cy.getBySel('button-add-condition').should('not.exist')

            cy.getBySel('conditions-modal').contains(
                "This dimension can't be filtered. All values will be shown."
            )

            cy.getBySel('conditions-modal').contains('Add to Columns').click()

            assertChipContainsText(`${type.dimension}: all`)

            assertTooltipContainsEntries([
                stageName,
                'Showing all values for this dimension',
            ])
        })
    })
})
