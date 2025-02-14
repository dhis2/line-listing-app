import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_REL_PE_THIS_YEAR,
    TEST_DIM_AGE,
    TEST_DIM_COORDINATE,
} from '../../data/index.js'
import {
    openDimension,
    openProgramDimensionsSidebar,
    selectEventWithProgram,
} from '../../helpers/dimensions.js'
import {
    assertChipContainsText,
    assertTooltipContainsEntries,
} from '../../helpers/layout.js'
import { clickMenubarUpdateButton } from '../../helpers/menubar.js'
import { selectRelativePeriod } from '../../helpers/period.js'
import { goToStartPage } from '../../helpers/startScreen.js'
import { expectTableToBeVisible } from '../../helpers/table.js'

const event = E2E_PROGRAM
const periodLabel = event[DIMENSION_ID_EVENT_DATE]
const stageName = 'Stage 1 - Repeatable'

const setUpTable = () => {
    selectEventWithProgram(event)

    openProgramDimensionsSidebar()

    selectRelativePeriod({
        label: periodLabel,
        period: TEST_REL_PE_THIS_YEAR,
    })

    clickMenubarUpdateButton()

    expectTableToBeVisible()
}

describe('unsupported types', () => {
    beforeEach(() => {
        goToStartPage()
        setUpTable()
    })

    const TEST_TYPES = [
        { dimension: TEST_DIM_AGE, name: 'Age' },
        { dimension: TEST_DIM_COORDINATE, name: 'Coordinate' },
    ]

    TEST_TYPES.forEach((type) => {
        it(`${type.name} displays correctly`, () => {
            goToStartPage()

            selectEventWithProgram(E2E_PROGRAM)

            openProgramDimensionsSidebar()

            openDimension(type.dimension)

            cy.getBySel('button-add-condition').should('not.exist')

            cy.getBySel('conditions-modal').contains(
                "This dimension can't be filtered. All values will be shown."
            )

            cy.getBySel('conditions-modal').contains('Add to Columns').click()

            assertChipContainsText(type.dimension, 'all')

            assertTooltipContainsEntries(type.dimension, [
                stageName,
                'Showing all values for this dimension',
            ])
        })
    })
})
