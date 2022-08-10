import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import {
    ANALYTICS_PROGRAM,
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
    expectTableToContainHeader,
    expectTableToMatchRows,
} from '../../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../../support/util.js'

const event = ANALYTICS_PROGRAM
const dimensionName = TEST_DIM_TEXT
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

describe('text conditions', () => {
    const LONG_TEXT =
        'Lorem_ ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam vulputate ut pharetra sit. At consectetur lorem donec massa sapien faucibus et molestie ac. Vitae ultricies leo integer malesuada. Id neque aliquam vestibulum morbi. Massa eget'

    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
    })

    it('exactly', () => {
        const TEST_TEXT = 'Text A'

        addConditions([{ conditionName: 'exactly', value: TEST_TEXT }])

        expectTableToMatchRows([TEST_TEXT])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Exactly: ${TEST_TEXT}`])
    })

    // FIXME: This fails due to a backend bug that hides all empty rows when "is not" is being used
    it.skip('is not', () => {
        const TEST_TEXT = 'Text A'

        addConditions([{ conditionName: 'is not', value: TEST_TEXT }])

        expectTableToMatchRows([
            '9000000',
            '2022-03-01',
            'Text A-2',
            '2022-02-01',
            LONG_TEXT,
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

        expectTableToMatchRows(['Text A', 'Text A-2', LONG_TEXT])

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

        expectTableToMatchRows(['Text A', 'Text A-2'])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Contains: ${TEST_TEXT}`])
    })

    // FIXME: This fails due to a backend bug that hides all empty rows when "does not contain" is being used
    it.skip('does not contain', () => {
        const TEST_TEXT = 'T'

        addConditions([
            {
                conditionName: 'does not contain',
                value: TEST_TEXT,
            },
        ])

        expectTableToMatchRows(['2022-03-01', '2022-02-01', '9000000'])

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

        expectTableToMatchRows(['2022-03-01', '2022-02-01'])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Is empty / null`])
    })

    it('is not empty / not null', () => {
        addConditions([
            {
                conditionName: 'is not empty / not null',
            },
        ])

        expectTableToMatchRows(['9000000', 'Text A-2', 'Text A', LONG_TEXT])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, `Is not empty / not null`])
    })

    it('2 conditions: contains + is not', () => {
        addConditions([
            { conditionName: 'contains', value: 'T' },
            { conditionName: 'is not', value: 'Text A-2' },
        ])

        expectTableToMatchRows(['Text A', LONG_TEXT])

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
            cy.visit('/', EXTENDED_TIMEOUT)

            selectEventProgram(ANALYTICS_PROGRAM)
            openDimension(type)

            cy.getBySel('button-add-condition').click()
            cy.contains('Choose a condition type').click()

            TEST_OPERATORS.forEach((operator) => {
                cy.getBySel('alphanumeric-condition-type').containsExact(
                    operator
                )
            })
            cy.getBySel('alphanumeric-condition-type')
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
