import {
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_LAST_UPDATED,
} from '../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_DIM_TEXT,
    TEST_DIM_LONG_TEXT,
    TEST_DIM_EMAIL,
    TEST_DIM_USERNAME,
    TEST_DIM_URL,
    TEST_DIM_PHONE_NUMBER,
    TEST_DIM_NUMBER,
    TEST_DIM_PERCENTAGE,
    TEST_DIM_INTEGER,
    TEST_DIM_INTEGER_POSITIVE,
    TEST_DIM_INTEGER_NEGATIVE,
    TEST_DIM_INTEGER_ZERO_OR_POSITIVE,
    TEST_DIM_YESNO,
    TEST_DIM_YESONLY,
    TEST_DIM_DATE,
    TEST_DIM_TIME,
    TEST_DIM_DATETIME,
    TEST_DIM_AGE,
    TEST_DIM_ORG_UNIT,
    TEST_DIM_COORDINATE,
    TEST_DIM_LEGEND_SET,
    TEST_DIM_NUMBER_OPTIONSET,
    TEST_DIM_TEXT_OPTIONSET,
    TEST_REL_PE_THIS_YEAR,
} from '../data/index.js'
import {
    clickAddRemoveMainDimension,
    clickAddRemoveProgramDataDimension,
    clickAddRemoveProgramDimension,
    openProgramDimensionsSidebar,
    selectEventWithProgram,
    selectEventWithProgramDimensions,
} from '../helpers/dimensions.js'
import {
    clickMenubarUpdateButton,
    openStyleOptionsModal,
} from '../helpers/menubar.js'
import { clickOptionsModalUpdateButton } from '../helpers/options.js'
import {
    selectFixedPeriod,
    selectRelativePeriod,
    getPreviousYearStr,
    getCurrentYearStr,
    getOffsetYearStr,
} from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    getTableRows,
    getTableHeaderCells,
    expectTableToBeUpdated,
    expectTableToBeVisible,
    getTableDataCells,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const trackerProgram = E2E_PROGRAM
const periodLabel = trackerProgram[DIMENSION_ID_EVENT_DATE]
const currentYear = getCurrentYearStr()
const previousYear = getPreviousYearStr()

const mainDimensions = [
    {
        label: trackerProgram[DIMENSION_ID_LAST_UPDATED],
        value: '2023-01-04 14:04',
    },
    { label: 'Created by', value: 'Traore, John (admin)' },
    { label: 'Last updated by', value: 'Traore, John (admin)' },
]
const programDimensions = [
    { label: 'Organisation unit', value: 'Baoma Station CHP' },
    { label: 'Event status', value: 'Completed' },
    { label: 'Program status', value: 'Active' },
    {
        label: trackerProgram[DIMENSION_ID_EVENT_DATE],
        value: `${previousYear}-12-10`,
    },
    {
        label: trackerProgram[DIMENSION_ID_ENROLLMENT_DATE],
        value: `${currentYear}-01-18`,
    },
    {
        label: trackerProgram[DIMENSION_ID_INCIDENT_DATE],
        value: `${currentYear}-01-10`,
    },
]
const programDataDimensions = [
    { label: TEST_DIM_AGE, value: '1991-01-01' },
    { label: TEST_DIM_COORDINATE, value: '[-0.090380,51.538034]' },
    { label: TEST_DIM_DATE, value: `${getOffsetYearStr(32)}-12-01` },
    { label: TEST_DIM_DATETIME, value: '1991-12-01 12:00' },
    { label: TEST_DIM_EMAIL, value: 'email@address.com' },
    { label: TEST_DIM_INTEGER, value: '10' },
    { label: TEST_DIM_LONG_TEXT, value: 'Long text A' },
    { label: TEST_DIM_INTEGER_NEGATIVE, value: '-10' },
    { label: TEST_DIM_NUMBER, value: '10' },
    { label: TEST_DIM_LEGEND_SET, value: '10' },
    { label: TEST_DIM_ORG_UNIT, value: 'Ngelehun CHC' },
    { label: TEST_DIM_PERCENTAGE, value: '10' },
    { label: TEST_DIM_PHONE_NUMBER, value: '10111213' },
    { label: TEST_DIM_INTEGER_POSITIVE, value: '10' },
    { label: TEST_DIM_INTEGER_ZERO_OR_POSITIVE, value: '0' },
    { label: TEST_DIM_TEXT, value: 'Text A' },
    { label: TEST_DIM_TEXT_OPTIONSET, value: 'COVID 19 - AstraZeneca' },
    { label: TEST_DIM_TIME, value: '14:01' },
    { label: TEST_DIM_URL, value: 'https://debug.dhis2.org/tracker_dev/' },
    { label: TEST_DIM_USERNAME, value: 'admin' },
    { label: TEST_DIM_YESONLY, value: 'Yes' },
    { label: TEST_DIM_YESNO, value: 'Yes' },
]

const init = () => {
    goToStartPage()

    // remove org unit
    cy.getBySel('layout-chip-ou', EXTENDED_TIMEOUT)
        .findBySel('dimension-menu-button')
        .click()
    cy.containsExact('Remove').click()
}

