import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import {
    ANALYTICS_PROGRAM,
    TEST_DIM_DATETIME,
    TEST_DIM_DATE,
    TEST_DIM_TIME,
    TEST_REL_PE_LAST_12_MONTHS,
} from '../../data/index.js'
import {
    openDimension,
    selectEventProgram,
    selectEventProgramDimensions,
} from '../../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../../helpers/menubar.js'
import {
    selectRelativePeriod,
    getPreviousYearStr,
    getCurrentYearStr,
} from '../../helpers/period.js'
import {
    expectTableToBeVisible,
    expectTableToMatchRows,
} from '../../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../../support/util.js'

const event = ANALYTICS_PROGRAM
const dimensionName = TEST_DIM_DATE
const periodLabel = event[DIMENSION_ID_EVENT_DATE]
const stageName = 'Stage 1 - Repeatable'
const currentYear = getCurrentYearStr()
const previousYear = getPreviousYearStr()

const setUpTable = () => {
    selectEventProgramDimensions({ ...event, dimensions: [dimensionName] })

    selectRelativePeriod({
        label: periodLabel,
        period: TEST_REL_PE_LAST_12_MONTHS,
    })

    clickMenubarUpdateButton()

    expectTableToBeVisible()
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

const assertChipContainsText = (suffix) =>
    cy.getBySelLike('layout-chip').contains(suffix).trigger('mouseover')

const assertTooltipContainsEntries = (entries) =>
    entries.forEach((entry) => cy.getBySel('tooltip-content').contains(entry))

describe('date conditions (Date)', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
    })

    it('exactly', () => {
        const TEST_DATE = `${previousYear}-12-01`

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

    // FIXME: This fails due to a backend bug that hides all empty rows when "is not" is being used

    // it('is not', () => {
    //     unselectAllPeriods({
    //         label: periodLabel,
    //     })
    //     selectRelativePeriod({
    //         label: periodLabel,
    //         period: TEST_REL_PE_THIS_YEAR,
    //     })

    //     const TEST_DATE = `${currentYear}-01-02`

    //     addConditions([
    //         {
    //             conditionName: 'is not',
    //             value: TEST_DATE,
    //         },
    //     ])

    //     expectTableToMatchRows([`${currentYear}-01-01`, `${currentYear}-01-02`, `${currentYear}-01-03`])

    //     assertChipContainsText(`${dimensionName}: 1 condition`)

    //     assertTooltipContainsEntries([stageName, `Is not: ${TEST_DATE}`])
    // })

    it('after', () => {
        const TEST_DATE = `${previousYear}-12-02`

        addConditions([
            {
                conditionName: 'after',
                value: TEST_DATE,
            },
        ])

        expectTableToMatchRows([`${currentYear}-01-01`, `${currentYear}-01-03`])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `After: ${TEST_DATE}`])
    })

    it('after or including', () => {
        const TEST_DATE = `${previousYear}-12-02`

        addConditions([
            {
                conditionName: 'after or including',
                value: TEST_DATE,
            },
        ])

        expectTableToMatchRows([
            `${previousYear}-12-11`,
            `${currentYear}-01-01`,
            `${currentYear}-01-03`,
        ])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([
            stageName,
            `After or including: ${TEST_DATE}`,
        ])
    })

    it('before', () => {
        const TEST_DATE = `${previousYear}-12-02`

        addConditions([
            {
                conditionName: 'before',
                value: TEST_DATE,
            },
        ])

        expectTableToMatchRows([
            `${previousYear}-12-10`,
            `${previousYear}-11-15`,
            `${previousYear}-11-01`,
            `${currentYear}-02-01`,
            `${currentYear}-04-19`,
        ])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Before: ${TEST_DATE}`])
    })

    it('before or including', () => {
        const TEST_DATE = `${previousYear}-12-02`

        addConditions([
            {
                conditionName: 'before or including',
                value: TEST_DATE,
            },
        ])

        expectTableToMatchRows([
            `${previousYear}-12-11`,
            `${previousYear}-12-10`,
            `${previousYear}-11-15`,
            `${previousYear}-11-01`,
            `${currentYear}-02-01`,
            `${currentYear}-04-19`,
        ])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([
            stageName,
            `Before or including: ${TEST_DATE}`,
        ])
    })

    it('is empty / null', () => {
        addConditions([
            {
                conditionName: 'is empty / null',
            },
        ])

        expectTableToMatchRows([`${currentYear}-01-01`, `${currentYear}-03-01`])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Is empty / null`])
    })

    it('is not empty / not null', () => {
        addConditions([
            {
                conditionName: 'is not empty / not null',
            },
        ])

        expectTableToMatchRows([
            `${previousYear}-12-10`,
            `${previousYear}-12-11`,
            `${previousYear}-11-15`,
            `${previousYear}-11-01`,
            `${currentYear}-01-01`,
            `${currentYear}-01-03`,
            `${currentYear}-02-01`,
            `${currentYear}-04-19`,
        ])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Is not empty / not null`])
    })

    it('2 conditions: after + before or including', () => {
        const TEST_DATE_BFI = `${previousYear}-12-02`
        const TEST_DATE_AFT = `${previousYear}-12-01`

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

        expectTableToMatchRows([`${previousYear}-12-11`])

        assertChipContainsText(`${dimensionName}: 2 conditions`)

        assertTooltipContainsEntries([
            stageName,
            `After: ${TEST_DATE_AFT}`,
            `Before or including: ${TEST_DATE_BFI}`,
        ])
    })
})

describe('date types', () => {
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
            cy.visit('/', EXTENDED_TIMEOUT)

            selectEventProgram(ANALYTICS_PROGRAM)
            openDimension(type)

            cy.getBySel('button-add-condition').click()
            cy.contains('Choose a condition').click()

            TEST_OPERATORS.forEach((operator) => {
                cy.getBySel(
                    'dhis2-uicore-select-menu-menuwrapper'
                ).containsExact(operator)
            })
        })
    })
})
