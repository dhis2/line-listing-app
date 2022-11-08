import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import {
    ANALYTICS_PROGRAM,
    TEST_DIM_ORG_UNIT,
    TEST_REL_PE_THIS_YEAR,
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

describe('Org unit condition', () => {
    const dimensionName = TEST_DIM_ORG_UNIT
    const orgUnitName = '02 Phongsali'

    it('Organisation unit displays correctly', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        setUpTable()

        openDimension(dimensionName)

        cy.getBySel('button-add-condition').should('not.exist')

        cy.getBySel('conditions-modal').contains(orgUnitName).click()

        cy.getBySel('conditions-modal').contains('Add to Columns').click()

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, orgUnitName])
    })
})
