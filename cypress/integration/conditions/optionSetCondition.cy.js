import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_DIM_NUMBER_OPTIONSET,
    TEST_DIM_TEXT_OPTIONSET,
    TEST_REL_PE_LAST_YEAR,
} from '../../data/index.js'
import { goToAO } from '../../helpers/common.js'
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
import {
    selectRelativePeriod,
    getPreviousYearStr,
} from '../../helpers/period.js'
import { goToStartPage } from '../../helpers/startScreen.js'
import {
    expectTableToBeVisible,
    expectTableToContainValue,
    expectTableToMatchRows,
    expectTableToNotContainValue,
} from '../../helpers/table.js'
import {
    searchAndSelectInOptionsTransfer,
    selectInOptionsTransfer,
} from '../../helpers/transfer.js'

describe('Option set condition', () => {
    it('Option set (number) displays correctly', () => {
        const dimensionName = TEST_DIM_NUMBER_OPTIONSET
        const valueToFilterBy = 'Eight'
        const valueToFilterOut = 'Four'

        goToStartPage()

        selectEventWithProgram(E2E_PROGRAM)

        openProgramDimensionsSidebar()

        selectRelativePeriod({
            label: E2E_PROGRAM[DIMENSION_ID_EVENT_DATE],
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        openDimension(dimensionName)

        cy.getBySel('button-add-condition').should('not.exist')

        cy.contains('Add to Columns').click()

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        expectTableToContainValue(valueToFilterBy)
        expectTableToContainValue(valueToFilterOut)

        cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)

        openDimension(dimensionName)

        searchAndSelectInOptionsTransfer(valueToFilterBy)

        cy.getBySel('conditions-modal').contains('Update').click()

        expectTableToBeVisible()

        assertChipContainsText(`${dimensionName}: 1 selected`)

        assertTooltipContainsEntries([valueToFilterBy])

        expectTableToNotContainValue(valueToFilterOut)
        expectTableToContainValue(valueToFilterBy)

        expectTableToMatchRows([
            `${getPreviousYearStr()}-12-23`,
            `${getPreviousYearStr()}-12-22`,
        ])
    })

    it('Option set (text) displays correctly', () => {
        const dimensionName = TEST_DIM_TEXT_OPTIONSET
        const filteredOutOptionName = 'COVID 19 - Moderna'
        const filteredOptionName = 'COVID 19 - AstraZeneca'

        goToStartPage()

        selectEventWithProgram(E2E_PROGRAM)

        openProgramDimensionsSidebar()

        selectRelativePeriod({
            label: E2E_PROGRAM[DIMENSION_ID_EVENT_DATE],
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        openDimension(dimensionName)

        cy.getBySel('button-add-condition').should('not.exist')

        cy.contains('Add to Columns').click()

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        expectTableToContainValue(filteredOutOptionName)
        expectTableToContainValue(filteredOptionName)

        cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)

        openDimension(dimensionName)

        searchAndSelectInOptionsTransfer(filteredOptionName)

        cy.getBySel('conditions-modal').contains('Update').click()

        assertChipContainsText(`${dimensionName}: 1 selected`)

        assertTooltipContainsEntries([filteredOptionName])

        expectTableToNotContainValue(filteredOutOptionName)
        expectTableToContainValue(filteredOptionName)

        expectTableToMatchRows([`${getPreviousYearStr()}-12-10`])
    })

    it('Options with same code but from different option sets display correctly', () => {
        const testData = [
            {
                dimensionName: 'WHOMCH Pain medication given',
                filteredOptionNames: ['Morphine', 'Spinal'],
            },
            {
                dimensionName: 'WHOMCH Clinical impression of pre-eclampsia',
                filteredOptionNames: [
                    'None',
                    'Pre-eclampsia',
                    'Severe pre-eclampsia',
                ],
            },
        ]

        goToAO('C1XaMuNaeDy')

        expectTableToBeVisible()

        testData.forEach(({ dimensionName, filteredOptionNames }) => {
            cy.getBySelLike('layout-chip').contains(dimensionName).click()

            filteredOptionNames.forEach(selectInOptionsTransfer)

            cy.getBySel('conditions-modal').contains('Update').click()

            assertChipContainsText(
                `${dimensionName}: ${filteredOptionNames.length} selected`
            )

            assertTooltipContainsEntries(filteredOptionNames)
        })
    })
})
