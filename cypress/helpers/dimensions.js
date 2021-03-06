import { EXTENDED_TIMEOUT } from '../support/util.js'

const INPUT_EVENT = 'event'
const INPUT_ENROLLMENT = 'enrollment'

const selectProgramDimensions = ({
    inputType,
    programName,
    stageName,
    dimensions,
}) => {
    // select the desired type: Event or Enrollment
    cy.getWithDataTest('{main-sidebar}', EXTENDED_TIMEOUT)
        .contains('Input:')
        .click()
    if (inputType === INPUT_EVENT) {
        cy.getWithDataTest('{input-event}').click()
    } else {
        cy.getWithDataTest('{input-enrollment}').click()
    }

    // open the Program dimensions panel
    cy.getWithDataTest('{main-sidebar}').contains('Program dimensions').click()

    // choose the program
    cy.getWithDataTest('{accessory-sidebar}')
        .contains('Choose a program')
        .click()
    cy.contains(programName).click()

    // choose the stage if relevant
    if (stageName) {
        cy.getWithDataTest('{accessory-sidebar}').contains('Stage').click()
        cy.contains(stageName).click()
    }

    // add the dimensions as columns
    dimensions.forEach((dimensionName) => {
        cy.getWithDataTest('{program-dimension-list}')
            .contains(dimensionName)
            .click()
        cy.contains('Add to Columns').click()
    })

    // close the program dimensions panel
    cy.getWithDataTest('{main-sidebar}').contains('Program dimensions').click()
}

const selectEventProgramDimensions = ({ programName, stageName, dimensions }) =>
    selectProgramDimensions({
        inputType: INPUT_EVENT,
        programName,
        stageName,
        dimensions,
    })

const selectEnrollmentProgramDimensions = ({
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

export { selectEventProgramDimensions, selectEnrollmentProgramDimensions }
