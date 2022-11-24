import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import { E2E_PROGRAM, TEST_REL_PE_LAST_YEAR } from '../../data/index.js'
import { typeInput } from '../../helpers/common.js'
import {
    openDimension,
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
import {
    expectTableToBeVisible,
    expectTableToContainValue,
    expectTableToMatchRows,
    expectTableToNotContainValue,
} from '../../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../../support/util.js'

describe('Option set condition', () => {
    it('Option set (number) displays correctly', () => {
        const dimensionName = 'E2E - Number (option set)'
        const filteredOutOptionName = 'Four'
        const filteredOptionName = 'Eight'

        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventWithProgram(E2E_PROGRAM)

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

        typeInput(
            'option-set-left-header-filter-input-field',
            filteredOptionName
        )

        cy.getBySel('option-set-transfer-sourceoptions')
            .contains(filteredOptionName)
            .dblclick()

        cy.getBySel('conditions-modal').contains('Update').click()

        assertChipContainsText(`${dimensionName}: 1 selected`)

        assertTooltipContainsEntries([filteredOptionName])

        expectTableToNotContainValue(filteredOutOptionName)
        expectTableToContainValue(filteredOptionName)

        expectTableToMatchRows([
            `${getPreviousYearStr()}-12-23`,
            `${getPreviousYearStr()}-12-22`,
        ])
    })

    it('Option set (text) displays correctly', () => {
        const dimensionName = 'E2E - Text (option set)'
        const filteredOutOptionName = 'COVID 19 - Moderna'
        const filteredOptionName = 'COVID 19 - AstraZeneca'

        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventWithProgram(E2E_PROGRAM)

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

        typeInput(
            'option-set-left-header-filter-input-field',
            filteredOptionName
        )

        cy.getBySel('option-set-transfer-sourceoptions')
            .contains(filteredOptionName)
            .dblclick()

        cy.getBySel('conditions-modal').contains('Update').click()

        assertChipContainsText(`${dimensionName}: 1 selected`)

        assertTooltipContainsEntries([filteredOptionName])

        expectTableToNotContainValue(filteredOutOptionName)
        expectTableToContainValue(filteredOptionName)

        expectTableToMatchRows([`${getPreviousYearStr()}-12-10`])
    })
})
