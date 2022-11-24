import { DIMENSION_ID_ENROLLMENT_DATE } from '../../src/modules/dimensionConstants.js'
import { E2E_PROGRAM, TEST_REL_PE_LAST_YEAR } from '../data/index.js'
import {
    openDimension,
    selectEnrollmentProgram,
    selectEnrollmentProgramDimensions,
    selectEventWithProgram,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod } from '../helpers/period.js'
import {
    getTableHeaderCells,
    expectTableToBeVisible,
    getTableDataCells,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const getRepeatedEventsTab = () =>
    cy.getBySel('conditions-modal-content').contains('Repeated events')

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
    getRepeatedEventsTab().click()
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
    getRepeatedEventsTab().click()
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

const expectHeaderToContainExact = (index, value) =>
    getTableHeaderCells().eq(index).containsExact(value)

describe('repeated events', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
    })
    it('can use repetition for an enrollment program', () => {
        const dimensionName = 'E2E - Percentage'
        setUpTable({ enrollment: E2E_PROGRAM, dimensionName })

        // initially only has 1 column and 1 row
        getTableHeaderCells().its('length').should('equal', 1)
        getTableHeaderCells().eq(0).containsExact('E2E - Percentage')
        getTableDataCells().eq(0).invoke('text').should('eq', '46')
        expectRepetitionToBe({ dimensionName, recent: 1, oldest: 0 })

        // repetition 3/0 can be set successfully
        setRepetition({ dimensionName, recent: 2, oldest: 0 })
        let result = ['45', '46']
        result.forEach((value, index) => {
            getTableDataCells().eq(index).invoke('text').should('eq', value)
        })
        expectHeaderToContainExact(
            0,
            'E2E - Percentage - Stage 1 - Repeatable (most recent -1)'
        )
        expectHeaderToContainExact(
            1,
            'E2E - Percentage - Stage 1 - Repeatable (most recent)'
        )

        // repetition 0/3 can be set successfully
        setRepetition({ dimensionName, recent: 0, oldest: 2 })
        result = ['45', '46']
        result.forEach((value, index) => {
            getTableDataCells().eq(index).contains(value)
        })
        expectHeaderToContainExact(
            0,
            'E2E - Percentage - Stage 1 - Repeatable (oldest)'
        )
        expectHeaderToContainExact(
            1,
            'E2E - Percentage - Stage 1 - Repeatable (oldest +1)'
        )

        // repetition 3/3 can be set successfully
        setRepetition({ dimensionName, recent: 2, oldest: 2 })
        result = ['45', '46', '45', '46']
        result.forEach((value, index) => {
            getTableDataCells().eq(index).invoke('text').should('eq', value)
        })
        expectHeaderToContainExact(
            0,
            'E2E - Percentage - Stage 1 - Repeatable (oldest)'
        )
        expectHeaderToContainExact(
            1,
            'E2E - Percentage - Stage 1 - Repeatable (oldest +1)'
        )
        expectHeaderToContainExact(
            4,
            'E2E - Percentage - Stage 1 - Repeatable (most recent -1)'
        )
        expectHeaderToContainExact(
            5,
            'E2E - Percentage - Stage 1 - Repeatable (most recent)'
        )
    })
    it(['>=39'], 'repetition out of bounds returns as empty value', () => {
        const dimensionName = 'E2E - Percentage'
        setUpTable({ enrollment: E2E_PROGRAM, dimensionName })

        // repetition 6/0 can be set successfully
        setRepetition({ dimensionName, recent: 6, oldest: 0 })
        const result = ['', '', '', '', '45', '46']
        result.forEach((value, index) => {
            getTableDataCells().eq(index).invoke('text').should('eq', value)
        })
        expectHeaderToContainExact(
            0,
            'E2E - Percentage - Stage 1 - Repeatable (most recent -5)'
        )
        expectHeaderToContainExact(
            2,
            'E2E - Percentage - Stage 1 - Repeatable (most recent -3)'
        )
        expectHeaderToContainExact(
            5,
            'E2E - Percentage - Stage 1 - Repeatable (most recent)'
        )
    })
    it(['>37', '<39'], 'repetition out of bounds returns as 0', () => {
        const dimensionName = 'E2E - Percentage'
        setUpTable({ enrollment: E2E_PROGRAM, dimensionName })

        // repetition 6/0 can be set successfully
        setRepetition({ dimensionName, recent: 6, oldest: 0 })
        const result = ['0', '0', '0', '0', '45', '46']
        result.forEach((value, index) => {
            getTableDataCells().eq(index).invoke('text').should('eq', value)
        })
        expectHeaderToContainExact(
            0,
            'E2E - Percentage - Stage 1 - Repeatable (most recent -5)'
        )
        expectHeaderToContainExact(
            2,
            'E2E - Percentage - Stage 1 - Repeatable (most recent -3)'
        )
        expectHeaderToContainExact(
            5,
            'E2E - Percentage - Stage 1 - Repeatable (most recent)'
        )
    })
    it('repetition is disabled for non repetable stages', () => {
        selectEnrollmentProgram({ programName: 'Child Programme' })

        openDimension('MCH Apgar Score')

        getRepeatedEventsTab()
            .should('have.class', 'disabled')
            .trigger('mouseover')

        cy.getBySelLike('repeatable-events-tooltip-content').contains(
            'Only available for repeatable stages'
        )
    })
    it('repetition is hidden when input = event', () => {
        selectEventWithProgram(E2E_PROGRAM)

        openDimension('E2E - Percentage')

        getRepeatedEventsTab().should('not.exist')
    })
})
