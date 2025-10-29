import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import { E2E_PROGRAM } from '../data/index.js'
import { clearInput, typeInput } from '../helpers/common.js'
import {
    openProgramDimensionsSidebar,
    selectEventWithProgram,
} from '../helpers/dimensions.js'
import {
    assertChipContainsText,
    assertTooltipContainsEntries,
} from '../helpers/layout.js'
import { getCurrentYearStr, getPreviousYearStr } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'

/* This files constains sequential tests, which means that some test steps
 * depend on a previous step. With test isolation switched on (the default setting)
 * each step (`it` block) will start off in a fresh window, and that breaks this kind
 * of test. So `testIsolation` was set to false here. */
describe('period dimension', { testIsolation: false }, () => {
    const currentYear = getCurrentYearStr()
    const previousYear = getPreviousYearStr()

    const event = E2E_PROGRAM
    const TEST_DIM_ID = DIMENSION_ID_EVENT_DATE
    const TEST_DIM_NAME = event[TEST_DIM_ID]
    const TEST_RELATIVE_PERIOD_NAME = 'Last 3 months'
    const TEST_FIXED_PERIOD_NAME = `January ${currentYear}`

    const openModal = (id) =>
        cy
            .getBySel('program-dimensions')
            .findBySel(`dimension-item-${id}`)
            .click()

    it('opens modal', () => {
        goToStartPage()

        selectEventWithProgram(event)

        openProgramDimensionsSidebar()

        openModal(TEST_DIM_ID)

        cy.getBySel('period-dimension-modal').should('be.visible')
    })
    it('modal has title', () => {
        cy.getBySel('period-dimension-modal-title').should(
            'contain',
            TEST_DIM_NAME
        )
    })
    it('default selection is selected', () => {
        cy.contains('Choose from presets').should('have.class', 'selected')

        cy.getBySel('period-dimension-relative-periods-button').should(
            'have.class',
            'selected'
        )

        cy.getBySelLike('period-dimension-relative-period-filter').should(
            'contain',
            'Months'
        )
    })
    it('a relative period can be added', () => {
        cy.getBySelLike('period-dimension-transfer-sourceoptions')
            .contains(TEST_RELATIVE_PERIOD_NAME)
            .dblclick()

        cy.getBySelLike('period-dimension-transfer-pickedoptions').should(
            'contain',
            TEST_RELATIVE_PERIOD_NAME
        )
    })
    it('a fixed period can be added', () => {
        cy.getBySel('period-dimension-fixed-periods-button')
            .click()
            .should('have.class', 'selected')

        cy.getBySelLike(
            'period-dimension-fixed-period-filter-period-type-content'
        ).should('contain', 'Monthly')

        cy.getBySelLike('period-dimension-transfer-sourceoptions')
            .contains(TEST_FIXED_PERIOD_NAME)
            .dblclick()

        cy.getBySelLike('period-dimension-transfer-pickedoptions').should(
            'contain',
            TEST_FIXED_PERIOD_NAME
        )
    })
    it('a custom period can be selected', () => {
        cy.contains('Define start - end dates')
            .click()
            .should('have.class', 'selected')

        typeInput('start-date-input', `${previousYear}-01-01`)
        typeInput('end-date-input', `${currentYear}-12-31`)

        cy.contains('Add to Columns').click()

        assertChipContainsText(TEST_DIM_NAME, 1)

        assertTooltipContainsEntries(TEST_DIM_NAME, [
            `January 1, ${previousYear} - December 31, ${currentYear}`,
        ])
    })
    it('the custom period persists when reopening the modal', () => {
        openModal(TEST_DIM_ID)
        cy.getBySel('start-date-input')
            .find('input')
            .invoke('val')
            .should('eq', `${previousYear}-01-01`)
        cy.getBySel('end-date-input')
            .find('input')
            .invoke('val')
            .should('eq', `${currentYear}-12-31`)
    })
    it('the custom period is cleared when one date is removed', () => {
        clearInput('start-date-input')
        cy.getBySel('period-dimension-modal-action-confirm')
            .contains('Update')
            .click()

        assertChipContainsText(TEST_DIM_NAME)

        assertTooltipContainsEntries(TEST_DIM_NAME, ['None selected'])

        openModal(TEST_DIM_ID)

        cy.contains('Choose from presets').should('have.class', 'selected')
    })
    it('the custom period is cleared when the preset date tab is toggled', () => {
        cy.contains('Define start - end dates').click()

        typeInput('start-date-input', `${previousYear}-01-01`)
        typeInput('end-date-input', `${currentYear}-12-31`)

        cy.getBySel('period-dimension-modal-action-confirm')
            .contains('Update')
            .click()

        assertChipContainsText(TEST_DIM_NAME, 1)

        assertTooltipContainsEntries(TEST_DIM_NAME, [
            `January 1, ${previousYear} - December 31, ${currentYear}`,
        ])

        openModal(TEST_DIM_ID)

        cy.contains('Choose from presets').click()

        cy.getBySel('period-dimension-modal-action-confirm')
            .contains('Update')
            .click()

        assertChipContainsText(TEST_DIM_NAME)

        assertTooltipContainsEntries(TEST_DIM_NAME, ['None selected'])
    })
})
