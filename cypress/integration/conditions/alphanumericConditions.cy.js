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

    it('exactly', () => {
        const TEST_TEXT = 'Text A'

        addConditions([{ conditionName: 'exactly', value: TEST_TEXT }])

        expectTableToMatchRows([TEST_TEXT])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Exactly: ${TEST_TEXT}`])
    })

    it('is not', () => {
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

    it('contains', () => {
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

    it('contains (case-sensitive)', () => {
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

    it('does not contain', () => {
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

    it('is empty / null', () => {
        addConditions([
            {
                conditionName: 'is empty / null',
            },
        ])

        expectTableToMatchRows([`${currentYear}-03-01`, `${currentYear}-02-01`]) // empty row, use value in date column

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
            LONG_TEXT,
            'Text A',
            '9000000',
            'Text A-2',
            'Text E',
        ])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Is not empty / not null`])
    })

    it('2 conditions: contains + is not', () => {
        addConditions([
            { conditionName: 'contains', value: 'T' },
            { conditionName: 'is not', value: 'Text A-2' },
        ])

        expectTableToMatchRows([LONG_TEXT, 'Text A', 'Text E'])

        assertChipContainsText(`${dimensionName}: 2 conditions`)

        assertTooltipContainsEntries([stageName, 'Contains: ', 'Is not: '])
    })
})

describe('alphanumeric types', () => {
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
            goToStartPage()

            selectEventWithProgram(E2E_PROGRAM)
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
