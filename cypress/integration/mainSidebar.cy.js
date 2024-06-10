import {
    ACCESSORY_PANEL_DEFAULT_WIDTH,
    ACCESSORY_PANEL_MIN_WIDTH,
    ACCESSORY_PANEL_MIN_PX_AT_END,
    PRIMARY_PANEL_WIDTH,
    ARROW_LEFT_KEY,
    ARROW_RIGHT_KEY,
} from '../../src/modules/accessoryPanelConstants.js'
import { TEST_AO } from '../data/index.js'
import { goToAO } from '../helpers/common.js'
import { clickMenubarViewButton } from '../helpers/menubar.js'
import { goToStartPage } from '../helpers/startScreen.js'

describe('main sidebar panel', () => {
    it('the main sidebar can be toggled by clicking the option in the view menu', () => {
        goToStartPage()

        // Hiding
        clickMenubarViewButton()

        cy.getBySel('dhis2-uicore-hovermenulistitem')
            .contains('Hide dimensions sidebar')
            .should('be.visible')
            .click()

        cy.getBySel('main-sidebar').should('not.be.visible')

        // Showing
        clickMenubarViewButton()

        cy.getBySel('dhis2-uicore-hovermenulistitem')
            .contains('Show dimensions sidebar')
            .should('be.visible')
            .click()

        cy.getBySel('main-sidebar').should('be.visible')
    })

    it('the main sidebar can be toggled by clicking the fullscreen button', () => {
        // Fullscreen button is only visible when a visualisation is showing
        goToAO(TEST_AO.id)

        // Hiding
        cy.getBySel('fullscreen-toggler')
            .should('be.visible')
            .trigger('mouseover')

        cy.getBySel('fullscreen-toggle-tooltip-content')
            .should('be.visible')
            .and('contain', 'Expand visualization and hide panels')

        cy.getBySel('fullscreen-toggler').click()

        cy.getBySel('main-sidebar').should('not.be.visible')

        // Showing
        cy.getBySel('fullscreen-toggler')
            .should('be.visible')
            .trigger('mouseover')

        cy.getBySel('fullscreen-toggle-tooltip-content')
            .should('be.visible')
            .and('contain', 'Show panels')

        cy.getBySel('fullscreen-toggler').should('be.visible').click()

        cy.getBySel('main-sidebar').should('be.visible')
    })

    it('clicking an input in the main sidebar opens and closes the accessory panel', () => {
        // Opened by default on start page so we go to the test AO instead
        goToAO(TEST_AO.id)
        cy.getBySel('input-panel-button').click()
        cy.getBySel('accessory-sidebar')
            .should('be.visible')
            .invoke('outerWidth')
            .should('eq', ACCESSORY_PANEL_DEFAULT_WIDTH)
        cy.getBySel('input-panel-button').click()
        cy.getBySel('accessory-sidebar').should('not.be.visible')
    })
})

