import { DIMENSION_ID_ORGUNIT } from '@dhis2/analytics'
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
    clickAddRemoveTrackedEntityTypeDimensions,
    openDimension,
    openProgramDimensionsSidebar,
    selectEventWithProgram,
    selectEventWithProgramDimensions,
    selectTrackedEntityWithType,
} from '../../helpers/dimensions.js'
import {
    assertChipContainsText,
    assertTooltipContainsEntries,
} from '../../helpers/layout.js'
import { clickMenubarUpdateButton } from '../../helpers/menubar.js'
import {
    clickOrgUnitDimensionModalUpdateButton,
    deselectUserOrgUnit,
    expectOrgUnitDimensionModalToBeVisible,
    expectOrgUnitDimensionToNotBeLoading,
    openOrgUnitTreeItem,
    openOuDimension,
    selectOrgUnitTreeItem,
} from '../../helpers/orgUnit.js'
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
const periodLabel = event[DIMENSION_ID_EVENT_DATE]

const currentYear = getCurrentYearStr()

// Debugging Block
describe.only('Debug Trailing Slash Issue', () => {
    it('Logs requests and responses for trailing slash', () => {
        cy.intercept('**', (req) => {
            console.log(`Request URL: ${req.url}`)
            req.on('response', (res) => {
                console.log(`Response Status: ${res.statusCode}`)
                if (res.headers.location) {
                    console.log(`Redirected To: ${res.headers.location}`)
                }
            })
        }).as('requests')

        // Visit the base URL without appending a trailing slash
        cy.visit(
            'https://test.e2e.dhis2.org/analytics-2.41/api/apps/line-listing/index.html'
        )

        // Wait for intercepted requests
        cy.wait('@requests')
    })

/*
    // one way to make sure that conditions work for TE is to simply duplicate the tests we have today and adapt them to TE, here's a quick plan for that:
    // TODO: make a copy of the "describe('text conditions..." below
    // TODO: change the beforeEach to include this instead:
    selectTrackedEntityWithTypeAndProgramDimensions({
        typeName: 'Person',
        ...event,
        dimensions: [dimensionName],
    })
    // TODO: add period selection here once it's supported / before merging this to master!
    // TODO: adapt the results of each test to match the result from tracked entity

    // TODO: do all of the above for the other types of conditions
*/
const addConditions = (conditions, dimensionName) => {
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
describe('text conditions (event)', { testIsolation: false }, () => {
    const dimensionName = TEST_DIM_TEXT
    const stageName = 'Stage 1 - Repeatable'
    const LONG_TEXT =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

    beforeEach(() => {
        goToStartPage()

        selectEventWithProgramDimensions({
            ...event,
            dimensions: [dimensionName],
        })

        selectRelativePeriod({
            label: periodLabel,
            period: TEST_REL_PE_THIS_YEAR,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        assertChipContainsText(dimensionName, 'all')
    })

    it('exactly', () => {
        const TEST_TEXT = 'Text A'

        addConditions(
            [{ conditionName: 'exactly', value: TEST_TEXT }],
            dimensionName
        )

        expectTableToMatchRows([TEST_TEXT])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries([stageName, `Exactly: ${TEST_TEXT}`])
    })

    it('is not', () => {
        const TEST_TEXT = 'Text A'

        addConditions(
            [{ conditionName: 'is not', value: TEST_TEXT }],
            dimensionName
        )

        expectTableToMatchRows([
            LONG_TEXT,
            '9000000',
            'Text A-2',
            `${currentYear}-03-01`, // empty row, use value in date column
            `${currentYear}-02-01`, // empty row, use value in date column
            'Text E',
        ])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries([stageName, `Is not: ${TEST_TEXT}`])
    })

    it('contains', () => {
        const TEST_TEXT = 'T'

        addConditions(
            [
                {
                    conditionName: 'contains',
                    value: TEST_TEXT,
                },
            ],
            dimensionName
        )

        expectTableToMatchRows([LONG_TEXT, 'Text A', 'Text A-2', 'Text E'])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries([stageName, `Contains: ${TEST_TEXT}`])
    })

    it('contains (case-sensitive)', () => {
        const TEST_TEXT = 'T'

        addConditions(
            [
                {
                    conditionName: 'contains',
                    value: TEST_TEXT,
                    useCaseSensitive: true,
                },
            ],
            dimensionName
        )

        expectTableToMatchRows(['Text A', 'Text A-2', 'Text E'])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries([stageName, `Contains: ${TEST_TEXT}`])
    })

    it('does not contain', () => {
        const TEST_TEXT = 'T'

        addConditions(
            [
                {
                    conditionName: 'does not contain',
                    value: TEST_TEXT,
                },
            ],
            dimensionName
        )

        expectTableToMatchRows([
            `${currentYear}-03-01`, // empty row, use value in date column
            `${currentYear}-02-01`, // empty row, use value in date column
            '9000000',
        ])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries([
            stageName,
            `Does not contain: ${TEST_TEXT}`,
        ])
    })

    it('is empty / null', () => {
        addConditions(
            [
                {
                    conditionName: 'is empty / null',
                },
            ],
            dimensionName
        )

        expectTableToMatchRows([`${currentYear}-03-01`, `${currentYear}-02-01`]) // empty row, use value in date column

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries([stageName, `Is empty / null`])
    })

    it('is not empty / not null', () => {
        addConditions(
            [
                {
                    conditionName: 'is not empty / not null',
                },
            ],
            dimensionName
        )

        expectTableToMatchRows([
            LONG_TEXT,
            'Text A',
            '9000000',
            'Text A-2',
            'Text E',
        ])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries([stageName, `Is not empty / not null`])
    })

    it('2 conditions: contains + is not', () => {
        addConditions(
            [
                { conditionName: 'contains', value: 'T' },
                { conditionName: 'is not', value: 'Text A-2' },
            ],
            dimensionName
        )

        expectTableToMatchRows([LONG_TEXT, 'Text A', 'Text E'])

        assertChipContainsText(dimensionName, 2)

        assertTooltipContainsEntries([stageName, 'Contains: ', 'Is not: '])
    })
})
describe(['>=41'], 'text conditions (TE)', { testIsolation: false }, () => {
    const dimensionName = 'First Name'

    beforeEach(() => {
        // set up a TE LL with some dimensions
        goToStartPage()
        selectTrackedEntityWithType('Malaria Entity')
        cy.getBySel('main-sidebar')
            .contains('Malaria Entity dimensions')
            .click()
        clickAddRemoveTrackedEntityTypeDimensions(dimensionName)
        // select a second dimension that can be verified if the first dimension has an emtpy value
        clickAddRemoveTrackedEntityTypeDimensions('System Case ID')

        // change org unit to limit the data
        openOuDimension(DIMENSION_ID_ORGUNIT)
        expectOrgUnitDimensionModalToBeVisible()
        expectOrgUnitDimensionToNotBeLoading()
        deselectUserOrgUnit('User organisation unit')
        openOrgUnitTreeItem('Bo')
        openOrgUnitTreeItem('Badjia')
        selectOrgUnitTreeItem('Njandama MCHP')
        clickOrgUnitDimensionModalUpdateButton()

        // assert that the table is visible and that the layout chip is present
        expectTableToBeVisible()
        assertChipContainsText(dimensionName, 'all')
    })

    it('exactly', () => {
        const TEST_TEXT = 'Angus'

        addConditions(
            [{ conditionName: 'exactly', value: TEST_TEXT }],
            dimensionName
        )

        expectTableToMatchRows([TEST_TEXT])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries([`Exactly: ${TEST_TEXT}`])
    })

    it('is not', () => {
        const TEST_TEXT = 'Angus'

        addConditions(
            [{ conditionName: 'is not', value: TEST_TEXT }],
            dimensionName
        )

        expectTableToMatchRows([
            'Mark',
            'YYX928443', // empty row, use value in another column
            'BGD242352', // empty row, use value in another column
            'beleb',
        ])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries([`Is not: ${TEST_TEXT}`])
    })

    it('contains', () => {
        const TEST_TEXT = 'A'

        addConditions(
            [
                {
                    conditionName: 'contains',
                    value: TEST_TEXT,
                },
            ],
            dimensionName
        )

        expectTableToMatchRows(['Angus', 'Mark'])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries([`Contains: ${TEST_TEXT}`])
    })

    it('contains (case-sensitive)', () => {
        const TEST_TEXT = 'a'

        addConditions(
            [
                {
                    conditionName: 'contains',
                    value: TEST_TEXT,
                    useCaseSensitive: true,
                },
            ],
            dimensionName
        )

        expectTableToMatchRows(['Mark'])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries([`Contains: ${TEST_TEXT}`])
    })

    it('does not contain', () => {
        const TEST_TEXT = 'A'

        addConditions(
            [
                {
                    conditionName: 'does not contain',
                    value: TEST_TEXT,
                },
            ],
            dimensionName
        )

        expectTableToMatchRows([
            'beleb',
            'YYX928443', // empty row, use value in another column
            'BGD242352', // empty row, use value in another column
        ])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries([`Does not contain: ${TEST_TEXT}`])
    })

    it('is empty / null', () => {
        addConditions(
            [
                {
                    conditionName: 'is empty / null',
                },
            ],
            dimensionName
        )

        expectTableToMatchRows(['YYX928443', 'BGD242352']) //// empty row, use value in another column

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries([`Is empty / null`])
    })

    it('is not empty / not null', () => {
        addConditions(
            [
                {
                    conditionName: 'is not empty / not null',
                },
            ],
            dimensionName
        )

        expectTableToMatchRows(['Angus', 'Mark', 'beleb'])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries([`Is not empty / not null`])
    })

    it('2 conditions: contains + is not', () => {
        addConditions(
            [
                { conditionName: 'contains', value: 'A' },
                { conditionName: 'is not', value: 'Mark' },
            ],
            dimensionName
        )

        expectTableToMatchRows(['Angus'])

        assertChipContainsText(dimensionName, 2)

        assertTooltipContainsEntries(['Contains: ', 'Is not: '])
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
