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
} from '../../helpers/period.js'
import {
    expectTableToBeVisible,
    expectTableToContainValue,
    expectTableToMatchRows,
    expectTableToNotContainValue,
} from '../../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../../support/util.js'

const setUpTable = (event) => {
    selectEventProgram(event)

    selectRelativePeriod({
        label: event[DIMENSION_ID_EVENT_DATE],
        period: TEST_REL_PE_LAST_YEAR,
    })

    clickMenubarUpdateButton()

    expectTableToBeVisible()
}

describe('Option set condition', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable(HIV_PROGRAM)
    })

    it('Option set (program attribute) displays correctly', () => {
        const dimensionName = 'Country of birth'
        const optionName = 'Sweden'

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

    it.skip('Option set (data element) displays correctly', () => {
        // FIXME: Fails because of https://jira.dhis2.org/browse/DHIS2-13573
        // The test below is still WIP and untested, as the bug causes the app to crash, so this can only be continued once the bug is fixed
        const dimensionName = 'HIV Facility level testing'
        const optionName = 'Family planning clinic'

        openDimension(dimensionName)

        cy.getBySel('button-add-condition').should('not.exist')

        cy.contains('Add to Columns').click()

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        expectTableToNotContainValue(optionName)

        cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)

        openDimension(dimensionName)

        cy.getBySel('option-set-transfer-sourceoptions')
            .contains(optionName)
            .dblclick()

        cy.getBySel('conditions-modal').contains('Update').click()

        assertChipContainsText(`${dimensionName}: 1 selected`)

        assertTooltipContainsEntries([optionName])

        expectTableToContainValue(optionName)

        expectTableToMatchRows([
            // TODO: To be filled in once the bug above is solved
        ])
    })
})
