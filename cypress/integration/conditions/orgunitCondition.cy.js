import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_DIM_ORG_UNIT,
    TEST_REL_PE_THIS_YEAR,
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

const trackerProgram = E2E_PROGRAM
const periodLabel = trackerProgram[DIMENSION_ID_EVENT_DATE]
const stageName = 'Stage 1 - Repeatable'

const setUpTable = () => {
    selectEventWithProgram(trackerProgram)

    openProgramDimensionsSidebar()

    selectRelativePeriod({
        label: periodLabel,
        period: TEST_REL_PE_THIS_YEAR,
    })

    clickMenubarUpdateButton()

    expectTableToBeVisible()
}

describe('Org unit condition', () => {
    const dimensionName = TEST_DIM_ORG_UNIT
    const orgUnitName = 'Koinadugu'

    it('Organisation unit displays correctly', () => {
        goToStartPage()

        setUpTable()

        openDimension(dimensionName)

        cy.getBySel('button-add-condition').should('not.exist')

        cy.getBySel('conditions-modal').contains(orgUnitName).click()

        cy.getBySel('conditions-modal').contains('Add to Columns').click()

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [stageName, orgUnitName])
    })
})
