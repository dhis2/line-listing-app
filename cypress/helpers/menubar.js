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

export const clickMenubarInterpretationsButton = () =>
    cy
        .getBySel('dhis2-analytics-toolbar', EXTENDED_TIMEOUT)
        .contains('Interpretations')
        .click()
