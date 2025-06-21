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

    const getMouseMoveOptions = (
        movementX,
        previousX = DRAGHANDLE_PAGE_X_INITIAL
    ) => ({
        pageX: previousX + movementX,
        movementX: movementX,
        pageY: 400,
    })

    const resizeByMouse = (movementX) => {
        cy.getBySel('accessory-panel-resize-handle')
            .trigger('mousedown')
            .trigger('mousemove', getMouseMoveOptions(movementX))
            .trigger('mouseup')
    }

    const resizeByKeyBoard = (movementX, shouldBlur = true) => {
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

        if (shouldBlur) {
            /* For this test to work correctly we need to blur
             * the resize handle so it can be focussed again */
            cy.getBySel('accessory-panel-resize-handle').blur()
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

        // Do not mouseup because we want to move some more
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
    it('ignores out-of-bounds mouse movements past the min-width edge', () => {
        const movementX = DRAGHANDLE_PAGE_X_MIN - DRAGHANDLE_PAGE_X_INITIAL

        goToStartPage()

        // Resize to min width, without mouseup
        cy.getBySel('accessory-panel-resize-handle')
            .trigger('mousedown')
            .trigger('mousemove', getMouseMoveOptions(movementX))
        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', ACCESSORY_PANEL_MIN_WIDTH)

        // Mousemove 20px left past min-width, width should remain the same
        cy.getBySel('accessory-panel-resize-handle').trigger(
            'mousemove',
            getMouseMoveOptions(-20, DRAGHANDLE_PAGE_X_MIN)
        )
        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', ACCESSORY_PANEL_MIN_WIDTH)

        // Now 10 px right, still on lefthand side of min width, so width should remain the same
        cy.getBySel('accessory-panel-resize-handle').trigger(
            'mousemove',
            getMouseMoveOptions(10, DRAGHANDLE_PAGE_X_MIN - 20)
        )
        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', ACCESSORY_PANEL_MIN_WIDTH)

        // Now another 20 px right, which puts us 10px to the right of min-width, width should increase 10px
        cy.getBySel('accessory-panel-resize-handle').trigger(
            'mousemove',
            getMouseMoveOptions(20, DRAGHANDLE_PAGE_X_MIN - 10)
        )
        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', ACCESSORY_PANEL_MIN_WIDTH + 10)

        cy.getBySel('accessory-panel-resize-handle').trigger('mouseup')
    })
    it('ignores out-of-bounds mouse movements past the max-width edge', () => {
        const movementX = DRAGHANDLE_PAGE_X_MAX - DRAGHANDLE_PAGE_X_INITIAL
        const pageXAtMaxWidth = getMouseMoveOptions(movementX).pageX
        const expectedWidth =
            VIEWPORT_WIDTH - PRIMARY_PANEL_WIDTH - ACCESSORY_PANEL_MIN_PX_AT_END

        goToStartPage()

        // force sidebar width reset
        cy.getBySel('accessory-panel-resize-handle').trigger('dblclick')

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', ACCESSORY_PANEL_DEFAULT_WIDTH)

        // Resize to min width, without mouseup
        cy.getBySel('accessory-panel-resize-handle')
            .trigger('mousedown')
            .trigger('mousemove', getMouseMoveOptions(movementX))
        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', expectedWidth)

        // Mousemove 20px right past max-width, width should remain the same
        cy.getBySel('accessory-panel-resize-handle').trigger(
            'mousemove',
            getMouseMoveOptions(20, pageXAtMaxWidth)
        )
        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', expectedWidth)

        // Now 10 px left, still on righthand side of max width, so width should remain the same
        cy.getBySel('accessory-panel-resize-handle').trigger(
            'mousemove',
            getMouseMoveOptions(-10, pageXAtMaxWidth + 20)
        )
        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', expectedWidth)

        // Now another 20 px left, which moves us 10px to the left of max-width, width should decrease 10px
        cy.getBySel('accessory-panel-resize-handle').trigger(
            'mousemove',
            getMouseMoveOptions(-20, pageXAtMaxWidth + 10)
        )
        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', expectedWidth - 10)

        cy.getBySel('accessory-panel-resize-handle').trigger('mouseup')
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

        // This is an adidtional check to confirm growing works immediately
        resizeByKeyBoard(20)
        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', ACCESSORY_PANEL_MIN_WIDTH + 20)
    })
    it('cannot be resized by keyboard past its max-width', () => {
        /* If width restriction was not working, this movement would make the sidebar
         * 20px wider than the maximum */
        const movementX = DRAGHANDLE_PAGE_X_MAX - DRAGHANDLE_PAGE_X_INITIAL + 20
        const expectedWidth =
            VIEWPORT_WIDTH - PRIMARY_PANEL_WIDTH - ACCESSORY_PANEL_MIN_PX_AT_END

        goToStartPage()

        // force sidebar width reset
        cy.getBySel('accessory-panel-resize-handle').trigger('dblclick')

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', ACCESSORY_PANEL_DEFAULT_WIDTH)

        resizeByKeyBoard(movementX)

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', expectedWidth)

        // This is an adidtional check to confirm shrinking works immediately
        resizeByKeyBoard(-20)
        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', expectedWidth - 20)
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
    it('can be reset by double clicking', () => {
        const movementX = 200
        const expectedWidthAfterResize =
            ACCESSORY_PANEL_DEFAULT_WIDTH + movementX
        const expectedWidthAfterReset = ACCESSORY_PANEL_DEFAULT_WIDTH

        goToStartPage()
        resizeByMouse(movementX)

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', expectedWidthAfterResize)

        cy.getBySel('accessory-panel-resize-handle').trigger('dblclick')

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
    it('does not decrease the panel width past its min-width on window resize', () => {
        goToStartPage()
        cy.viewport(300, Cypress.config().viewportHeight)

        cy.getBySel('accessory-sidebar')
            .invoke('outerWidth')
            .should('eq', ACCESSORY_PANEL_MIN_WIDTH)
    })
    it('mouse resizing works after keyboard resize without blurring the resize handle', () => {
        const keyboardMovementX = 100
        const mouseMovementX = 100
        const keyboardResizedWidth =
            ACCESSORY_PANEL_DEFAULT_WIDTH + keyboardMovementX
        const mouseResizedWidth = keyboardResizedWidth + mouseMovementX

        // Opened by default on start page, so we can start resizing
        goToStartPage()

        resizeByKeyBoard(keyboardMovementX, false)

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
