import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_DIM_DATETIME,
    TEST_DIM_DATE,
    TEST_DIM_TIME,
    TEST_REL_PE_THIS_YEAR,
    TEST_FIX_PE_DEC_LAST_YEAR,
} from '../../data/index.js'
import {
    openDimension,
    selectEventWithProgram,
    selectEventWithProgramDimensions,
} from '../../helpers/dimensions.js'
import {
    assertChipContainsText,
    assertTooltipContainsEntries,
} from '../../helpers/layout.js'
import { clickMenubarUpdateButton } from '../../helpers/menubar.js'
import {
    selectRelativePeriod,
    getPreviousYearStr,
    unselectAllPeriods,
    selectFixedPeriod,
} from '../../helpers/period.js'
import { goToStartPage } from '../../helpers/startScreen.js'
import {
    expectTableToBeVisible,
    expectTableToContainHeader,
    expectTableToMatchRows,
} from '../../helpers/table.js'

const previousYear = getPreviousYearStr()

const trackerProgram = E2E_PROGRAM
const dimensionName = TEST_DIM_DATE
const periodLabel = trackerProgram[DIMENSION_ID_EVENT_DATE]
const stageName = 'Stage 1 - Repeatable'

const setUpTable = () => {
    selectEventWithProgramDimensions({
        ...trackerProgram,
        dimensions: [dimensionName],
    })

    selectFixedPeriod({
        label: periodLabel,
        period: TEST_FIX_PE_DEC_LAST_YEAR,
    })

    clickMenubarUpdateButton()

    expectTableToBeVisible()
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

/* This test doesn't look like it needs `testIsolation: false`
 * but start failing once this is removed */
describe('date conditions (Date)', { testIsolation: false }, () => {
    beforeEach(() => {
        goToStartPage()
        setUpTable()
    })

    it('exactly', () => {
        const TEST_DATE = '1991-05-21'

        addConditions([
            {
                conditionName: 'exactly',
                value: TEST_DATE,
            },
        ])

        expectTableToMatchRows([TEST_DATE])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Exactly: ${TEST_DATE}`])
    })

    it('is not', () => {
        const TEST_DATE = '1991-05-20'

        addConditions([
            {
                conditionName: 'is not',
                value: TEST_DATE,
            },
        ])

        expectTableToMatchRows(['1991-05-21', '1991-12-01', '1991-12-02'])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Is not: ${TEST_DATE}`])
    })

    it('after', () => {
        const TEST_DATE = '1991-05-21'

        addConditions([
            {
                conditionName: 'after',
                value: TEST_DATE,
            },
        ])

        expectTableToMatchRows(['1991-12-01', '1991-12-02'])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `After: ${TEST_DATE}`])
    })

    it('after or including', () => {
        const TEST_DATE = '1991-05-21'

        addConditions([
            {
                conditionName: 'after or including',
                value: TEST_DATE,
            },
        ])

        expectTableToMatchRows(['1991-05-21', '1991-12-01', '1991-12-02'])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([
            stageName,
            `After or including: ${TEST_DATE}`,
        ])
    })

    it('before', () => {
        const TEST_DATE = '1991-12-02'

        addConditions([
            {
                conditionName: 'before',
                value: TEST_DATE,
            },
        ])

        expectTableToMatchRows(['1991-05-20', '1991-05-21', '1991-12-01'])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Before: ${TEST_DATE}`])
    })

    it('before or including', () => {
        const TEST_DATE = '1991-05-21'

        addConditions([
            {
                conditionName: 'before or including',
                value: TEST_DATE,
            },
        ])

        expectTableToMatchRows(['1991-05-20', '1991-05-21'])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([
            stageName,
            `Before or including: ${TEST_DATE}`,
        ])
    })

    it('is empty / null', () => {
        unselectAllPeriods({ label: periodLabel })

        selectFixedPeriod({
            label: periodLabel,
            period: {
                type: 'Yearly',
                year: previousYear,
                name: previousYear,
            },
        })

        addConditions([
            {
                conditionName: 'is empty / null',
            },
        ])

        expectTableToMatchRows([`${previousYear}-01-02`])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Is empty / null`])
    })

    it('is not empty / not null', () => {
        unselectAllPeriods({ label: periodLabel })

        selectFixedPeriod({
            label: periodLabel,
            period: {
                type: 'Yearly',
                year: previousYear,
                name: previousYear,
            },
        })

        addConditions([
            {
                conditionName: 'is not empty / not null',
            },
        ])

        expectTableToMatchRows([
            '1990-07-17',
            '1990-11-12',
            '1991-12-01',
            '1991-12-02',
            '1991-05-20',
            '1991-05-21',
        ])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Is not empty / not null`])
    })

    it('2 conditions: after + before or including', () => {
        const TEST_DATE_AFT = '1991-05-20'
        const TEST_DATE_BFI = '1991-12-01'

        addConditions([
            {
                conditionName: 'after',
                value: TEST_DATE_AFT,
            },
            {
                conditionName: 'before or including',
                value: TEST_DATE_BFI,
            },
        ])

        expectTableToMatchRows(['1991-05-21', '1991-12-01'])

        assertChipContainsText(`${dimensionName}: 2 conditions`)

        assertTooltipContainsEntries([
            stageName,
            `After: ${TEST_DATE_AFT}`,
            `Before or including: ${TEST_DATE_BFI}`,
        ])
    })
})

/* This test doesn't look like it needs `testIsolation: false`
 * but start failing once this is removed */
describe('date types', { testIsolation: false }, () => {
    const TEST_OPERATORS = [
        'exactly',
        'is not',
        'after',
        'after or including',
        'before',
        'before or including',
        'is empty / null',
        'is not empty / not null',
    ]

    const TEST_TYPES = [TEST_DIM_DATE, TEST_DIM_TIME, TEST_DIM_DATETIME]

    TEST_TYPES.forEach((type) => {
        it(`${type} has all operators`, () => {
            goToStartPage()

            selectEventWithProgram(E2E_PROGRAM)
            openDimension(type)

            cy.getBySel('button-add-condition').click()
            cy.contains('Choose a condition type').click()

            TEST_OPERATORS.forEach((operator) => {
                cy.getBySel('date-condition-type').containsExact(operator)
            })
            cy.getBySel('date-condition-type').closePopper()
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
