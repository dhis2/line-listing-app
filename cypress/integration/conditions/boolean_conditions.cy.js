import {
    addProgramDimensions,
    INPUT_EVENT,
    choosePeriod,
    FIXED,
    getPreviousYearStr,
} from '../../helpers/index.js'
import { EXTENDED_TIMEOUT } from '../../support/util.js'

const dimensionName = 'MCH BCG dose'

const setUpTable = () => {
    addProgramDimensions({
        inputType: INPUT_EVENT,
        programName: 'Child Programme',
        stageName: 'Birth',
        dimensions: [dimensionName],
    })

    choosePeriod({
        periodLabel: 'Report date',
        category: FIXED,
        period: {
            type: 'Daily',
            year: `${getPreviousYearStr()}`,
            name: `${getPreviousYearStr()}-01-01`,
        },
    })

    cy.getWithDataTest('{menubar}').contains('Update').click()

    cy.getWithDataTest('{line-list-table}', EXTENDED_TIMEOUT)
        .find('tbody')
        .should('be.visible')
}

const addConditions = (conditions) => {
    cy.getWithDataTest('{layout-chip}').contains(dimensionName).click()
    conditions.forEach((conditionName) => {
        cy.get('label').contains(conditionName).click()
    })
    cy.getWithDataTest('{conditions-modal}').contains('Update').click()
}

const assertTableMatchesExpectedRows = (expectedRows) => {
    cy.getWithDataTest('{line-list-table}', EXTENDED_TIMEOUT)
        .find('tbody > tr')
        .should('have.length', expectedRows.length)

    expectedRows.forEach((val) => {
        cy.getWithDataTest('{line-list-table}', EXTENDED_TIMEOUT)
            .find('tbody')
            .contains('td', val)
    })
}

const assertTooltipContainsEntries = (entries) => {
    entries.forEach((entry) =>
        cy.getWithDataTest('{tooltip-content}').contains(entry)
    )
}

describe('boolean conditions', () => {
    it('Yes only', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
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
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
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
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
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
            'Ngelehun CHC', //there are 2
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
