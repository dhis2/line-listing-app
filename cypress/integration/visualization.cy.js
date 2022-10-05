import {
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_LAST_UPDATED,
} from '../../src/modules/dimensionConstants.js'
import {
    ANALYTICS_PROGRAM,
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
import { selectEventProgram } from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectFixedPeriod } from '../helpers/period.js'
import {
    getTableRows,
    getTableHeaderCells,
    expectTableToBeVisible,
    getTableDataCells,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'
import { getPreviousYearStr } from '../helpers/period.js'

const event = ANALYTICS_PROGRAM
const mainAndTimeDimensions = [
    { label: 'Organisation unit', value: 'PHW Phongsali' },
    { label: 'Event status', value: 'Completed' },
    { label: 'Program status', value: 'Active' },
    { label: 'Created by', value: 'admin' },
    { label: 'Last updated by', value: 'admin' },
    { label: event[DIMENSION_ID_EVENT_DATE], value: '2021-12-10' },
    { label: event[DIMENSION_ID_ENROLLMENT_DATE], value: '2021-12-01' },
    { label: event[DIMENSION_ID_SCHEDULED_DATE], value: '2021-11-01' },
    { label: event[DIMENSION_ID_INCIDENT_DATE], value: '2021-11-01' },
    { label: event[DIMENSION_ID_LAST_UPDATED], value: '2022-02-18 02:20' },
]
const programDimensions = [
    { label: TEST_DIM_AGE, value: '2021-01-01 00:00:00.0' },
    { label: TEST_DIM_COORDINATE, value: '[-0.134318,51.509894]' },
    { label: TEST_DIM_DATE, value: '2021-12-01' },
    { label: TEST_DIM_DATETIME, value: '2021-12-01 12:00' },
    { label: TEST_DIM_EMAIL, value: 'email@address.com' },
    { label: TEST_DIM_INTEGER, value: '10' },
    { label: TEST_DIM_LONG_TEXT, value: 'Long text A' },
    { label: TEST_DIM_NEGATIVE_INTEGER, value: '-10' },
    { label: TEST_DIM_NUMBER, value: '10' },
    { label: TEST_DIM_LEGEND_SET, value: '10' },
    { label: 'Analytics - Number (option set)', value: '1' }, // FIXME: should be 'one'
    { label: TEST_DIM_ORG_UNIT, value: 'PHW Phongsali' },
    { label: TEST_DIM_PERCENTAGE, value: '10' },
    { label: TEST_DIM_PHONE_NUMBER, value: '10111213' },
    { label: TEST_DIM_POSITIVE_INTEGER, value: '10' },
    { label: TEST_DIM_POSITIVE_OR_ZERO, value: '0' },
    { label: TEST_DIM_TEXT, value: 'Text A' },
    { label: 'Analytics - Text (option set)', value: 'COVID 19-AstraZeneca' },
    { label: TEST_DIM_TIME, value: '14:01' },
    { label: TEST_DIM_URL, value: 'https://debug.dhis2.org/tracker_dev/' },
    { label: TEST_DIM_USERNAME, value: 'admin' },
    { label: TEST_DIM_YESONLY, value: 'Yes' },
    { label: TEST_DIM_YESNO, value: 'Yes' },
]

describe('visualization', () => {
    it('dimensions display correct values in the visualization', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        selectEventProgram(event)

        // remove org unit
        cy.getBySel('layout-chip-ou').findBySel('dimension-menu-button').click()
        cy.containsExact('Remove').click()

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
            label: event[DIMENSION_ID_EVENT_DATE],
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
    })
})
