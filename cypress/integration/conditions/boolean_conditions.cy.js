import { EXTENDED_TIMEOUT } from '../../support/util.js'

const previousYearStr = (new Date().getFullYear() - 1).toString()

const dimensionName = 'MCH BCG dose'

const setUpTable = () => {
    cy.getWithDataTest('{main-sidebar}').contains('Program dimensions').click()
    cy.contains('Choose a program').click()
    cy.contains('Child Programme').click()
    cy.contains('Stage').click()
    cy.contains('Birth').click()

    // add the dimension
    cy.getWithDataTest('{program-dimension-list}')
        .contains(dimensionName)
        .click()
    cy.contains('Add to Columns').click()

    // close the program dimensions panel
    cy.getWithDataTest('{main-sidebar}').contains('Program dimensions').click()

    // choose a limited period - single day
    cy.contains('Report date').click()
    cy.contains('Choose from presets').click()
    cy.contains('Fixed periods').click()
    cy.getWithDataTest(
        '{period-dimension-fixed-period-filter-period-type-content}'
    ).click()
    cy.contains('Daily').click()
    cy.getWithDataTest('{period-dimension-fixed-period-filter-year-content}')
        .clear()
        .type(previousYearStr)
    cy.contains(`${previousYearStr}-01-01`).dblclick()
    cy.contains('Add to Columns').click()

    cy.getWithDataTest('{app-menubar}').contains('Update').click()

    cy.getWithDataTest('{line-list-table}', EXTENDED_TIMEOUT)
        .find('tbody')
        .find('tr')
        .then((row) => {
            expect(row.length).to.equal(34)
        })
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
        .each(($el, index) => {
            cy.wrap($el)
                .find('td')
                .eq(0)
                .should('contain', expectedRows[index][0])
            cy.wrap($el)
                .find('td')
                .eq(1)
                .should('contain', expectedRows[index][1])
        })
}

describe('boolean conditions', () => {
    it('only Yes', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
        addConditions(['Yes'])

        assertTableMatchesExpectedRows([
            ['Feiba CHP', 'Yes'],
            ['Mosenessie Junction MCHP', 'Yes'],
            ['Holy Mary Clinic', 'Yes'],
            ['Conakry Dee CHC', 'Yes'],
            ['Gbainty Wallah CHP', 'Yes'],
            ['Banka Makuloh MCHP', 'Yes'],
            ['Maselleh MCHP', 'Yes'],
            ['Tombo Wallah CHP', 'Yes'],
            ['Kuntorloh CHP', 'Yes'],
            ['Mamusa MCHP', 'Yes'],
            ['Dankawalie MCHP', 'Yes'],
            ['Kangama (Kangama) CHP', 'Yes'],
            ['Kochero MCHP', 'Yes'],
            ['Yoyema MCHP', 'Yes'],
            ['Mokotawa CHP', 'Yes'],
            ['Gao MCHP', 'Yes'],
            ['Baiwala CHP', 'Yes'],
            ['Mano Menima CHP', 'Yes'],
            ['SLC. RHC Port Loko', 'Yes'],
            ['Woroma CHP', 'Yes'],
            ['Jormu MCHP', 'Yes'],
            ['Looking Town MCHP', 'Yes'],
        ])
    })

    it('only No', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
        addConditions(['No'])

        assertTableMatchesExpectedRows([
            ['Niagorehun CHP', 'No'],
            ['Masankorie CHP', 'No'],
            ['Bandajuma Sinneh MCHP', 'No'],
            ['Niagorehun MCHP', 'No'],
            ['Yorgbofore MCHP', 'No'],
            ['Woama MCHP', 'No'],
            ['Menika MCHP', 'No'],
            ['Ngiewahun CHP', 'No'],
            ['Sienga CHP', 'No'],
            ['Seria MCHP', 'No'],
        ])
    })

    it('No and Not answered', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
        addConditions(['No', 'Not answered'])

        assertTableMatchesExpectedRows([
            ['Ngelehun CHC', 'Not answered'],
            ['Ngelehun CHC', 'Not answered'],
            ['Niagorehun CHP', 'No'],
            ['Masankorie CHP', 'No'],
            ['Bandajuma Sinneh MCHP', 'No'],
            ['Niagorehun MCHP', 'No'],
            ['Yorgbofore MCHP', 'No'],
            ['Woama MCHP', 'No'],
            ['Menika MCHP', 'No'],
            ['Ngiewahun CHP', 'No'],
            ['Sienga CHP', 'No'],
            ['Seria MCHP', 'No'],
        ])
    })
})
