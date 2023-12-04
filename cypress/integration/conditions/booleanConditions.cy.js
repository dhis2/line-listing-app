import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_DIM_YESNO,
    TEST_DIM_YESONLY,
    TEST_REL_PE_THIS_YEAR,
} from '../../data/index.js'
import { selectEventWithProgramDimensions } from '../../helpers/dimensions.js'
import {
    assertChipContainsText,
    assertTooltipContainsEntries,
} from '../../helpers/layout.js'
import { clickMenubarUpdateButton } from '../../helpers/menubar.js'
import {
    selectRelativePeriod,
    getCurrentYearStr,
} from '../../helpers/period.js'
import { goToStartPage } from '../../helpers/startScreen.js'
import {
    expectTableToBeVisible,
    expectTableToMatchRows,
} from '../../helpers/table.js'

const currentYear = getCurrentYearStr()

const event = E2E_PROGRAM
const periodLabel = event[DIMENSION_ID_EVENT_DATE]
const stageName = 'Stage 1 - Repeatable'

const setUpTable = (dimensionName) => {
    selectEventWithProgramDimensions({ ...event, dimensions: [dimensionName] })

    selectRelativePeriod({
        label: periodLabel,
        period: TEST_REL_PE_THIS_YEAR,
    })

    clickMenubarUpdateButton()

    expectTableToBeVisible()
}

const addConditions = (conditions, dimensionName) => {
    cy.getBySelLike('layout-chip').contains(dimensionName).click()
    conditions.forEach((conditionName) => {
        cy.getBySel('conditions-modal-content')
            .findBySel('dhis2-uicore-checkbox')
            .contains(conditionName)
            .click()
    })
    cy.getBySel('conditions-modal').contains('Update').click()
}

describe('boolean conditions - Yes/NA', () => {
    const dimensionName = TEST_DIM_YESONLY

    beforeEach(() => {
        goToStartPage()
        setUpTable(dimensionName)
    })

    it('Yes selected', () => {
        cy.setTestDescription(
            'Validates the condition when "Yes" is selected for Yes/NA dimension.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'BooleanConditions' },
            { key: 'condition', value: 'YesSelected' },
        ])

        addConditions(['Yes'], dimensionName)

        expectTableToMatchRows([`${currentYear}-01-01`])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, /\bYes\b/])
    })

    it('Not answered selected', () => {
        cy.setTestDescription(
            'Checks the behavior when "Not answered" is selected for Yes/NA dimension.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'BooleanConditions' },
            { key: 'condition', value: 'NotAnsweredSelected' },
        ])
        addConditions(['Not answered'], dimensionName)

        expectTableToMatchRows([
            `${currentYear}-04-19`,
            `${currentYear}-01-01`,
            `${currentYear}-01-03`,
            `${currentYear}-03-01`,
            `${currentYear}-02-01`,
            `${currentYear}-03-01`,
        ])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, /\bNot answered\b/])
    })

    it('Yes + Not answered selected', () => {
        cy.setTestDescription(
            'Ensures correct functionality when both "Yes" and "Not answered" are selected.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'BooleanConditions' },
            { key: 'condition', value: 'YesAndNotAnsweredSelected' },
        ])
        addConditions(['Yes', 'Not answered'], dimensionName)

        expectTableToMatchRows([
            `${currentYear}-04-19`,
            `${currentYear}-01-01`,
            `${currentYear}-01-01`,
            `${currentYear}-01-03`,
            `${currentYear}-03-01`,
            `${currentYear}-02-01`,
            `${currentYear}-03-01`,
        ])

        assertChipContainsText(`${dimensionName}: all`)

        assertTooltipContainsEntries([stageName, /\bYes\b/, /\bNot answered\b/])
    })
})

describe('boolean conditions - Yes/No/NA', () => {
    const dimensionName = TEST_DIM_YESNO

    beforeEach(() => {
        goToStartPage()
        setUpTable(dimensionName)
    })

    it('Yes selected', () => {
        cy.setTestDescription(
            'Tests the "Yes" selection functionality for Yes/No/NA dimension.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'BooleanConditions' },
            { key: 'condition', value: 'YesSelectedYesNoNA' },
        ])
        addConditions(['Yes'], dimensionName)

        expectTableToMatchRows([`${currentYear}-01-01`, `${currentYear}-04-19`])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, /\bYes\b/])
    })

    it('No selected', () => {
        cy.setTestDescription(
            'Validates the "No" selection effect in the Yes/No/NA dimension.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'BooleanConditions' },
            { key: 'condition', value: 'NoSelected' },
        ])
        addConditions(['No'], dimensionName)

        expectTableToMatchRows([`${currentYear}-01-03`])

        assertChipContainsText(`${dimensionName}: 1 condition`)

        assertTooltipContainsEntries([stageName, /\bNo\b/])
    })

    it('Yes + Not answered selected', () => {
        cy.setTestDescription(
            'Checks functionality when "Yes" and "Not answered" are both selected in Yes/No/NA dimension.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'BooleanConditions' },
            { key: 'condition', value: 'YesAndNotAnsweredSelectedYesNoNA' },
        ])
        addConditions(['Yes', 'Not answered'], dimensionName)

        expectTableToMatchRows([
            `${currentYear}-04-19`,
            `${currentYear}-01-01`,
            `${currentYear}-01-01`,
            `${currentYear}-03-01`,
            `${currentYear}-02-01`,
            `${currentYear}-03-01`,
        ])

        assertChipContainsText(`${dimensionName}: 2 conditions`)

        assertTooltipContainsEntries([stageName, /\bYes\b/, /\bNot answered\b/])
    })

    it('Yes + No + Not answered selected', () => {
        cy.setTestDescription(
            'Ensures correct behavior when "Yes", "No", and "Not answered" are all selected.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'BooleanConditions' },
            { key: 'condition', value: 'YesNoNotAnsweredAllSelected' },
        ])
        addConditions(['Yes', 'No', 'Not answered'], dimensionName)

        expectTableToMatchRows([
            `${currentYear}-04-19`,
            `${currentYear}-01-01`,
            `${currentYear}-01-01`,
            `${currentYear}-01-03`,
            `${currentYear}-03-01`,
            `${currentYear}-02-01`,
            `${currentYear}-03-01`,
        ])

        assertChipContainsText(`${dimensionName}: all`)

        assertTooltipContainsEntries([
            stageName,
            /\bYes\b/,
            /\bNo\b/,
            /\bNot answered\b/,
        ])
    })
})