describe('accessory sidebar panel', () => {
    const VIEWPORT_WIDTH = Cypress.config().viewportWidth
    const DRAGHANDLE_PAGE_X_INITIAL =
        PRIMARY_PANEL_WIDTH + ACCESSORY_PANEL_DEFAULT_WIDTH
    const DRAGHANDLE_PAGE_X_MIN =
        PRIMARY_PANEL_WIDTH + ACCESSORY_PANEL_MIN_WIDTH
    const DRAGHANDLE_PAGE_X_MAX = VIEWPORT_WIDTH - ACCESSORY_PANEL_MIN_PX_AT_END

    const resizeByMouse = (movementX) => {
        cy.getBySel('accessory-panel-resize-handle')
            .trigger('mousedown')
            .trigger('mousemove', {
                pageX: DRAGHANDLE_PAGE_X_INITIAL + movementX,
                movementX: movementX,
                pageY: 800,
            })
            .trigger('mouseup')
    }

    const resizeByKeyBoard = (movementX) => {
        if (movementX % 10 !== 0) {
            throw new Error(
                'Invalid `movementX`: resizing by keyboard happens in increments of 10.'
            )
        }
        const keyPresses = Math.abs(movementX / 10)
        const key = movementX >= 0 ? ARROW_RIGHT_KEY : ARROW_LEFT_KEY

        cy.getBySel('accessory-panel-resize-handle').focus()

        for (let i = 0; i < keyPresses; i++) {
            cy.getBySel('accessory-panel-resize-handle').trigger('keydown', {
                key,
            })
        }
    }

    it('can be resized by mouse', () => {
        const movementX1 = 200
        const movementX2 = 50
        const width1 = ACCESSORY_PANEL_DEFAULT_WIDTH + movementX1
        const width2 = width1 + movementX2

        // Opened by default on start page, so we can start resizing
        goToStartPage()

        resizeByMouse(movementX1)

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', width1)

        resizeByMouse(movementX2)

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', width2)
    })
    it('cannot be resized by mouse past its min-width', () => {
        /* If width restriction was not working, this movement would make the sidebar
         * 20px narrower than the minimum */
        const movementX = DRAGHANDLE_PAGE_X_MIN - DRAGHANDLE_PAGE_X_INITIAL - 20

        goToStartPage()

        resizeByMouse(movementX)

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', ACCESSORY_PANEL_MIN_WIDTH)
    })
    it('cannot be resized by mouse past its max-width', () => {
        /* If width restriction was not working, this movement would make the sidebar
         * 20px wider than the maximum */
        const movementX = DRAGHANDLE_PAGE_X_MAX - DRAGHANDLE_PAGE_X_INITIAL + 20
        const expectedWidth =
            VIEWPORT_WIDTH - PRIMARY_PANEL_WIDTH - ACCESSORY_PANEL_MIN_PX_AT_END

        goToStartPage()

        resizeByMouse(movementX)

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', expectedWidth)
    })
    it('can be resized by keyboard', () => {
        const movementX1 = 200
        const movementX2 = 50
        const width1 = ACCESSORY_PANEL_DEFAULT_WIDTH + movementX1
        const width2 = width1 + movementX2

        // Opened by default on start page, so we can start resizing
        goToStartPage()

        resizeByKeyBoard(movementX1)

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', width1)

        /* For this test to work correctly we need to blur
         * the resize handle so it can be focussed again */
        cy.getBySel('accessory-panel-resize-handle').blur()

        resizeByKeyBoard(movementX2)

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', width2)
    })
    it('cannot be resized by keyboard past its min-width', () => {
        /* If width restriction was not working, this movement would make the sidebar
         * 20px narrower than the minimum */
        const movementX = DRAGHANDLE_PAGE_X_MIN - DRAGHANDLE_PAGE_X_INITIAL - 20

        goToStartPage()

        resizeByKeyBoard(movementX)

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', ACCESSORY_PANEL_MIN_WIDTH)
    })
    it('cannot be resized by keyboard past its max-width', () => {
        /* If width restriction was not working, this movement would make the sidebar
         * 20px wider than the maximum */
        const movementX = DRAGHANDLE_PAGE_X_MAX - DRAGHANDLE_PAGE_X_INITIAL + 20
        const expectedWidth =
            VIEWPORT_WIDTH - PRIMARY_PANEL_WIDTH - ACCESSORY_PANEL_MIN_PX_AT_END

        goToStartPage()

        resizeByKeyBoard(movementX)

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', expectedWidth)
    })
    it('can be reset using the view menu', () => {
        const movementX = 200
        const expectedWidthAfterResize =
            ACCESSORY_PANEL_DEFAULT_WIDTH + movementX
        const expectedWidthAfterReset = ACCESSORY_PANEL_DEFAULT_WIDTH

        goToStartPage()
        resizeByMouse(movementX)

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', expectedWidthAfterResize)

        clickMenubarViewButton()
        cy.getBySel('dhis2-uicore-hovermenulistitem')
            .contains('Reset sidebar width')
            .should('be.visible')
            .click()

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', expectedWidthAfterReset)
    })
    it('reset button is disabled when sidebar has default size', () => {
        goToStartPage()

        clickMenubarViewButton()
        cy.getBySel('dhis2-uicore-hovermenulistitem')
            .contains('Reset sidebar width')
            .parent()
            .should('have.class', 'disabled')
    })
    it('adjusts the panel width on window resize if too large', () => {
        const viewPortHeight = Cypress.config().viewportHeight
        const viewportDecrease = 200
        const newViewPortWidth = VIEWPORT_WIDTH - viewportDecrease
        const movementX = DRAGHANDLE_PAGE_X_MAX - DRAGHANDLE_PAGE_X_INITIAL
        const increasedWidth =
            VIEWPORT_WIDTH - PRIMARY_PANEL_WIDTH - ACCESSORY_PANEL_MIN_PX_AT_END

        goToStartPage()
        resizeByMouse(movementX)
        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', increasedWidth)

        cy.viewport(newViewPortWidth, viewPortHeight)

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', increasedWidth - viewportDecrease)
    })
    it('mouse resizing works after keyboard resize without blurring the resize handle', () => {
        const keyboardMovementX = 100
        const mouseMovementX = 100
        const keyboardResizedWidth =
            ACCESSORY_PANEL_DEFAULT_WIDTH + keyboardMovementX
        const mouseResizedWidth = keyboardResizedWidth + mouseMovementX

        // Opened by default on start page, so we can start resizing
        goToStartPage()

        resizeByKeyBoard(keyboardMovementX)

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', keyboardResizedWidth)

        // No blur will occur!!
        resizeByMouse(mouseMovementX)

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', mouseResizedWidth)
    })
})
