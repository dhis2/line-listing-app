import { EXTENDED_TIMEOUT } from '../support/util.js'

export const expectAOTitleToBeValue = (value) =>
    cy
        .getBySel('visualization-title')
        .should('have.length', 1)
        .and('be.visible')
        .and('contain', value)

const getLineListTable = () => cy.getBySel('line-list-table', EXTENDED_TIMEOUT)

export const getTableHeaderCells = () => getLineListTable().find('th')

export const getTableRows = () => getLineListTable().find('tbody').find('tr')

export const getTableDataCells = () =>
    getLineListTable().find('tbody').find('td')

export const expectTableToBeVisible = () =>
    getLineListTable().find('tbody').should('be.visible')

export const expectTableToMatchRows = (expectedRows) => {
    getTableRows().should('have.length', expectedRows.length)

    expectedRows.forEach((value) => {
        expectTableToContainValue(value)
    })
}

export const expectTableToContainHeader = (header) => {
    getTableHeaderCells().contains(header)
}

export const expectTableToContainValue = (value) => {
    getTableDataCells().contains(value)
}

export const expectTableToNotContainValue = (value) => {
    getTableDataCells().contains(value).should('not.exist')
}

export const expectLegendKeyToBeHidden = () =>
    cy.getBySel('visualization-legend-key').should('not.exist')

export const expectLegendKeyToBeVisible = () =>
    cy.getBySel('visualization-legend-key').should('be.visible')

export const expectLegedKeyToMatchLegendSets = (legendSets) => {
    cy.getBySel('legend-key-container')
        .findBySelLike('legend-key-item')
        .should('have.length', legendSets.length)
    legendSets.forEach((legendSet) =>
        cy
            .getBySel('legend-key-container')
            .findBySelLike('legend-key-item')
            .contains(legendSet)
    )
}
