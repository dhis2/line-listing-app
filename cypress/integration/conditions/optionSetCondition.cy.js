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

// TODO: enable for 38+ when numeric option set has been figured out
// there was a bug in 38 showing the code instead of name
// it's supposed to be fixed in 39, but the test fails due to the same issue

const assertNumericOptionSet = ({
    tableFilteredOptionName,
    tableFilteredOutOptionName,
    selectorFilteredOptionName,
}) => {
    const dimensionName = 'E2E - Number (option set)'

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

    expectTableToContainValue(tableFilteredOptionName)
    expectTableToContainValue(tableFilteredOutOptionName)

    cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)

    openDimension(dimensionName)

    typeInput(
        'option-set-left-header-filter-input-field',
        selectorFilteredOptionName
    )

    cy.getBySel('option-set-transfer-sourceoptions')
        .contains(selectorFilteredOptionName)
        .dblclick()

    cy.getBySel('option-set-transfer-pickedoptions').contains(
        selectorFilteredOptionName,
        EXTENDED_TIMEOUT
    )

    cy.getBySel('conditions-modal').contains('Update').click()

    expectTableToBeVisible()

    assertChipContainsText(`${dimensionName}: 1 selected`)

    assertTooltipContainsEntries([selectorFilteredOptionName])

    expectTableToNotContainValue(tableFilteredOutOptionName)
    expectTableToContainValue(tableFilteredOptionName)

    expectTableToMatchRows([
        `${getPreviousYearStr()}-12-23`,
        `${getPreviousYearStr()}-12-22`,
    ])
}

describe('Option set condition', () => {
    it(['>37', '<39'], 'Option set (number) displays correctly (2.38)', () => {
        assertNumericOptionSet({
            tableFilteredOptionName: 'Ei ght',
            tableFilteredOutOptionName: 'F our',
            selectorFilteredOptionName: 'Eight',
        })
    })

    it(['>38', '<40'], 'Option set (number) displays correctly (2.39)', () => {
        assertNumericOptionSet({
            tableFilteredOptionName: '8',
            tableFilteredOutOptionName: '4',
            selectorFilteredOptionName: 'Eight',
        })
    })

    it(['>=40'], 'Option set (number) displays correctly (2.40+)', () => {
        assertNumericOptionSet({
            tableFilteredOptionName: 'Ei ght',
            tableFilteredOutOptionName: 'F our',
            selectorFilteredOptionName: 'Eight',
        })
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
