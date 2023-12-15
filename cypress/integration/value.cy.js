import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_DIM_TEXT,
    TEST_DIM_TEXT_OPTIONSET,
    TEST_DIM_NUMBER_OPTIONSET,
    TEST_DIM_NUMBER,
    TEST_DIM_INTEGER,
    TEST_DIM_INTEGER_POSITIVE,
    TEST_DIM_INTEGER_NEGATIVE,
    TEST_DIM_INTEGER_ZERO_OR_POSITIVE,
    TEST_DIM_PERCENTAGE,
    TEST_DIM_UNIT_INTERVAL,
    TEST_DIM_TIME,
    TEST_DIM_DATE,
    TEST_DIM_DATETIME,
    TEST_DIM_PHONE_NUMBER,
    TEST_REL_PE_LAST_YEAR,
} from '../data/index.js'
import { selectEventWithProgramDimensions } from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import {
    selectRelativePeriod,
    selectFixedPeriod,
    getCurrentYearStr,
} from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    expectTableToMatchRows,
    getTableDataCells,
    getTableRows,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const shouldHaveWhiteSpace = (index, value) =>
    getTableDataCells()
        .eq(index)
        .invoke('css', 'white-space')
        .should('equal', value)

describe('value', () => {
    it('has the correct white-space css', () => {
        cy.setTestDescription(
            `Validates that the white-space CSS property is correctly applied to different dimension types in the table.`
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'ValueDisplay' },
            { key: 'aspect', value: 'WhiteSpaceCSS' },
        ])
        const programDimensionsWithWrap = [
            TEST_DIM_TEXT,
            TEST_DIM_TEXT_OPTIONSET,
            TEST_DIM_NUMBER_OPTIONSET,
        ]
        const programDimensionsWithoutWrap = [
            TEST_DIM_NUMBER,
            TEST_DIM_INTEGER,
            TEST_DIM_INTEGER_POSITIVE,
            TEST_DIM_INTEGER_NEGATIVE,
            TEST_DIM_INTEGER_ZERO_OR_POSITIVE,
            TEST_DIM_PERCENTAGE,
            TEST_DIM_UNIT_INTERVAL,
            TEST_DIM_TIME,
            TEST_DIM_DATE,
            TEST_DIM_DATETIME,
            TEST_DIM_PHONE_NUMBER,
        ]
        const programDimensions = [
            ...programDimensionsWithWrap,
            ...programDimensionsWithoutWrap,
        ]

        goToStartPage()

        selectEventWithProgramDimensions({
            programName: E2E_PROGRAM.programName,
            dimensions: programDimensions,
        })

        selectRelativePeriod({
            label: E2E_PROGRAM[DIMENSION_ID_EVENT_DATE],
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        const dimensions = [
            'Organisation unit name',
            ...programDimensions,
            E2E_PROGRAM[DIMENSION_ID_EVENT_DATE],
        ]

        programDimensionsWithWrap.forEach((dim) =>
            shouldHaveWhiteSpace(dimensions.indexOf(dim), 'normal')
        )
        programDimensionsWithoutWrap.forEach((dim) =>
            shouldHaveWhiteSpace(dimensions.indexOf(dim), 'nowrap')
        )
    })
})

describe('option sets', () => {
    it('empty values are left empty', () => {
        cy.setTestDescription(
            `Ensures that empty values in option sets are correctly displayed as empty in the table.`
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'OptionSets' },
            { key: 'aspect', value: 'EmptyValueHandling' },
        ])
        const currentYear = getCurrentYearStr()

        goToStartPage()

        selectEventWithProgramDimensions({
            programName: 'TB program',
            stageName: 'Sputum smear microscopy test',
            dimensions: ['TB smear microscopy test outcome'],
        })

        selectFixedPeriod({
            label: 'Report date',
            period: {
                year: `${currentYear}`,
                name: `June ${currentYear}`,
            },
        })

        cy.getBySel('columns-axis')
            .findBySel('dimension-menu-button-ou')
            .click()

        cy.contains('Move to Filter').click()

        clickMenubarUpdateButton()

        cy.getBySel('table-header', EXTENDED_TIMEOUT)
            .eq(0)
            .find('button')
            .click()

        expectTableToMatchRows([`${currentYear}-06-01`, `${currentYear}-06-28`])

        const result = ['Negative', '']

        result.forEach((value, index) => {
            getTableRows()
                .eq(index)
                .find('td')
                .eq(0)
                .invoke('text')
                .should('eq', value)
        })
    })
})
