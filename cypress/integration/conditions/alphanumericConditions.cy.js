import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_DIM_TEXT,
    TEST_DIM_LETTER,
    TEST_DIM_LONG_TEXT,
    TEST_DIM_EMAIL,
    TEST_DIM_USERNAME,
    TEST_DIM_URL,
    TEST_DIM_PHONE_NUMBER,
    TEST_REL_PE_THIS_YEAR,
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
    getCurrentYearStr,
    selectRelativePeriod,
} from '../../helpers/period.js'
import { goToStartPage } from '../../helpers/startScreen.js'
import {
    expectTableToBeVisible,
    expectTableToContainHeader,
    expectTableToMatchRows,
} from '../../helpers/table.js'

const event = E2E_PROGRAM
const dimensionName = TEST_DIM_TEXT
const periodLabel = event[DIMENSION_ID_EVENT_DATE]
const stageName = 'Stage 1 - Repeatable'
const currentYear = getCurrentYearStr()

const setUpTable = () => {
    selectEventWithProgramDimensions({ ...event, dimensions: [dimensionName] })

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
    conditions.forEach(({ conditionName, value, useCaseSensitive }, index) => {
        cy.getBySel('button-add-condition').click()
        cy.contains('Choose a condition type').click()
        cy.contains(conditionName).click()
        if (value) {
            cy.getBySel('alphanumeric-condition')
                .eq(index)
                .find('input[type="text"]')
                .type(value)
        }
        if (useCaseSensitive) {
            cy.getBySel('alphanumeric-condition')
                .eq(index)
                .findBySel('condition-case-sensitive-checkbox')
                .click()
                .find('[type="checkbox"]')
                .should('be.checked')
        }
    })
    cy.getBySel('conditions-modal').contains('Update').click()
}

/* This test doesn't look like it needs `testIsolation: false`
 * but start failing once this is removed */
describe('text conditions', { testIsolation: false }, () => {
    const LONG_TEXT =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

    beforeEach(() => {
        goToStartPage()
        setUpTable()
    })

    it('tests condition exactly', () => {
        cy.setTestDescription(
            'Verifies that the text condition "exactly" works as expected in filtering data.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'AlphanumericConditions' },
            { key: 'action', value: 'TestExactMatch' },
            { key: 'condition', value: 'Exactly' },
        ])
        const TEST_TEXT = 'Text A'

        addConditions([{ conditionName: 'exactly', value: TEST_TEXT }])

        expectTableToMatchRows([TEST_TEXT])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Exactly: ${TEST_TEXT}`])
    })

    it('tests condition is not', () => {
        cy.setTestDescription(
            'Checks that the text condition "is not" correctly filters out specified data.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'AlphanumericConditions' },
            { key: 'action', value: 'TestExclusion' },
            { key: 'condition', value: 'IsNot' },
        ])
        const TEST_TEXT = 'Text A'

        addConditions([{ conditionName: 'is not', value: TEST_TEXT }])

        expectTableToMatchRows([
            LONG_TEXT,
            '9000000',
            'Text A-2',
            `${currentYear}-03-01`, // empty row, use value in date column
            `${currentYear}-02-01`, // empty row, use value in date column
            'Text E',
        ])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Is not: ${TEST_TEXT}`])
    })

    it('tests condition contains', () => {
        cy.setTestDescription(
            'Ensures that the "contains" condition accurately filters data containing specific text.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'AlphanumericConditions' },
            { key: 'action', value: 'TestContains' },
            { key: 'condition', value: 'Contains' },
        ])
        const TEST_TEXT = 'T'

        addConditions([
            {
                conditionName: 'contains',
                value: TEST_TEXT,
            },
        ])

        expectTableToMatchRows([LONG_TEXT, 'Text A', 'Text A-2', 'Text E'])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Contains: ${TEST_TEXT}`])
    })

    it('tests condition contains (case-sensitive)', () => {
        cy.setTestDescription(
            'Validates the case-sensitive functionality of the "contains" text condition.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'TextConditions' },
            { key: 'condition', value: 'ContainsCaseSensitive' },
        ])
        const TEST_TEXT = 'T'

        addConditions([
            {
                conditionName: 'contains',
                value: TEST_TEXT,
                useCaseSensitive: true,
            },
        ])

        expectTableToMatchRows(['Text A', 'Text A-2', 'Text E'])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Contains: ${TEST_TEXT}`])
    })

    it('tests condition does not contain', () => {
        cy.setTestDescription(
            'Verifies the "does not contain" condition for correctly excluding specific text.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'AlphanumericConditions' },
            { key: 'action', value: 'TestDoesNotContain' },
            { key: 'condition', value: 'DoesNotContain' },
        ])
        const TEST_TEXT = 'T'

        addConditions([
            {
                conditionName: 'does not contain',
                value: TEST_TEXT,
            },
        ])

        expectTableToMatchRows([
            `${currentYear}-03-01`, // empty row, use value in date column
            `${currentYear}-02-01`, // empty row, use value in date column
            '9000000',
        ])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([
            stageName,
            `Does not contain: ${TEST_TEXT}`,
        ])
    })

    it('tests condition is empty / null', () => {
        cy.setTestDescription(
            'Verifies that the "is empty / null" condition correctly identifies and filters empty or null values.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'AlphanumericConditions' },
            { key: 'action', value: 'TestIsEmptyOrNull' },
            { key: 'condition', value: 'IsEmptyOrNull' },
        ])
        addConditions([
            {
                conditionName: 'is empty / null',
            },
        ])

        expectTableToMatchRows([`${currentYear}-03-01`, `${currentYear}-02-01`]) // empty row, use value in date column

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Is empty / null`])
    })

    it('tests condition is not empty / not null', () => {
        cy.setTestDescription(
            'Checks that the "is not empty / not null" condition accurately filters non-empty and non-null values.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'AlphanumericConditions' },
            { key: 'action', value: 'TestIsNotEmptyOrNull' },
            { key: 'condition', value: 'IsNotEmptyOrNull' },
        ])
        addConditions([
            {
                conditionName: 'is not empty / not null',
            },
        ])

        expectTableToMatchRows([
            LONG_TEXT,
            'Text A',
            '9000000',
            'Text A-2',
            'Text E',
        ])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Is not empty / not null`])
    })

    it('tests multiple conditions: contains + is not', () => {
        cy.setTestDescription(
            'Ensures that combining "contains" and "is not" conditions works as expected for filtering data.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'AlphanumericConditions' },
            { key: 'action', value: 'TestCombinedConditions' },
            { key: 'condition', value: 'CombinedConditionsContainsIsNot' },
        ])
        addConditions([
            { conditionName: 'contains', value: 'T' },
            { conditionName: 'is not', value: 'Text A-2' },
        ])

        expectTableToMatchRows([LONG_TEXT, 'Text A', 'Text E'])

        assertChipContainsText(`${dimensionName}: 2 conditions`)

        assertTooltipContainsEntries([stageName, 'Contains: ', 'Is not: '])
    })
})
/* This test doesn't look like it needs `testIsolation: false`
 * but start failing once this is removed */