describe('table', () => {
    beforeEach(init)
    it('click on column header opens the dimension dialog', () => {
        // feat: https://dhis2.atlassian.net/browse/DHIS2-11192
        programDimensions.push({
            label: trackerProgram[DIMENSION_ID_SCHEDULED_DATE],
            value: `${previousYear}-12-10`,
        })
        const dimensionName = TEST_DIM_TEXT

        selectEventWithProgramDimensions({
            ...trackerProgram,
            dimensions: [dimensionName],
        })

        const testMainDimensions = mainDimensions.map(
            (dimension) => dimension.label
        )

        const testProgramDimensions = programDimensions.map(
            (dimension) => dimension.label
        )

        // add main and time dimensions
        testMainDimensions.forEach((label) =>
            clickAddRemoveMainDimension(label)
        )
        testProgramDimensions.forEach((label) =>
            clickAddRemoveProgramDimension(label)
        )

        selectFixedPeriod({
            label: periodLabel,
            period: {
                type: 'Daily',
                year: `${getPreviousYearStr()}`,
                name: `${getPreviousYearStr()}-12-10`,
            },
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        const labels = [
            dimensionName,
            ...testMainDimensions,
            ...testProgramDimensions,
        ]

        // check the correct number of columns
        getTableHeaderCells().its('length').should('equal', labels.length)

        // check the column headers in the table
        labels.forEach((label) => {
            getTableHeaderCells()
                .contains(label)
                .scrollIntoView()
                .should('be.visible')
                .click()
            cy.getBySelLike('modal-title').contains(label)
            cy.getBySelLike('modal-action-cancel').click()
        })
    })
    it('dimensions display correct values in the visualization', () => {
        programDataDimensions.push({
            label: TEST_DIM_NUMBER_OPTIONSET,
            value: 'One',
        })
        selectEventWithProgram(trackerProgram)

        openProgramDimensionsSidebar()

        mainDimensions.forEach(({ label }) =>
            clickAddRemoveMainDimension(label)
        )

        programDimensions.forEach(({ label }) =>
            clickAddRemoveProgramDimension(label)
        )

        programDataDimensions.forEach(({ label }) =>
            clickAddRemoveProgramDataDimension(label)
        )

        selectFixedPeriod({
            label: periodLabel,
            period: {
                type: 'Daily',
                year: `${getPreviousYearStr()}`,
                name: `${getPreviousYearStr()}-12-10`,
            },
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        const allDimensions = [
            ...mainDimensions,
            ...programDimensions,
            ...programDataDimensions,
        ]

        getTableHeaderCells().its('length').should('eq', allDimensions.length)

        getTableRows().its('length').should('eq', 1)

        // assert the values of the dimensions
        allDimensions.forEach(({ value }, index) => {
            getTableDataCells().eq(index).invoke('text').should('eq', value)
        })

        // check that the URL dimension is wrapped in a link
        if (
            allDimensions.includes(
                (dimension) => dimension.label === TEST_DIM_URL
            )
        ) {
            getTableDataCells()
                .eq(
                    allDimensions.findIndex(
                        (dimension) => dimension.label === TEST_DIM_URL
                    )
                )
                .find('a')
                .should(
                    'have.attr',
                    'href',
                    allDimensions.find(
                        (dimension) => dimension.label === TEST_DIM_URL
                    ).value
                )
        }
    })
    it('data can be sorted', () => {
        // remove any DGS to allow numeric value comparison
        openStyleOptionsModal()

        cy.getBySel('dgs-select-content')
            .findBySel('dhis2-uicore-select-input')
            .click()
        cy.contains('None').click()
        clickOptionsModalUpdateButton()

        selectEventWithProgramDimensions({
            ...trackerProgram,
            dimensions: [TEST_DIM_INTEGER],
        })

        // filter empty/null values on E2E - Integer dimension
        // this helps with the value comparison when sorting
        cy.getBySelLike('layout-chip').contains(TEST_DIM_INTEGER).click()
        cy.getBySel('button-add-condition').click()
        cy.contains('Choose a condition type').click()
        cy.contains('is not empty / not null').click()
        cy.getBySel('conditions-modal').contains('Update').click()

        programDimensions
            .filter((dimension) => dimension.label === 'Organisation unit')
            .forEach(({ label }) => clickAddRemoveProgramDimension(label))

        selectRelativePeriod({
            label: periodLabel,
            period: TEST_REL_PE_THIS_YEAR,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        cy.intercept(/api\/\d+\/analytics(\S)*asc=/).as('getAnalyticsSortAsc')

        getTableHeaderCells()
            .find(`button[title*="${TEST_DIM_INTEGER}"]`)
            .click()

        // wait for table to be sorted
        cy.wait('@getAnalyticsSortAsc')

        expectTableToBeUpdated()

        getTableRows()
            .eq(0)
            .find('td')
            .eq(0)
            .invoke('text')
            .then(parseInt)
            .then(($cell0Value) =>
                getTableRows()
                    .eq(1)
                    .find('td')
                    .eq(0)
                    .invoke('text')
                    .then(parseInt)
                    .then(($cell1Value) =>
                        expect($cell0Value).to.be.lessThan($cell1Value)
                    )
            )

        cy.intercept(/api\/(\d+)\/analytics(\S)*desc=/).as(
            'getAnalyticsSortDesc'
        )

        getTableHeaderCells()
            .find(`button[title*="${TEST_DIM_INTEGER}"]`)
            .click()

        // wait for table to be sorted
        cy.wait('@getAnalyticsSortDesc')

        expectTableToBeUpdated()

        getTableRows()
            .eq(0)
            .find('td')
            .eq(0)
            .invoke('text')
            .then(parseInt)
            .then(($cell0Value) =>
                getTableRows()
                    .eq(1)
                    .find('td')
                    .eq(0)
                    .invoke('text')
                    .then(parseInt)
                    .then(($cell1Value) =>
                        expect($cell0Value).to.be.greaterThan($cell1Value)
                    )
            )
    })
})
