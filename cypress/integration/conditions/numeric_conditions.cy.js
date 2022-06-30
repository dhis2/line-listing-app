import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import { TEST_EVENT_DATA, TEST_RELATIVE_PERIODS } from '../../data/index.js'
import { selectEventProgramDimensions } from '../../helpers/dimensions.js'
import { selectRelativePeriod } from '../../helpers/period.js'
import { getLineListTable } from '../../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../../support/util.js'

const event = TEST_EVENT_DATA[1]
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

    cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)
}

const addConditions = (conditions) => {
    cy.getBySelLike('layout-chip').contains(dimensionName).click()
    conditions.forEach(({ conditionName, value }) => {
        cy.getWithDataTest('{button-add-condition}').click()
        cy.contains('Choose a condition').click()
        cy.contains(conditionName).click()
        if (value) {
            cy.getWithDataTest('{conditions-modal-content}')
                .find('input[value=""]')
                .type(value)
        }
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

describe('number conditions', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
    })
    it('equal to', () => {
        addConditions([{ conditionName: 'equal to (=)', value: '12' }])
        assertTableMatchesExpectedRows(['12'])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, 'Equal to (=): 12'])
    })

    it('greater than', () => {
        addConditions([{ conditionName: 'greater than (>)', value: '12' }])

        assertTableMatchesExpectedRows(['2 000 000'])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, 'Greater than (>): 12'])
    })

    it('greater than or equal to', () => {
        addConditions([
            { conditionName: 'greater than or equal to', value: '12' },
        ])
        assertTableMatchesExpectedRows(['12', '2 000 000'])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([
            stageName,
            'Greater than or equal to (≥): 12',
        ])
    })

    it('less than', () => {
        addConditions([{ conditionName: 'less than (<)', value: '12' }])
        assertTableMatchesExpectedRows(['11'])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, 'Less than (<): 12'])
    })

    it('less than or equal to', () => {
        addConditions([{ conditionName: 'less than or equal to', value: '12' }])
        assertTableMatchesExpectedRows(['11', '12'])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([
            stageName,
            'Less than or equal to (≤): 12',
        ])
    })

    it('not equal to', () => {
        addConditions([{ conditionName: 'not equal to', value: '12' }])

        assertTableMatchesExpectedRows(['11', '2 000 000'])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, 'Not equal to (≠): 12'])
    })

    it('is empty / null', () => {
        addConditions([{ conditionName: 'is empty / null' }])

        getLineListTable().find('tbody > tr').should('have.length', 2)

        getLineListTable()
            .find('tbody td')
            .eq(1)
            .invoke('text')
            .invoke('trim')
            .should('equal', '')

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, 'Is empty / null'])
    })

    it('is not empty / not null', () => {
        addConditions([{ conditionName: 'is not empty / not null' }])

        assertTableMatchesExpectedRows(['11', '12', '2 000 000'])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, 'Is not empty / not null'])
    })

    it('2 conditions: greater than and less than', () => {
        addConditions([
            { conditionName: 'greater than (>)', value: '11' },
            { conditionName: 'less than (<)', value: '13' },
        ])

        assertTableMatchesExpectedRows(['12'])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 2 conditions`)
            .trigger('mouseover')

        assertTooltipContainsEntries([
            stageName,
            'Greater than (>): 11',
            'Less than (<): 13',
        ])
    })
})
