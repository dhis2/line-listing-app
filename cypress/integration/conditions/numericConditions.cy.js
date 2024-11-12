import { DIMENSION_ID_ORGUNIT } from '@dhis2/analytics'
import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_DIM_NUMBER,
    TEST_DIM_UNIT_INTERVAL,
    TEST_DIM_PERCENTAGE,
    TEST_DIM_INTEGER,
    TEST_DIM_INTEGER_POSITIVE,
    TEST_DIM_INTEGER_NEGATIVE,
    TEST_DIM_INTEGER_ZERO_OR_POSITIVE,
    TEST_REL_PE_THIS_YEAR,
    TEST_REL_PE_LAST_YEAR,
    TEST_DIM_WITH_PRESET,
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
    getPreviousYearStr,
    getCurrentYearStr,
    selectRelativePeriod,
} from '../../helpers/period.js'
import { goToStartPage } from '../../helpers/startScreen.js'
import {
    expectTableToBeVisible,
    expectTableToContainHeader,
    expectTableToMatchRows,
    getTableDataCells,
    getTableRows,
} from '../../helpers/table.js'

const previousYear = getPreviousYearStr()
const currentYear = getCurrentYearStr()

const event = E2E_PROGRAM
const periodLabel = event[DIMENSION_ID_EVENT_DATE]
const stageName = 'Stage 1 - Repeatable'

const addConditions = (conditions, dimensionName) => {
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

const testNumberConditions = (dimensionName, version) => {
    const decimalNumber = version >= 41 ? '3.12' : '3.1'

    it('equal to', () => {
        addConditions(
            [{ conditionName: 'equal to (=)', value: '12' }],
            dimensionName
        )

        expectTableToMatchRows(['12'])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [
            stageName,
            'Equal to (=): 12',
        ])
    })

    it('greater than', () => {
        addConditions(
            [{ conditionName: 'greater than (>)', value: '12' }],
            dimensionName
        )

        expectTableToMatchRows(['2 000 000', '5 557 779 990', '5 123 123'])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [
            stageName,
            'Greater than (>): 12',
        ])
    })

    it('greater than or equal to', () => {
        addConditions(
            [{ conditionName: 'greater than or equal to', value: '12' }],
            dimensionName
        )
        expectTableToMatchRows([
            '12',
            '2 000 000',
            '5 557 779 990',
            '5 123 123',
        ])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [
            stageName,
            'Greater than or equal to (≥): 12',
        ])
    })

    it('less than', () => {
        addConditions(
            [{ conditionName: 'less than (<)', value: '12' }],
            dimensionName
        )

        expectTableToMatchRows(['11', decimalNumber])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [
            stageName,
            'Less than (<): 12',
        ])
    })

    it('less than or equal to', () => {
        addConditions(
            [{ conditionName: 'less than or equal to', value: '12' }],
            dimensionName
        )

        expectTableToMatchRows(['11', '12', decimalNumber])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [
            stageName,
            'Less than or equal to (≤): 12',
        ])
    })

    it('not equal to', () => {
        addConditions(
            [{ conditionName: 'not equal to', value: '12' }],
            dimensionName
        )

        expectTableToMatchRows([
            decimalNumber,
            '11',
            `${currentYear}-01-01`, // empty row, use value in date column
            '2 000 000',
            '5 557 779 990',
            '5 123 123',
        ])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [
            stageName,
            'Not equal to (≠): 12',
        ])
    })

    it('is empty / null', () => {
        addConditions([{ conditionName: 'is empty / null' }], dimensionName)

        getTableRows().should('have.length', 1)

        getTableDataCells()
            .eq(1)
            .invoke('text')
            .invoke('trim')
            .should('equal', '')

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [
            stageName,
            'Is empty / null',
        ])
    })

    it('is not empty / not null', () => {
        addConditions(
            [{ conditionName: 'is not empty / not null' }],
            dimensionName
        )

        expectTableToMatchRows([
            decimalNumber,
            '11',
            '12',
            '2 000 000',
            '5 557 779 990',
            '5 123 123',
        ])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [
            stageName,
            'Is not empty / not null',
        ])
    })

    it('2 conditions: greater than + less than', () => {
        addConditions(
            [
                { conditionName: 'greater than (>)', value: '11' },
                { conditionName: 'less than (<)', value: '13' },
            ],
            dimensionName
        )

        expectTableToMatchRows(['12'])

        assertChipContainsText(dimensionName, 2)

        assertTooltipContainsEntries(dimensionName, [
            stageName,
            'Greater than (>): 11',
            'Less than (<): 13',
        ])
    })
}

