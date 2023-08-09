import {
    E2E_PROGRAM,
    TEST_DIM_TEXT,
    TEST_DIM_LETTER,
    TEST_DIM_LONG_TEXT,
    TEST_DIM_EMAIL,
    TEST_DIM_USERNAME,
    TEST_DIM_URL,
    TEST_DIM_PHONE_NUMBER,
    TEST_DIM_NUMBER,
    TEST_DIM_UNIT_INTERVAL,
    TEST_DIM_PERCENTAGE,
    TEST_DIM_INTEGER,
    TEST_DIM_INTEGER_POSITIVE,
    TEST_DIM_INTEGER_NEGATIVE,
    TEST_DIM_INTEGER_ZERO_OR_POSITIVE,
    TEST_DIM_WITH_PRESET,
    TEST_AO,
} from '../data/index.js'
import { goToAO } from '../helpers/common.js'
import { selectEventWithProgramDimensions } from '../helpers/dimensions.js'
import { clickMenubarViewButton } from '../helpers/menubar.js'
import { goToStartPage } from '../helpers/startScreen.js'

describe('layout', () => {
    it('expansion caret can be toggled', () => {
        goToStartPage()
        selectEventWithProgramDimensions({
            ...E2E_PROGRAM,
            dimensions: [
                TEST_DIM_TEXT,
                TEST_DIM_LETTER,
                TEST_DIM_LONG_TEXT,
                TEST_DIM_EMAIL,
                TEST_DIM_USERNAME,
                TEST_DIM_URL,
                TEST_DIM_PHONE_NUMBER,
                TEST_DIM_NUMBER,
                TEST_DIM_UNIT_INTERVAL,
                TEST_DIM_PERCENTAGE,
                TEST_DIM_INTEGER,
                TEST_DIM_INTEGER_POSITIVE,
                TEST_DIM_INTEGER_NEGATIVE,
                TEST_DIM_INTEGER_ZERO_OR_POSITIVE,
                TEST_DIM_WITH_PRESET,
            ],
        })

        cy.getBySel('columns-axis')
            .contains(TEST_DIM_INTEGER_POSITIVE)
            .should('be.visible')

        cy.getBySel('layout-height-toggle').click()

        cy.getBySel('columns-axis')
            .contains(TEST_DIM_WITH_PRESET)
            .should('not.be.visible')

        cy.getBySel('layout-height-toggle').click()

        cy.getBySel('columns-axis')
            .contains(TEST_DIM_WITH_PRESET)
            .should('be.visible')
    })

    it('the layout panel can be toggled by clicking the option in the view menu', () => {
        goToStartPage()

        // Hiding
        clickMenubarViewButton()

        cy.getBySel('dhis2-uicore-hovermenulistitem')
            .contains('Hide layout')
            .should('be.visible')
            .click()

        cy.getBySel('layout-container').should('not.be.visible')

        // Showing
        clickMenubarViewButton()

        cy.getBySel('dhis2-uicore-hovermenulistitem')
            .contains('Show layout')
            .should('be.visible')
            .click()

        cy.getBySel('layout-container').should('be.visible')
    })

    it.only('the layout panel can be toggled by clicking the fullscreen button', () => {
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

        cy.getBySel('layout-container').should('not.be.visible')

        // Showing
        cy.getBySel('fullscreen-toggler')
            .should('be.visible')
            .trigger('mouseover')

        cy.getBySel('fullscreen-toggle-tooltip-content')
            .should('be.visible')
            .and('contain', 'Show panels')

        cy.getBySel('fullscreen-toggler').should('be.visible').click()

        cy.getBySel('layout-container').should('be.visible')
    })
})
