import {
    selectProgramDimensions,
    INPUT_EVENT,
    selectPeriod,
    FIXED,
    getPreviousYearStr,
    getLineListTable,
} from '../../helpers/index.js'
import { EXTENDED_TIMEOUT } from '../../support/util.js'

const dimensionName = 'MCH BCG dose'
const periodLabel = 'Report date'

const setUpTable = () => {
    selectProgramDimensions({
        inputType: INPUT_EVENT,
        programName: 'Child Programme',
        stageName: 'Birth',
        dimensions: [dimensionName],
    })

    selectPeriod({
        periodLabel,
        category: FIXED,
        period: {
            type: 'Daily',
            year: `${getPreviousYearStr()}`,
            name: `${getPreviousYearStr()}-01-01`,
        },
    })

    cy.getWithDataTest('{menubar}').contains('Update').click()

    getLineListTable().find('tbody').should('be.visible')
}

const addConditions = (conditions) => {
    cy.getWithDataTest('{layout-chip}').contains(dimensionName).click()
    conditions.forEach((conditionName) => {
        cy.getWithDataTest('{conditions-modal-content}')
            .findWithDataTest('{dhis2-uicore-checkbox}')
            .contains(conditionName)
            .click()
    })
    cy.getWithDataTest('{conditions-modal}').contains('Update').click()
}

const assertTableMatchesExpectedRows = (expectedRows) => {
    getLineListTable()
        .find('tbody > tr')
        .should('have.length', expectedRows.length)

    expectedRows.forEach((val) => {
        getLineListTable().find('tbody').contains('td', val)
    })
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

    it('Yes only', () => {
        addConditions(['Yes'])

        assertTableMatchesExpectedRows([
            'Baiwala CHP',
            'Banka Makuloh MCHP',
            'Conakry Dee CHC',
            'Dankawalie MCHP',
            'Feiba CHP',
            'Gao MCHP',
            'Gbainty Wallah CHP',
            'Holy Mary Clinic',
            'Jormu MCHP',
            'Looking Town MCHP',
            'Kangama (Kangama) CHP',
            'Kochero MCHP',
            'Kuntorloh CHP',
            'Mamusa MCHP',
            'Mano Menima CHP',
            'Maselleh MCHP',
            'Mokotawa CHP',
            'Mosenessie Junction MCHP',
            'SLC. RHC Port Loko',
            'Tombo Wallah CHP',
            'Woroma CHP',
            'Yoyema MCHP',
        ])

        cy.getWithDataTest('{layout-chip}')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries(['Program stage: Birth', /\bYes\b/])
    })

    it('No only', () => {
        addConditions(['No'])

        assertTableMatchesExpectedRows([
            'Bandajuma Sinneh MCHP',
            'Masankorie CHP',
            'Ngiewahun CHP',
            'Niagorehun CHP',
            'Niagorehun MCHP',
            'Menika MCHP',
            'Seria MCHP',
            'Sienga CHP',
            'Woama MCHP',
            'Yorgbofore MCHP',
        ])

        cy.getWithDataTest('{layout-chip}')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries(['Program stage: Birth', /\bNo\b/])
    })

    it('Yes and Not answered', () => {
        addConditions(['Yes', 'Not answered'])

        assertTableMatchesExpectedRows([
            'Baiwala CHP',
            'Banka Makuloh MCHP',
            'Conakry Dee CHC',
            'Dankawalie MCHP',
            'Feiba CHP',
            'Gao MCHP',
            'Gbainty Wallah CHP',
            'Holy Mary Clinic',
            'Jormu MCHP',
            'Looking Town MCHP',
            'Kangama (Kangama) CHP',
            'Kochero MCHP',
            'Kuntorloh CHP',
            'Mamusa MCHP',
            'Mano Menima CHP',
            'Maselleh MCHP',
            'Mokotawa CHP',
            'Mosenessie Junction MCHP',
            'Ngelehun CHC',
            'SLC. RHC Port Loko',
            'Tombo Wallah CHP',
            'Woroma CHP',
            'Yoyema MCHP',
        ])

        cy.getWithDataTest('{layout-chip}')
            .contains(`${dimensionName}: 2 conditions`)
            .trigger('mouseover')

        assertTooltipContainsEntries([
            'Program stage: Birth',
            /\bYes\b/,
            /\bNot answered\b/,
        ])
    })
})
