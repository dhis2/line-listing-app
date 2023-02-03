import { EXTENDED_TIMEOUT } from '../support/util.js'

const INPUT_EVENT = 'event'
const INPUT_ENROLLMENT = 'enrollment'

const selectProgramAndStage = ({ inputType, programName, stageName }) => {
    // select the desired type: Event or Enrollment
    cy.getBySel('main-sidebar', EXTENDED_TIMEOUT).contains('Input:').click()
    if (inputType === INPUT_EVENT) {
        cy.getBySel('input-event').click()
    } else {
        cy.getBySel('input-enrollment').click()
    }

    // open the Program dimensions panel
    cy.getBySel('main-sidebar').contains('Program dimensions').click()

    // choose the program
    if (programName) {
        cy.getBySel('accessory-sidebar').contains('Choose a program').click()
        cy.contains(programName).click()
    }

    // choose the stage if relevant
    if (stageName) {
        cy.getBySel('accessory-sidebar').contains('Stage').click()
        cy.containsExact(stageName).click()
    }
}

export const selectEventWithProgram = ({ programName, stageName }) =>
    selectProgramAndStage({ inputType: INPUT_EVENT, programName, stageName })

export const selectEnrollmentProgram = ({ programName, stageName }) =>
    selectProgramAndStage({
        inputType: INPUT_ENROLLMENT,
        programName,
        stageName,
    })

export const openDimension = (dimensionName) => {
    cy.getBySel('program-dimensions-list').contains(dimensionName).click()
}

const clickAddRemoveDimension = (id, label) =>
    cy
        .getBySel(id)
        .contains(label)
        .closest(`[data-test*="dimension-item"]`)
        .findBySel('item-button')
        .invoke('attr', 'style', 'visibility: initial')
        .click()

export const clickAddRemoveMainDimension = (label) =>
    clickAddRemoveDimension('main-sidebar', label)

export const clickAddRemoveProgramDimension = (label) =>
    clickAddRemoveDimension('program-dimensions-list', label)

const selectProgramDimensions = ({
    inputType,
    programName,
    stageName,
    dimensions,
}) => {
    selectProgramAndStage({ inputType, programName, stageName })

    // add the dimensions as columns
    dimensions.forEach((dimensionName) => {
        openDimension(dimensionName)
        cy.contains('Add to Columns').click()
    })

    // close the program dimensions panel
    cy.getBySel('main-sidebar').contains('Program dimensions').click()
}

export const selectEventWithProgramDimensions = ({
    programName,
    stageName,
    dimensions,
}) =>
    selectProgramDimensions({
        inputType: INPUT_EVENT,
        programName,
        stageName,
        dimensions,
    })

export const selectEnrollmentProgramDimensions = ({
    programName,
    stageName,
    dimensions,
}) =>
    selectProgramDimensions({
        inputType: INPUT_ENROLLMENT,
        programName,
        stageName,
        dimensions,
    })

const disabledOpacity = { prop: 'opacity', value: '0.5' }
const disabledCursor = { prop: 'cursor', value: 'not-allowed' }

export const dimensionIsEnabled = (id) =>
    cy
        .getBySel(id)
        .should('be.visible')
        .and('not.have.css', disabledOpacity.prop, disabledOpacity.value)
        .and('not.have.css', disabledCursor.prop, disabledCursor.value)

export const dimensionIsDisabled = (id) =>
    cy
        .getBySel(id)
        .should('be.visible')
        .and('have.css', disabledOpacity.prop, disabledOpacity.value)
        .and('have.css', disabledCursor.prop, disabledCursor.value)
