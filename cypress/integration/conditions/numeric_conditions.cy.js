import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import {
    ANALYTICS_PROGRAM,
    TEST_DIM_NUMBER,
    TEST_DIM_UNIT_INTERVAL,
    TEST_DIM_PERCENTAGE,
    TEST_DIM_INTEGER,
    TEST_DIM_POSITIVE_INTEGER,
    TEST_DIM_NEGATIVE_INTEGER,
    TEST_DIM_POSITIVE_OR_ZERO,
    TEST_REL_PE_THIS_YEAR,
} from '../../data/index.js'
import {
    openDimension,
    selectEventProgram,
    selectEventProgramDimensions,
} from '../../helpers/dimensions.js'
import {
    assertChipContainsText,
    assertTooltipContainsEntries,
} from '../../helpers/layout.js'
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
        cy.getBySel('button-add-condition').click()
        cy.contains('Choose a condition').click()
        cy.contains(conditionName).click()
        if (value) {
            cy.getBySel('conditions-modal-content')
                .find('input[value=""]')
                .type(value)
        }
    })
    cy.getBySel('conditions-modal').contains('Update').click()
}

describe('number conditions', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
    })
    it('equal to', () => {
        addConditions([{ conditionName: 'equal to (=)', value: '12' }])

        expectTableToMatchRows(['12'])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, 'Equal to (=): 12'])
    })

    it('greater than', () => {
        addConditions([{ conditionName: 'greater than (>)', value: '12' }])

        expectTableToMatchRows(['2 000 000', '5 557 779 990'])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, 'Greater than (>): 12'])
    })

    it('greater than or equal to', () => {
        addConditions([
            { conditionName: 'greater than or equal to', value: '12' },
        ])
        expectTableToMatchRows(['12', '2 000 000', '5 557 779 990'])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([
            stageName,
            'Greater than or equal to (≥): 12',
        ])
    })

    it('less than', () => {
        addConditions([{ conditionName: 'less than (<)', value: '12' }])

        expectTableToMatchRows(['11', '3.7'])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, 'Less than (<): 12'])
    })

    it('less than or equal to', () => {
        addConditions([{ conditionName: 'less than or equal to', value: '12' }])

        expectTableToMatchRows(['11', '12', '3.7'])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([
            stageName,
            'Less than or equal to (≤): 12',
        ])
    })

    it('not equal to', () => {
        addConditions([{ conditionName: 'not equal to', value: '12' }])

        expectTableToMatchRows(['11', '2 000 000', '5 557 779 990', '3.7'])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, 'Not equal to (≠): 12'])
    })

    it('is empty / null', () => {
        addConditions([{ conditionName: 'is empty / null' }])

        getTableRows().should('have.length', 1)

        getTableDataCells()
            .eq(1)
            .invoke('text')
            .invoke('trim')
            .should('equal', '')

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, 'Is empty / null'])
    })

    it('is not empty / not null', () => {
        addConditions([{ conditionName: 'is not empty / not null' }])

        expectTableToMatchRows([
            '11',
            '12',
            '2 000 000',
            '5 557 779 990',
            '3.7',
        ])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, 'Is not empty / not null'])
    })

    it('2 conditions: greater than + less than', () => {
        addConditions([
            { conditionName: 'greater than (>)', value: '11' },
            { conditionName: 'less than (<)', value: '13' },
        ])

        expectTableToMatchRows(['12'])

        assertChipContainsText(`${dimensionName}: 2 conditions`)

        assertTooltipContainsEntries([
            stageName,
            'Greater than (>): 11',
            'Less than (<): 13',
        ])
    })
})

describe('numeric types', () => {
    const TEST_OPERATORS = [
        'equal to (=)',
        'greater than (>)',
        'greater than or equal to (≥)',
        'less than (<)',
        'less than or equal to (≤)',
        'not equal to (≠)',
        'is empty / null',
        'is not empty / not null',
        'is one of preset options',
    ]

    const TEST_TYPES = [
        TEST_DIM_NUMBER,
        TEST_DIM_UNIT_INTERVAL,
        TEST_DIM_PERCENTAGE,
        TEST_DIM_INTEGER,
        TEST_DIM_POSITIVE_INTEGER,
        TEST_DIM_NEGATIVE_INTEGER,
        TEST_DIM_POSITIVE_OR_ZERO,
    ]

    TEST_TYPES.forEach((type) => {
        it(`${type} has all operators`, () => {
            cy.visit('/', EXTENDED_TIMEOUT)

            selectEventProgram(ANALYTICS_PROGRAM)
            openDimension(type)

            cy.getBySel('button-add-condition').click()
            cy.contains('Choose a condition').click()

            TEST_OPERATORS.forEach((operator) => {
                cy.getBySel('numeric-condition-type').containsExact(operator)
            })
        })
    })
})

// TODO: Test legend sets / "is one of preset options"
