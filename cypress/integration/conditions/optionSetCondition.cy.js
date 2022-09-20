import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import { HIV_PROGRAM, TEST_REL_PE_LAST_YEAR } from '../../data/index.js'
import { typeInput } from '../../helpers/common.js'
import { openDimension, selectEventProgram } from '../../helpers/dimensions.js'
import {
    assertChipContainsText,
    assertTooltipContainsEntries,
} from '../../helpers/layout.js'
import { clickMenubarUpdateButton } from '../../helpers/menubar.js'
import {
    selectRelativePeriod,
    getPreviousYearStr,
    selectFixedPeriod,
} from '../../helpers/period.js'
import {
    expectTableToBeVisible,
    expectTableToContainValue,
    expectTableToMatchRows,
    expectTableToNotContainValue,
} from '../../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../../support/util.js'

describe('Option set condition', () => {
    it('Option set (program attribute) displays correctly', () => {
        const dimensionName = 'Country of birth'
        const optionName = 'Sweden'

        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventProgram(HIV_PROGRAM)

        selectRelativePeriod({
            label: HIV_PROGRAM[DIMENSION_ID_EVENT_DATE],
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        openDimension(dimensionName)

        cy.getBySel('button-add-condition').should('not.exist')

        cy.contains('Add to Columns').click()

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        expectTableToNotContainValue(optionName)

        cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)

        openDimension(dimensionName)

        typeInput('option-set-left-header-filter-input-field', 'swe')

        cy.getBySel('option-set-transfer-sourceoptions')
            .contains(optionName)
            .dblclick()

        cy.getBySel('conditions-modal').contains('Update').click()

        assertChipContainsText(`${dimensionName}: 1 selected`)

        assertTooltipContainsEntries([optionName])

        expectTableToContainValue(optionName)

        expectTableToMatchRows([
            `${getPreviousYearStr()}-05-05`,
            `${getPreviousYearStr()}-08-12`,
        ])
    })

    it('Option set (data element) displays correctly', () => {
        const dimensionName = 'HIV Facility level testing'
        const filterOption = 'Family planning clinic'
        const filteredOutOption = 'Antenatal care clinic'
        const previousYear = getPreviousYearStr()

        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventProgram(HIV_PROGRAM)

        selectFixedPeriod({
            label: HIV_PROGRAM[DIMENSION_ID_EVENT_DATE],
            period: {
                year: previousYear,
                name: `January ${previousYear}`,
            },
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        openDimension(dimensionName)

        cy.getBySel('button-add-condition').should('not.exist')

        cy.contains('Add to Columns').click()

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        expectTableToContainValue(filterOption)

        expectTableToContainValue(filteredOutOption)

        cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)

        openDimension(dimensionName)

        cy.getBySel('option-set-transfer-sourceoptions')
            .contains(filterOption)
            .dblclick()

        cy.getBySel('conditions-modal').contains('Update').click()

        assertChipContainsText(`${dimensionName}: 1 selected`)

        assertTooltipContainsEntries([filterOption])

        expectTableToContainValue(filterOption)

        expectTableToNotContainValue(filteredOutOption)

        expectTableToMatchRows(['2021-01-01'])
    })
})