const prepareNumberConditions = (dimensionName) => {
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
}

/* This test doesn't look like it needs `testIsolation: false`
 * but start failing once this is removed */
describe(['<41'], 'number conditions (event)', { testIsolation: false }, () => {
    const dimensionName = TEST_DIM_NUMBER

    beforeEach(() => {
        prepareNumberConditions(dimensionName)
    })

    testNumberConditions(dimensionName, 40)
})
describe(
    ['>=41'],
    'number conditions (event)',
    { testIsolation: false },
    () => {
        const dimensionName = TEST_DIM_NUMBER

        beforeEach(() => {
            prepareNumberConditions(dimensionName)
        })

        testNumberConditions(dimensionName, 41)
    }
)

describe(['>=41'], 'number conditions (TE)', { testIsolation: false }, () => {
    const dimensionName = 'Age (years)'

    beforeEach(() => {
        // set up a TE LL with a dimension
        goToStartPage()
        selectTrackedEntityWithType('Malaria Entity')
        cy.getBySel('main-sidebar')
            .contains('Malaria Entity dimensions')
            .click()
        clickAddRemoveTrackedEntityTypeDimensions(dimensionName)
        clickMenubarUpdateButton()

        // expect the table to be visible and the dimension chip to be present
        expectTableToBeVisible()
        assertChipContainsText(dimensionName, 'all')
    })

    it('equal to', () => {
        addConditions(
            [{ conditionName: 'equal to (=)', value: '15' }],
            dimensionName
        )

        expectTableToMatchRows(['15'])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, ['Equal to (=): 15'])
    })

    it('greater than', () => {
        addConditions(
            [{ conditionName: 'greater than (>)', value: '43' }],
            dimensionName
        )

        expectTableToMatchRows(['46', '64'])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, ['Greater than (>): 43'])
    })

    it('greater than or equal to', () => {
        addConditions(
            [{ conditionName: 'greater than or equal to', value: '43' }],
            dimensionName
        )
        expectTableToMatchRows(['43', '46', '64'])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [
            'Greater than or equal to (≥): 43',
        ])
    })

    it('less than', () => {
        addConditions(
            [{ conditionName: 'less than (<)', value: '11' }],
            dimensionName
        )

        expectTableToMatchRows([
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '6',
            '9',
            '9',
        ])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, ['Less than (<): 11'])
    })

    it('less than or equal to', () => {
        addConditions(
            [{ conditionName: 'less than or equal to', value: '11' }],
            dimensionName
        )

        expectTableToMatchRows([
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '0',
            '6',
            '9',
            '9',
            '11',
        ])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [
            'Less than or equal to (≤): 11',
        ])
    })

    it('not equal to', () => {
        openOuDimension(DIMENSION_ID_ORGUNIT)
        expectOrgUnitDimensionModalToBeVisible()
        expectOrgUnitDimensionToNotBeLoading()
        deselectUserOrgUnit('User organisation unit')
        openOrgUnitTreeItem('Bo')
        openOrgUnitTreeItem('Badjia')
        selectOrgUnitTreeItem('Njandama MCHP')
        clickOrgUnitDimensionModalUpdateButton()

        addConditions(
            [{ conditionName: 'not equal to', value: '11' }],
            dimensionName
        )

        expectTableToMatchRows(['0', '0', '26', '36'])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, ['Not equal to (≠): 11'])
    })

    it('is empty / null', () => {
        clickAddRemoveTrackedEntityTypeDimensions('System Case ID')

        addConditions([{ conditionName: 'is empty / null' }], dimensionName)

        expectTableToMatchRows(['GFS397135', 'VCA989272', 'PVZ270497'])

        getTableDataCells()
            .eq(1)
            .invoke('text')
            .invoke('trim')
            .should('equal', '')

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, ['Is empty / null'])
    })

    it('is not empty / not null', () => {
        openOuDimension(DIMENSION_ID_ORGUNIT)
        expectOrgUnitDimensionModalToBeVisible()
        expectOrgUnitDimensionToNotBeLoading()
        deselectUserOrgUnit('User organisation unit')
        openOrgUnitTreeItem('Bo')
        openOrgUnitTreeItem('Badjia')
        selectOrgUnitTreeItem('Ngelehun CHC')
        clickOrgUnitDimensionModalUpdateButton()

        getTableRows().should('have.length', 32)

        addConditions(
            [{ conditionName: 'is not empty / not null' }],
            dimensionName
        )

        getTableRows().should('have.length', 29)

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, ['Is not empty / not null'])
    })

    it('2 conditions: greater than + less than', () => {
        addConditions(
            [
                { conditionName: 'greater than (>)', value: '21' },
                { conditionName: 'less than (<)', value: '24' },
            ],
            dimensionName
        )

        expectTableToMatchRows(['23'])

        assertChipContainsText(dimensionName, 2)

        assertTooltipContainsEntries(dimensionName, [
            'Greater than (>): 21',
            'Less than (<): 24',
        ])
    })
})

