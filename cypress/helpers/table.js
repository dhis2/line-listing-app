import { EXTENDED_TIMEOUT } from '../support/util.js'

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

export const expectTableToContainValue = (value) => {
    getTableDataCells().contains(value)
}

export const expectTableToNotContainValue = (value) => {
    getTableDataCells().contains(value).should('not.exist')
}
