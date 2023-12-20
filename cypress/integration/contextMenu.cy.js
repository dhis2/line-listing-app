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

    it('moves item from columns to filters', () => {
        cy.setTestDescription(
            'Tests the functionality of moving an item from the columns axis to the filters axis using the context menu.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'LayoutContextMenu' },
            { key: 'action', value: 'MoveItemToFilter' },
        ])
        goToStartPage()

        expectAxisToHaveDimension(AXIS_ID_COLUMNS, TEST_DIM_ID)
        expectAxisToNotHaveDimension(AXIS_ID_FILTERS, TEST_DIM_ID)

        openContextMenu(TEST_DIM_ID)
        cy.contains('Move to Filter').click()
        expectAxisToHaveDimension(AXIS_ID_FILTERS, TEST_DIM_ID)
        expectAxisToNotHaveDimension(AXIS_ID_COLUMNS, TEST_DIM_ID)
    })
    it('removes item from layout', () => {
        cy.setTestDescription(
            'Validates the removal of an item from the layout using the context menu.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'LayoutContextMenu' },
            { key: 'action', value: 'RemoveItemFromLayout' },
        ])
        goToStartPage()
        openContextMenu(TEST_DIM_ID)
        cy.containsExact('Remove').click()
        expectAxisToNotHaveDimension(AXIS_ID_COLUMNS, TEST_DIM_ID)
        expectAxisToNotHaveDimension(AXIS_ID_FILTERS, TEST_DIM_ID)
    })
})
