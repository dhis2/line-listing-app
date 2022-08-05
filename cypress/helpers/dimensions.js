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
    cy.getBySel('accessory-sidebar').contains('Choose a program').click()
    cy.contains(programName).click()

    // choose the stage if relevant
    if (stageName) {
        cy.getBySel('accessory-sidebar').contains('Stage').click()
        cy.contains(stageName).click()
    }
}

export const selectEventProgram = ({ programName, stageName }) =>
    selectProgramAndStage({ inputType: INPUT_EVENT, programName, stageName })

export const selectEnrollmentProgram = ({ programName, stageName }) =>
    selectProgramAndStage({
        inputType: INPUT_ENROLLMENT,
        programName,
        stageName,
    })

export const openDimension = (dimensionName) => {
    cy.getWithDataTest('{program-dimension-list}')
        .contains(dimensionName)
        .click()
}

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

export const selectEventProgramDimensions = ({
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
