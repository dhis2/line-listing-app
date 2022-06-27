import { AXIS_ID_COLUMNS, AXIS_ID_FILTERS } from '@dhis2/analytics'
import {
    expectAxisToHaveDimension,
    expectAxisToNotHaveDimension,
} from '../helpers/layout.js'
import { goToStartPage } from '../helpers/startScreen.js'

describe('using the main sidebar context menu', () => {
    const TEST_DIM_ID = 'eventDate'
    const openContextMenu = () =>
        cy
            .getBySel('time-dimensions-sidebar')
            .getBySel('time-dimensions-sidebar')
            .findBySel('dimension-menu-button')
            .eq(0) // eventDate dimension
            .invoke('attr', 'style', 'visibility: initial')
            .click()

    it('adds item', () => {
        goToStartPage()

        expectAxisToNotHaveDimension(AXIS_ID_COLUMNS, TEST_DIM_ID)
        expectAxisToNotHaveDimension(AXIS_ID_FILTERS, TEST_DIM_ID)

        openContextMenu()
        cy.contains('Add to Columns').click()
        expectAxisToHaveDimension(AXIS_ID_COLUMNS, TEST_DIM_ID)
        expectAxisToNotHaveDimension(AXIS_ID_FILTERS, TEST_DIM_ID)
    })
    it('moves item', () => {
        openContextMenu()
        cy.contains('Move to Filter').click()
        expectAxisToHaveDimension(AXIS_ID_FILTERS, TEST_DIM_ID)
        expectAxisToNotHaveDimension(AXIS_ID_COLUMNS, TEST_DIM_ID)
    })
    it('removes item', () => {
        openContextMenu()
        cy.containsExact('Remove').click()
        expectAxisToNotHaveDimension(AXIS_ID_COLUMNS, TEST_DIM_ID)
        expectAxisToNotHaveDimension(AXIS_ID_FILTERS, TEST_DIM_ID)
    })
})

// TODO:

// describe('using the dimension list context menu', () => {

// describe('using the layout chip context menu', () => {
