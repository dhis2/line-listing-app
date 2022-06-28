import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import { TEST_EVENT_DATA, TEST_RELATIVE_PERIODS } from '../../data/index.js'
import { selectEventProgramDimensions } from '../../helpers/dimensions.js'
import { selectRelativePeriod } from '../../helpers/period.js'
import { getLineListTable } from '../../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../../support/util.js'

const event = TEST_EVENT_DATA[2]
const dimensionName = event.dimensions[0]
const periodLabel = event[DIMENSION_ID_EVENT_DATE]
const stageName = 'Stage 1 - Repeatable'

const setUpTable = () => {
    selectEventProgramDimensions(event)

    selectRelativePeriod({
        label: periodLabel,
        period: TEST_RELATIVE_PERIODS[0],
    })

    cy.getWithDataTest('{menubar}').contains('Update').click()

    getLineListTable().find('tbody').should('be.visible')
}

const addConditions = (conditions) => {
    cy.getBySelLike('layout-chip').contains(dimensionName).click()
    conditions.forEach((conditionName) => {
        cy.getWithDataTest('{conditions-modal-content}')
            .findWithDataTest('{dhis2-uicore-checkbox}')
            .contains(conditionName)
            .click()
    })
    cy.getWithDataTest('{conditions-modal}').contains('Update').click()
}

const assertTableMatchesExpectedRows = (expectedRows) => {
    getLineListTable()
        .find('tbody > tr')
        .should('have.length', expectedRows.length)

    expectedRows.forEach((val) => {
        getLineListTable().find('tbody').contains('td', val)
    })
}

const assertTooltipContainsEntries = (entries) => {
    entries.forEach((entry) =>
        cy.getWithDataTest('{tooltip-content}').contains(entry)
    )
}

describe('boolean conditions', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
    })

    it('Yes selected', () => {
        addConditions(['Yes'])

        assertTableMatchesExpectedRows(['2022-01-01'])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, /\bYes\b/])
    })

    it('No selected', () => {
        addConditions(['No'])

        assertTableMatchesExpectedRows(['2022-01-03'])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, /\bNo\b/])
    })

    it('Yes and Not answered selected', () => {
        addConditions(['Yes', 'Not answered'])

        assertTableMatchesExpectedRows([
            '2022-01-01',
            '2022-03-01',
            '2022-01-01',
            '2022-02-01',
        ])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 2 conditions`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, /\bYes\b/, /\bNot answered\b/])
    })
})