/* This test doesn't look like it needs `testIsolation: false`
 * but start failing once this is removed */
describe('integer', { testIsolation: false }, () => {
    const dimensionName = TEST_DIM_INTEGER_ZERO_OR_POSITIVE

    beforeEach(() => {
        goToStartPage()

        selectEventWithProgramDimensions({
            ...event,
            dimensions: [dimensionName],
        })

        selectRelativePeriod({
            label: periodLabel,
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        assertChipContainsText(dimensionName, 'all')
    })

    it('integer with negative value', () => {
        addConditions(
            [{ conditionName: 'greater than (>)', value: '-1' }],
            dimensionName
        )

        expectTableToMatchRows(['56', '1', '0', '35', '0', '45', '46'])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [
            stageName,
            'Greater than (>): -1',
        ])
    })

    it('integer with positive value', () => {
        addConditions(
            [{ conditionName: 'greater than (>)', value: '1' }],
            dimensionName
        )

        expectTableToMatchRows(['56', '35', '45', '46'])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [
            stageName,
            'Greater than (>): 1',
        ])
    })

    it('integer with 0', () => {
        addConditions(
            [{ conditionName: 'greater than (>)', value: '0' }],
            dimensionName
        )

        expectTableToMatchRows(['56', '1', '35', '45', '46'])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [
            stageName,
            'Greater than (>): 0',
        ])
    })
})

/* This test doesn't look like it needs `testIsolation: false`
 * but start failing once this is removed */
describe('preset options', { testIsolation: false }, () => {
    const dimensionName = TEST_DIM_WITH_PRESET
    const TEST_PRESET = 'Age 10y interval'

    const addPreset = (preset, value) => {
        cy.getBySelLike('layout-chip').contains(dimensionName).click()
        cy.getBySel('button-add-condition').click()
        cy.contains('Choose a condition type').click()
        cy.contains('is one of preset options').click()
        cy.contains('Choose a set of options').click()
        cy.contains(preset).click()

        if (value) {
            cy.contains('Choose options').click()
            cy.contains(value).click().closePopper()
        }

        cy.getBySel('button-add-condition')
            .contains('Add another condition')
            .should('have.css', 'pointer-events', 'none')

        cy.getBySel('conditions-modal').contains('Update').click()
    }

    beforeEach(() => {
        goToStartPage()

        selectEventWithProgram(E2E_PROGRAM)
        openProgramDimensionsSidebar()
        openDimension(dimensionName)
        cy.contains('Add to Columns').click()

        selectRelativePeriod({
            label: periodLabel,
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        assertChipContainsText(dimensionName, 'all')
    })

    it('set only', () => {
        addPreset(TEST_PRESET)

        expectTableToMatchRows([
            `${previousYear}-01-01`,
            `${previousYear}-12-11`,
            `${previousYear}-01-02`,
            `${previousYear}-11-15`,
            `${previousYear}-12-10`,
            `${previousYear}-12-22`,
            `${previousYear}-12-23`,
        ])

        expectTableToMatchRows([
            '50 - 60',
            '10 - 20',
            '0 - 10',
            '30 - 40',
            '10 - 20',
            '40 - 50',
            '40 - 50',
        ])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [stageName, TEST_PRESET])
    })

    it('set and value', () => {
        const TEST_VALUE = '10 - 20'

        addPreset(TEST_PRESET, TEST_VALUE)

        expectTableToMatchRows([
            `${previousYear}-12-11`,
            `${previousYear}-12-10`,
        ])

        expectTableToMatchRows([TEST_VALUE, TEST_VALUE])

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [stageName, TEST_VALUE])
    })
})

/* This test doesn't look like it needs `testIsolation: false`
 * but start failing once this is removed */
describe('numeric types', { testIsolation: false }, () => {
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
        TEST_DIM_INTEGER_POSITIVE,
        TEST_DIM_INTEGER_NEGATIVE,
        TEST_DIM_INTEGER_ZERO_OR_POSITIVE,
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
                cy.getBySel('numeric-condition-type').containsExact(operator)
            })
            cy.getBySel('numeric-condition-type').closePopper()
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
