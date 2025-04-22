import { EXTENDED_TIMEOUT } from '../support/util.js'

export const expectAOTitleToContain = (value) =>
    cy
        .getBySel('titlebar')
        .should('have.length', 1)
        .and('be.visible')
        .and('contain', value)

export const expectAOTitleToContainExact = (value) =>
    cy
        .getBySel('titlebar')
        .containsExact(value)
        .should('have.length', 1)
        .and('be.visible')

const getLineListTable = () => cy.getBySel('line-list-table', EXTENDED_TIMEOUT)

export const getTableHeaderCells = () => getLineListTable().find('th')

export const getTableRows = () => getLineListTable().find('tbody').find('tr')

export const getTableDataCells = () =>
    getLineListTable().find('tbody').find('td')

export const expectTableToBeVisible = () =>
    getLineListTable().find('tbody').should('be.visible')

export const expectTableToBeUpdated = () =>
    cy.getBySel('line-list-fetch-container').should(($div) => {
        const className = $div[0].className

        expect(className).to.not.match(/Visualization_fetching*/)
    })

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

export const expectLegendKeyToMatchLegendSets = (legendSets) => {
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
