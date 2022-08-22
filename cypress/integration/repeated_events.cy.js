import { DIMENSION_ID_ENROLLMENT_DATE } from '../../src/modules/dimensionConstants.js'
import { ANALYTICS_PROGRAM, TEST_REL_PE_LAST_YEAR } from '../data/index.js'
import {
    openDimension,
    selectEnrollmentProgram,
    selectEnrollmentProgramDimensions,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod } from '../helpers/period.js'
import {
    getTableHeaderCells,
    expectTableToBeVisible,
    getTableDataCells,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const setUpTable = ({ enrollment, dimensionName }) => {
    selectEnrollmentProgramDimensions({
        ...enrollment,
        dimensions: [dimensionName],
    })

    selectRelativePeriod({
        label: enrollment[DIMENSION_ID_ENROLLMENT_DATE],
        period: TEST_REL_PE_LAST_YEAR,
    })

    cy.getBySel('columns-axis')
        .findBySel('dimension-menu-button-enrollmentDate')
        .click()
    cy.contains('Move to Filter').click()

    cy.getBySel('columns-axis').findBySel('dimension-menu-button-ou').click()
    cy.contains('Move to Filter').click()

    clickMenubarUpdateButton()

    expectTableToBeVisible()

    cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)
}

const setRepetition = ({ dimensionName, recent, oldest }) => {
    cy.getBySelLike('layout-chip').contains(dimensionName).click()
    cy.getBySel('conditions-modal-content').contains('Repeated events').click()
    cy.getBySel('most-recent-input')
        .find('input')
        .type('{backspace}')
        .type('{moveToEnd}')
        .type(recent)
    cy.getBySel('oldest-input')
        .find('input')
        .type('{backspace}')
        .type('{moveToEnd}')
        .type(oldest)
    cy.getBySel('conditions-modal').contains('Update').click()
}

const expectRepetitionToBe = ({ dimensionName, recent, oldest }) => {
    cy.getBySelLike('layout-chip').contains(dimensionName).click()
    cy.getBySel('conditions-modal-content').contains('Repeated events').click()
    cy.getBySel('most-recent-input')
        .find('input')
        .should('be.visible')
        .and('have.value', recent)
    cy.getBySel('oldest-input')
        .find('input')
        .should('be.visible')
        .and('have.value', oldest)
    cy.getBySel('conditions-modal').contains('Hide').click()
}

describe('repeated events', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
    })
    it('can use repetition for an enrollment program', () => {
        const dimensionName = 'Analytics - Percentage'
        setUpTable({ enrollment: ANALYTICS_PROGRAM, dimensionName })

        // initially only has 1 column and 1 row
        getTableHeaderCells().its('length').should('equal', 1)
        getTableHeaderCells().eq(0).containsExact('Analytics - Percentage')
        getTableDataCells().eq(0).contains('5')
        expectRepetitionToBe({ dimensionName, recent: 1, oldest: 0 })

        // repetition 3/0 can be set successfully
        setRepetition({ dimensionName, recent: 3, oldest: 0 })
        let result = ['11', '0', '5']
        result.forEach((value, index) => {
            getTableDataCells().eq(index).contains(value)
        })
        getTableHeaderCells()
            .eq(0)
            .containsExact(
                'Analytics - Percentage - Stage 1 - Repeatable (most recent -2)'
            )
        getTableHeaderCells()
            .eq(1)
            .containsExact(
                'Analytics - Percentage - Stage 1 - Repeatable (most recent -1)'
            )
        getTableHeaderCells()
            .eq(2)
            .containsExact(
                'Analytics - Percentage - Stage 1 - Repeatable (most recent)'
            )

        // repetition 0/3 can be set successfully
        setRepetition({ dimensionName, recent: 0, oldest: 3 })
        result = ['56', '0', '100']
        result.forEach((value, index) => {
            getTableDataCells().eq(index).contains(value)
        })
        getTableHeaderCells()
            .eq(0)
            .containsExact(
                'Analytics - Percentage - Stage 1 - Repeatable (oldest)'
            )
        getTableHeaderCells()
            .eq(1)
            .containsExact(
                'Analytics - Percentage - Stage 1 - Repeatable (oldest +1)'
            )
        getTableHeaderCells()
            .eq(2)
            .containsExact(
                'Analytics - Percentage - Stage 1 - Repeatable (oldest +2)'
            )

        // repetition 3/3 can be set successfully
        setRepetition({ dimensionName, recent: 3, oldest: 3 })
        result = ['56', '0', '100', '11', '0', '5']
        result.forEach((value, index) => {
            getTableDataCells().eq(index).contains(value)
        })
        getTableHeaderCells()
            .eq(0)
            .containsExact(
                'Analytics - Percentage - Stage 1 - Repeatable (oldest)'
            )
        getTableHeaderCells()
            .eq(1)
            .containsExact(
                'Analytics - Percentage - Stage 1 - Repeatable (oldest +1)'
            )
        getTableHeaderCells()
            .eq(2)
            .containsExact(
                'Analytics - Percentage - Stage 1 - Repeatable (oldest +2)'
            )
        getTableHeaderCells()
            .eq(3)
            .containsExact(
                'Analytics - Percentage - Stage 1 - Repeatable (most recent -2)'
            )
        getTableHeaderCells()
            .eq(4)
            .containsExact(
                'Analytics - Percentage - Stage 1 - Repeatable (most recent -1)'
            )
        getTableHeaderCells()
            .eq(5)
            .containsExact(
                'Analytics - Percentage - Stage 1 - Repeatable (most recent)'
            )
    })
    it.skip('repetition out of bounds returns as a empty value', () => {
        // FIXME: Backend issue, the repetition out of bounds is returned as 0 when it should be an empty string
        const dimensionName = 'Analytics - Percentage'
        setUpTable({ enrollment: ANALYTICS_PROGRAM, dimensionName })

        // repetition 10/0 can be set successfully
        setRepetition({ dimensionName, recent: 10, oldest: 0 })
        const result = ['', '56', '0', '100', '50', '35', '10', '11', '0', '5']
        result.forEach((value, index) => {
            getTableDataCells().eq(index).invoke('text').should('eq', value)
        })
        getTableHeaderCells()
            .eq(0)
            .containsExact(
                'Analytics - Percentage - Stage 1 - Repeatable (most recent -9)'
            )
        getTableHeaderCells()
            .eq(5)
            .containsExact(
                'Analytics - Percentage - Stage 1 - Repeatable (most recent -4)'
            )
        getTableHeaderCells()
            .eq(9)
            .containsExact(
                'Analytics - Percentage - Stage 1 - Repeatable (most recent)'
            )
    })
    it('repetition is disabled for non repetable stages', () => {
        selectEnrollmentProgram({ programName: 'MAL-CS' })

        openDimension('Bednet distributed')

        cy.getBySel('conditions-modal-content')
            .contains('Repeated events')
            .should('have.class', 'disabled')
            .trigger('mouseover')

        cy.getBySelLike('repeatable-events-tooltip-content').contains(
            'Only available for repeatable stages'
        )
    })
    // TODO: Test "Analytics - Percentage" with Event - no repetiton tab is shown
})
