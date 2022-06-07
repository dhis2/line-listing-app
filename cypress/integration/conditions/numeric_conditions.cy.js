import {
    selectProgramDimensions,
    selectPeriod,
    INPUT_EVENT,
    FIXED,
    getPreviousYearStr,
    getLineListTable,
} from '../../helpers/index.js'
import { EXTENDED_TIMEOUT } from '../../support/util.js'

const dimensionName = 'MCH Weight (g)'

const setUpTable = () => {
    selectProgramDimensions({
        inputType: INPUT_EVENT,
        programName: 'Child Programme',
        stageName: 'Birth',
        dimensions: [dimensionName],
    })

    selectPeriod({
        periodLabel: 'Report date',
        category: FIXED,
        period: {
            type: 'Daily',
            year: `${getPreviousYearStr()}`,
            name: `${getPreviousYearStr()}-01-01`,
        },
    })

    cy.getWithDataTest('{menubar}').contains('Update').click()

    getLineListTable().find('tbody').should('be.visible')

    cy.getWithDataTest('{layout-chip}').contains(`${dimensionName}: all`)
}

const addConditions = (conditions) => {
    cy.getWithDataTest('{layout-chip}').contains(dimensionName).click()
    conditions.forEach(({ conditionName, value }) => {
        cy.getWithDataTest('{button-add-condition}').click()
        cy.contains('Choose a condition').click()
        cy.contains(conditionName).click()
        if (value) {
            cy.getWithDataTest('{conditions-modal-content}')
                .find('input[value=""]')
                .type(value)
        }
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

describe('number conditions', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)
        setUpTable()
    })
    it('equal to', () => {
        addConditions([{ conditionName: 'equal to (=)', value: '1232' }])
        assertTableMatchesExpectedRows(['1 232'])

        cy.getWithDataTest('{layout-chip}')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([
            'Program stage: Birth',
            'Equal to (=): 1 232',
        ])
    })

    it('greater than', () => {
        addConditions([{ conditionName: 'greater than (>)', value: '3980' }])

        assertTableMatchesExpectedRows(['3 988', '3 999'])

        cy.getWithDataTest('{layout-chip}')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([
            'Program stage: Birth',
            'Greater than (>): 3 980',
        ])
    })

    it('greater than or equal to', () => {
        addConditions([
            { conditionName: 'greater than or equal to', value: '3980' },
        ])
        assertTableMatchesExpectedRows(['3 988', '3 980', '3 999'])

        cy.getWithDataTest('{layout-chip}')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([
            'Program stage: Birth',
            'Greater than or equal to (≥): 3 980',
        ])
    })

    it('less than', () => {
        addConditions([{ conditionName: 'less than (<)', value: '2615' }])
        assertTableMatchesExpectedRows(['1 232', '2 561'])

        cy.getWithDataTest('{layout-chip}')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([
            'Program stage: Birth',
            'Less than (<): 2 615',
        ])
    })

    it('less than or equal to', () => {
        addConditions([
            { conditionName: 'less than or equal to', value: '2615' },
        ])
        assertTableMatchesExpectedRows(['1 232', '2 561', '2 615'])

        cy.getWithDataTest('{layout-chip}')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([
            'Program stage: Birth',
            'Less than or equal to (≤): 2 615',
        ])
    })

    it('not equal to', () => {
        addConditions([{ conditionName: 'not equal to', value: '1232' }])

        assertTableMatchesExpectedRows([
            '2 561',
            '2 615',
            '2 627',
            '2 664',
            '2 721',
            '2 741',
            '2 744',
            '2 779',
            '2 869',
            '2 968',
            '3 044',
            '3 058',
            '3 163',
            '3 168',
            '3 187',
            '3 216',
            '3 240',
            '3 303',
            '3 355',
            '3 400',
            '3 406',
            '3 418',
            '3 673',
            '3 730',
            '3 765',
            '3 807',
            '3 867',
            '3 921',
            '3 952',
            '3 980',
            '3 988',
            '3 999',
        ])

        cy.getWithDataTest('{layout-chip}')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([
            'Program stage: Birth',
            'Not equal to (≠): 1 232',
        ])
    })

    it('is empty / null', () => {
        addConditions([{ conditionName: 'is empty / null' }])

        getLineListTable().find('tbody > tr').should('have.length', 1)

        getLineListTable()
            .find('tbody td')
            .eq(1)
            .invoke('text')
            .invoke('trim')
            .should('equal', '')

        cy.getWithDataTest('{layout-chip}')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([
            'Program stage: Birth',
            'Is empty / null',
        ])
    })

    it('is not empty / not null', () => {
        addConditions([{ conditionName: 'is not empty / not null' }])

        assertTableMatchesExpectedRows([
            '1 232',
            '2 561',
            '2 615',
            '2 627',
            '2 664',
            '2 721',
            '2 741',
            '2 744',
            '2 779',
            '2 869',
            '2 968',
            '3 044',
            '3 058',
            '3 163',
            '3 168',
            '3 187',
            '3 216',
            '3 240',
            '3 303',
            '3 355',
            '3 400',
            '3 406',
            '3 418',
            '3 673',
            '3 730',
            '3 765',
            '3 807',
            '3 867',
            '3 921',
            '3 952',
            '3 980',
            '3 988',
            '3 999',
        ])

        cy.getWithDataTest('{layout-chip}')
            .contains(`${dimensionName}: 1 condition`)
            .trigger('mouseover')

        assertTooltipContainsEntries([
            'Program stage: Birth',
            'Is not empty / not null',
        ])
    })

    it('2 conditions: greater than and less than', () => {
        addConditions([
            { conditionName: 'greater than (>)', value: '2615' },
            { conditionName: 'less than (<)', value: '2700' },
        ])

        assertTableMatchesExpectedRows(['2 627', '2 664'])

        cy.getWithDataTest('{layout-chip}')
            .contains(`${dimensionName}: 2 conditions`)
            .trigger('mouseover')

        assertTooltipContainsEntries([
            'Program stage: Birth',
            'Greater than (>): 2 615',
            'Less than (<): 2 700',
        ])
    })
})
