import { AXIS_ID_COLUMNS, AXIS_ID_FILTERS } from '@dhis2/analytics'
import {
    expectAxisToHaveDimension,
    expectAxisToNotHaveDimension,
} from '../helpers/layout.js'
import { goToStartPage } from '../helpers/startScreen.js'

describe('using the layout chip context menu', () => {
    const TEST_DIM_ID = 'ou'
    const openContextMenu = (id) =>
        cy
            .getBySel(`layout-chip-${id}`)
            .findBySel('dimension-menu-button')
            .click()

    it('moves item', () => {
        goToStartPage()

        expectAxisToHaveDimension(AXIS_ID_COLUMNS, TEST_DIM_ID)
        expectAxisToNotHaveDimension(AXIS_ID_FILTERS, TEST_DIM_ID)

        openContextMenu(TEST_DIM_ID)
        cy.contains('Move to Filter').click()
        expectAxisToHaveDimension(AXIS_ID_FILTERS, TEST_DIM_ID)
        expectAxisToNotHaveDimension(AXIS_ID_COLUMNS, TEST_DIM_ID)
    })
    it('removes item', () => {
        openContextMenu(TEST_DIM_ID)
        cy.containsExact('Remove').click()
        expectAxisToNotHaveDimension(AXIS_ID_COLUMNS, TEST_DIM_ID)
        expectAxisToNotHaveDimension(AXIS_ID_FILTERS, TEST_DIM_ID)
    })
})
