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
    TEST_DIM_POSITIVE_INTEGER,
    TEST_DIM_NEGATIVE_INTEGER,
    TEST_DIM_POSITIVE_OR_ZERO,
    TEST_DIM_YESNO,
    TEST_DIM_YESONLY,
    TEST_DIM_DATE,
    TEST_DIM_TIME,
    TEST_DIM_DATETIME,
    TEST_DIM_AGE,
    TEST_DIM_ORG_UNIT,
    TEST_DIM_COORDINATE,
    TEST_DIM_LEGEND_SET,
} from '../data/index.js'
import {
    selectEventProgram,
    selectEventProgramDimensions,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectFixedPeriod, getPreviousYearStr } from '../helpers/period.js'
import {
    getTableRows,
    getTableHeaderCells,
    expectTableToBeVisible,
    getTableDataCells,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const event = E2E_PROGRAM
const periodLabel = event[DIMENSION_ID_EVENT_DATE]

const mainAndTimeDimensions = [
    { label: 'Organisation unit', value: 'Baoma Station CHP' },
    { label: 'Event status', value: 'Completed' },
    { label: 'Program status', value: 'Active' },
    { label: 'Created by', value: 'Traore, John (admin)' },
    { label: 'Last updated by', value: 'Traore, John (admin)' },
    { label: event[DIMENSION_ID_EVENT_DATE], value: '2021-12-10' },
    { label: event[DIMENSION_ID_ENROLLMENT_DATE], value: '2022-01-18' },
    { label: event[DIMENSION_ID_INCIDENT_DATE], value: '2022-01-10' },
    { label: event[DIMENSION_ID_LAST_UPDATED], value: '2022-11-18 03:19' },
]
const programDimensions = [
    { label: TEST_DIM_AGE, value: '2021-01-01' },
    { label: TEST_DIM_COORDINATE, value: '[-0.090380,51.538034]' },
    { label: TEST_DIM_DATE, value: '2021-12-01' },
    { label: TEST_DIM_DATETIME, value: '2021-12-01 12:00' },
    { label: TEST_DIM_EMAIL, value: 'email@address.com' },
    { label: TEST_DIM_INTEGER, value: '10' },
    { label: TEST_DIM_LONG_TEXT, value: 'Long text A' },
    { label: TEST_DIM_NEGATIVE_INTEGER, value: '-10' },
    { label: TEST_DIM_NUMBER, value: '10' },
    { label: TEST_DIM_LEGEND_SET, value: '10' },
    { label: TEST_DIM_ORG_UNIT, value: 'Ngelehun CHC' },
    { label: TEST_DIM_PERCENTAGE, value: '10' },
    { label: TEST_DIM_PHONE_NUMBER, value: '10111213' },
    { label: TEST_DIM_POSITIVE_INTEGER, value: '10' },
    { label: TEST_DIM_POSITIVE_OR_ZERO, value: '0' },
    { label: TEST_DIM_TEXT, value: 'Text A' },
    { label: 'E2E - Text (option set)', value: 'COVID 19 - AstraZeneca' },
    { label: TEST_DIM_TIME, value: '14:01' },
    { label: TEST_DIM_URL, value: 'https://debug.dhis2.org/tracker_dev/' },
    { label: TEST_DIM_USERNAME, value: 'admin' },
    { label: TEST_DIM_YESONLY, value: 'Yes' },
    { label: TEST_DIM_YESNO, value: 'Yes' },
]

const assertColumnHeaders = () => {
    const dimensionName = TEST_DIM_TEXT

    selectEventProgramDimensions({
        ...event,
        dimensions: [dimensionName],
    })

    const testDimensions = mainAndTimeDimensions.map(
        (dimension) => dimension.label
    )

    // add main and time dimensions
    testDimensions.forEach((label) => {
        cy.getBySel('main-sidebar')
            .contains(label)
            .closest(`[data-test*="dimension-item"]`)
            .findBySel('dimension-menu-button')
            .invoke('attr', 'style', 'visibility: initial')
            .click()

        cy.contains('Add to Columns').click()
    })

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

    const labels = [dimensionName, ...testDimensions]

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
}

const assertDimensions = () => {
    selectEventProgram(event)

    mainAndTimeDimensions.forEach(({ label }) => {
        cy.getBySel('main-sidebar')
            .contains(label)
            .closest(`[data-test*="dimension-item"]`)
            .findBySel('dimension-menu-button')
            .invoke('attr', 'style', 'visibility: initial')
            .click()

        cy.containsExact('Add to Columns').click()
    })

    programDimensions.forEach(({ label }) => {
        cy.getBySel('program-dimensions-list')
            .contains(label)
            .closest(`[data-test*="dimension-item"]`)
            .findBySel('dimension-menu-button')
            .invoke('attr', 'style', 'visibility: initial')
            .click()

        cy.containsExact('Add to Columns').click()
    })

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

    const allDimensions = [...mainAndTimeDimensions, ...programDimensions]

    getTableHeaderCells().its('length').should('eq', allDimensions.length)

    getTableRows().its('length').should('eq', 1)

    // assert the values of the dimensions
    allDimensions.forEach(({ value }, index) => {
        getTableDataCells().eq(index).invoke('text').should('eq', value)
    })

    // check that the URL dimension is wrapped in a link
    if (
        allDimensions.includes((dimension) => dimension.label === TEST_DIM_URL)
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
}

const init = () => {
    cy.visit('/', EXTENDED_TIMEOUT)

    // remove org unit
    cy.getBySel('layout-chip-ou', EXTENDED_TIMEOUT)
        .findBySel('dimension-menu-button')
        .click()
    cy.containsExact('Remove').click()
}

describe(['<40'], 'table', () => {
    beforeEach(init)
    it('click on column header opens the dimension dialog', () => {
        programDimensions.push({
            label: 'E2E - Number (option set)',
            value: '1',
        })
        assertColumnHeaders()
    })
    it('dimensions display correct values in the visualization', () => {
        assertDimensions()
    })
})

describe(['>=40'], 'table', () => {
    beforeEach(init)
    it('click on column header opens the dimension dialog', () => {
        // feat: https://dhis2.atlassian.net/browse/DHIS2-11192
        mainAndTimeDimensions.push({
            label: event[DIMENSION_ID_SCHEDULED_DATE],
            value: '2021-11-01',
        })
        // bug: https://dhis2.atlassian.net/browse/DHIS2-13872
        programDimensions.push({
            label: 'E2E - Number (option set)',
            value: 'one',
        })
        assertColumnHeaders()
    })
    it('dimensions display correct values in the visualization', () => {
        assertDimensions()
    })
})
