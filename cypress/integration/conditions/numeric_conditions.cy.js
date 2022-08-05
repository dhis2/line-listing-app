import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import {
    ANALYTICS_PROGRAM,
    TEST_DIM_NUMBER,
    TEST_REL_PE_THIS_YEAR,
} from '../../data/index.js'
import { selectEventProgramDimensions } from '../../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../../helpers/menubar.js'
import { selectRelativePeriod } from '../../helpers/period.js'
import {
    expectTableToBeVisible,
    expectTableToMatchRows,
    getTableDataCells,
    getTableRows,
} from '../../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../../support/util.js'

const event = ANALYTICS_PROGRAM
const dimensionName = TEST_DIM_NUMBER
const periodLabel = event[DIMENSION_ID_EVENT_DATE]
const stageName = 'Stage 1 - Repeatable'

const setUpTable = () => {
    selectEventProgramDimensions({ ...event, dimensions: [dimensionName] })

    selectRelativePeriod({
        label: periodLabel,
        period: TEST_REL_PE_THIS_YEAR,
    })

    clickMenubarUpdateButton()

    expectTableToBeVisible()

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
        expectTableToMatchRows(['12'])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, 'Equal to (=): 12'])
    })

    it('greater than', () => {
        addConditions([{ conditionName: 'greater than (>)', value: '12' }])

        expectTableToMatchRows(['2 000 000'])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, 'Greater than (>): 12'])
    })

    it('greater than or equal to', () => {
        addConditions([
            { conditionName: 'greater than or equal to', value: '12' },
        ])
        expectTableToMatchRows(['12', '2 000 000'])

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
        expectTableToMatchRows(['11'])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, 'Less than (<): 12'])
    })

    it('less than or equal to', () => {
        addConditions([{ conditionName: 'less than or equal to', value: '12' }])
        expectTableToMatchRows(['11', '12'])

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

        expectTableToMatchRows(['11', '2 000 000'])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, 'Not equal to (≠): 12'])
    })

    it('is empty / null', () => {
        addConditions([{ conditionName: 'is empty / null' }])

        getTableRows().should('have.length', 2)

        getTableDataCells()
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

        expectTableToMatchRows(['11', '12', '2 000 000'])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, 'Is not empty / not null'])
    })

    it('2 conditions: greater than + less than', () => {
        addConditions([
            { conditionName: 'greater than (>)', value: '11' },
            { conditionName: 'less than (<)', value: '13' },
        ])

        expectTableToMatchRows(['12'])

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
