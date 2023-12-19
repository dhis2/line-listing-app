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
    openProgramDimensionsSidebar,
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
        cy.setTestDescription(
            'Tests the date condition "exactly" for a specific date.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'DateConditions' },
            { key: 'action', value: 'TestExactDate' },
            { key: 'condition', value: 'Exactly' },
        ])
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
        cy.setTestDescription(
            'Tests the date condition "is not" for excluding a specific date.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'DateConditions' },
            { key: 'action', value: 'TestDateIsNot' },
            { key: 'condition', value: 'IsNot' },
        ])
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
        cy.setTestDescription(
            'Tests the date condition "after" for selecting dates after a specific date.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'DateConditions' },
            { key: 'action', value: 'TestDateAfter' },
            { key: 'condition', value: 'After' },
        ])
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
        cy.setTestDescription(
            'Tests the date condition "after or including" for selecting dates after or on a specific date.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'DateConditions' },
            { key: 'action', value: 'TestDateAfterOrIncluding' },
            { key: 'condition', value: 'AfterOrIncluding' },
        ])
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
        cy.setTestDescription(
            'Tests the date condition "before" for selecting dates before a specific date.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'DateConditions' },
            { key: 'action', value: 'TestDateBefore' },
            { key: 'condition', value: 'Before' },
        ])
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
        cy.setTestDescription(
            'Tests the date condition "before or including" for selecting dates before or on a specific date.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'DateConditions' },
            { key: 'action', value: 'TestDateBeforeOrIncluding' },
            { key: 'condition', value: 'BeforeOrIncluding' },
        ])
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
        cy.setTestDescription(
            'Tests the date condition "is empty / null" for selecting dates that are empty or null.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'DateConditions' },
            { key: 'action', value: 'TestDateIsEmptyOrNull' },
            { key: 'condition', value: 'IsEmptyOrNull' },
        ])
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
        cy.setTestDescription(
            'Tests the date condition "is not empty / not null" for selecting dates that are not empty or null.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'DateConditions' },
            { key: 'action', value: 'TestDateIsNotEmptyNotNull' },
            { key: 'condition', value: 'IsNotEmptyNotNull' },
        ])
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
        cy.setTestDescription(
            'Tests a combination of "after" and "before or including" date conditions.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'DateConditions' },
            { key: 'action', value: 'TestDateComboAfterBeforeOrIncluding' },
            { key: 'condition', value: 'AfterBeforeOrIncludingCombo' },
        ])
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
            cy.setTestDescription(
                `Verifies that the "${type}" dimension type supports all defined date operators.`
            )
            cy.addTestAttributes([
                { key: 'feature', value: 'DateTypeOperatorCheck' },
                { key: 'action', value: 'VerifyAllOperators' },
                { key: 'dimension', value: `DimensionType-${type}` },
            ])

            goToStartPage()

            selectEventWithProgram(E2E_PROGRAM)
            openProgramDimensionsSidebar()
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
            cy.setTestDescription(
                `Ensures that the "${type}" dimension type can be effectively utilized in visualizations.`
            )
            cy.addTestAttributes([
                { key: 'feature', value: 'DateTypeVisualizationUsage' },
                { key: 'action', value: 'UtilizationInVisualization' },
                { key: 'dimension', value: `DimensionType-${type}` },
            ])

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
