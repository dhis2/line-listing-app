import { EXTENDED_TIMEOUT } from '../support/util.js'

const getLineListTable = () =>
    cy.getWithDataTest('{line-list-table}', EXTENDED_TIMEOUT)

export { getLineListTable }