describe('alphanumeric types', { testIsolation: false }, () => {
    const TEST_OPERATORS = [
        'exactly',
        'is not',
        'contains',
        'does not contain',
        'is empty / null',
        'is not empty / not null',
    ]

    const TEST_TYPES = [
        TEST_DIM_TEXT,
        TEST_DIM_LETTER,
        TEST_DIM_LONG_TEXT,
        TEST_DIM_EMAIL,
        TEST_DIM_USERNAME,
        TEST_DIM_URL,
        TEST_DIM_PHONE_NUMBER,
    ]

    TEST_TYPES.forEach((type) => {
        it(`${type} has all operators`, () => {
            cy.setTestDescription(
                `Verifies that the dimension type "${type}" supports all defined operators.`
            )
            cy.addTestAttributes([
                { key: 'feature', value: 'AlphanumericConditions' },
                { key: 'action', value: 'VerifyOperators' },
                { key: 'dimensionType', value: `Type-${type}` },
            ])
            goToStartPage()

            selectEventWithProgram(E2E_PROGRAM)
            openProgramDimensionsSidebar()
            openDimension(type)

            cy.getBySel('button-add-condition').click()
            cy.contains('Choose a condition type').click()

            TEST_OPERATORS.forEach((operator) => {
                cy.getBySel('alphanumeric-condition-type').containsExact(
                    operator
                )
            })
            cy.getBySel('alphanumeric-condition-type').closePopper()
            cy.contains('Add to Columns').click()
        })

        it(`${type} can be used in a visualization`, () => {
            cy.setTestDescription(
                `Ensures that the dimension type "${type}" can be effectively utilized in visualizations.`
            )
            cy.addTestAttributes([
                { key: 'feature', value: 'AlphanumericConditions' },
                { key: 'action', value: 'TestInVisualization' },
                { key: 'dimensionType', value: `Type-${type}` },
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
