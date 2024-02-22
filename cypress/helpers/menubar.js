import { EXTENDED_TIMEOUT } from '../support/util.js'

export const clickMenubarUpdateButton = () =>
    cy
        .getBySel('dhis2-analytics-toolbar', EXTENDED_TIMEOUT)
        .contains('Update')
        .click()

export const clickMenubarViewButton = () =>
    cy
        .getBySel('dhis2-analytics-hovermenubar', EXTENDED_TIMEOUT)
        .contains('View')
        .click()

export const clickMenubarOptionsButton = () =>
    cy
        .getBySel('dhis2-analytics-hovermenubar', EXTENDED_TIMEOUT)
        .contains('Options')
        .click()

export const openDataOptionsModal = () => {
    clickMenubarOptionsButton()
    return cy.getBySel('options-menu-list').contains('Data').click()
}

export const openStyleOptionsModal = () => {
    clickMenubarOptionsButton()
    return cy.getBySel('options-menu-list').contains('Style').click()
}

export const openLegendOptionsModal = () => {
    clickMenubarOptionsButton()
    return cy.getBySel('options-menu-list').contains('Legend').click()
}

export const clickMenubarInterpretationsButton = () =>
    cy
        .getBySel('dhis2-analytics-toolbar', EXTENDED_TIMEOUT)
        .contains('Interpretations')
        .click()
