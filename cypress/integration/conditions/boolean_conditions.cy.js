import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import {
    ANALYTICS_PROGRAM,
    TEST_DIM_YESNO,
    TEST_REL_PE_THIS_YEAR,
} from '../../data/index.js'
import { selectEventProgramDimensions } from '../../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../../helpers/menubar.js'
import {
    selectRelativePeriod,
    getCurrentYearStr,
} from '../../helpers/period.js'
import {
    expectTableToBeVisible,
    expectTableToMatchRows,
} from '../../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../../support/util.js'

const event = ANALYTICS_PROGRAM
const dimensionName = TEST_DIM_YESNO
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
}

const addConditions = (conditions) => {
    cy.getBySelLike('layout-chip').contains(dimensionName).click()
    conditions.forEach((conditionName) => {
        cy.getWithDataTest('{conditions-modal-content}')
            .findWithDataTest('{dhis2-uicore-checkbox}')
            .contains(conditionName)
            .click()
    })
    cy.getWithDataTest('{conditions-modal}').contains('Update').click()
}

const assertTooltipContainsEntries = (entries) => {
    entries.forEach((entry) =>
        cy.getWithDataTest('{tooltip-content}').contains(entry)
    )
}

describe('boolean conditions', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
    })

    it('Yes selected', () => {
        addConditions(['Yes'])

        expectTableToMatchRows([
            `${getCurrentYearStr()}-01-01`,
            `${getCurrentYearStr()}-04-19`,
        ])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, /\bYes\b/])
    })

    it('No selected', () => {
        addConditions(['No'])

        expectTableToMatchRows([`${getCurrentYearStr()}-01-03`])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, /\bNo\b/])
    })

    it('Yes and Not answered selected', () => {
        addConditions(['Yes', 'Not answered'])

        expectTableToMatchRows([
            `${getCurrentYearStr()}-01-01`,
            `${getCurrentYearStr()}-03-01`,
            `${getCurrentYearStr()}-01-01`,
            `${getCurrentYearStr()}-02-01`,
            `${getCurrentYearStr()}-04-19`,
        ])

        cy.getBySelLike('layout-chip')
            .contains(`${dimensionName}: 2 conditions`)
            .trigger('mouseover')

        assertTooltipContainsEntries([stageName, /\bYes\b/, /\bNot answered\b/])
    })
})
