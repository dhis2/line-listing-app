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
    TEST_REL_PE_LAST_YEAR,
    TEST_DIM_WITH_PRESET,
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
import {
    getPreviousYearStr,
    selectRelativePeriod,
} from '../../helpers/period.js'
import {
    expectTableToBeVisible,
    expectTableToContainHeader,
    expectTableToMatchRows,
    getTableDataCells,
    getTableRows,
} from '../../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../../support/util.js'

const previousYear = getPreviousYearStr()

const event = ANALYTICS_PROGRAM
const periodLabel = event[DIMENSION_ID_EVENT_DATE]
const stageName = 'Stage 1 - Repeatable'

describe('number conditions', () => {
    const dimensionName = TEST_DIM_NUMBER

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
            cy.contains('Choose a condition type').click()
            cy.contains(conditionName).click()
            if (value) {
                cy.getBySel('conditions-modal-content')
                    .find('input[value=""]')
                    .type(value)
            }
        })
        cy.getBySel('conditions-modal').contains('Update').click()
    }

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

describe('preset options', () => {
    const dimensionName = TEST_DIM_WITH_PRESET
    const TEST_PRESET = 'Age (COVID-19)'

    const addPreset = (preset, value) => {
        cy.getBySelLike('layout-chip').contains(dimensionName).click()
        cy.getBySel('button-add-condition').click()
        cy.contains('Choose a condition type').click()
        cy.contains('is one of preset options').click()
        cy.contains('Choose a set of options').click()
        cy.contains(preset).click()

        if (value) {
            cy.contains('Choose options').click()
            cy.contains(value)
                .click()
                .closest('[data-test=dhis2-uicore-layer]')
                .click('topLeft')
        }

        cy.getBySel('button-add-condition')
            .contains('Add another condition')
            .should('have.css', 'pointer-events', 'none')

        cy.getBySel('conditions-modal').contains('Update').click()
    }

    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventProgram(ANALYTICS_PROGRAM)
        openDimension(dimensionName)
        cy.contains('Add to Columns').click()

        selectRelativePeriod({
            label: periodLabel,
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        cy.getBySelLike('layout-chip').contains(`${dimensionName}: all`)
    })

    it('set only', () => {
        addPreset(TEST_PRESET)

        expectTableToMatchRows([
            `${previousYear}-11-01`,
            `${previousYear}-12-11`,
            `${previousYear}-12-10`,
            `${previousYear}-11-15`,
        ])

        expectTableToMatchRows(['5 - 14', '5 - 14', '35 - 44', '35 - 44'])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, TEST_PRESET])
    })

    it('set and value', () => {
        const TEST_VALUE = '5 - 14'

        addPreset(TEST_PRESET, TEST_VALUE)

        expectTableToMatchRows([
            `${previousYear}-12-11`,
            `${previousYear}-12-10`,
        ])

        expectTableToMatchRows([TEST_VALUE, TEST_VALUE])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, TEST_VALUE])
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
            cy.contains('Choose a condition type').click()

            TEST_OPERATORS.forEach((operator) => {
                cy.getBySel('numeric-condition-type').containsExact(operator)
            })
            cy.getBySel('numeric-condition-type')
                .closest('[data-test=dhis2-uicore-layer]')
                .click('topLeft')
            cy.contains('Add to Columns').click()
        })

        it(`${type} can be used in a visualization`, () => {
            selectRelativePeriod({
                label: periodLabel,
                period: TEST_REL_PE_THIS_YEAR,
            })

            clickMenubarUpdateButton()

            expectTableToBeVisible()

            expectTableToContainHeader(type)
        })
    })
})
