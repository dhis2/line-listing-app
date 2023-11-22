import { EXTENDED_TIMEOUT } from '../support/util.js'

const INPUT_EVENT = 'event'
const INPUT_ENROLLMENT = 'enrollment'

const selectProgramAndStage = ({ inputType, programName, stageName }) => {
    // select the desired type: Event or Enrollment
    if (inputType === INPUT_EVENT) {
        cy.getBySel('input-event').click()
    } else {
        cy.getBySel('input-enrollment').click()
    }

    // choose the program
    if (programName) {
        cy.getBySel('accessory-sidebar').contains('Choose a program').click()
        cy.contains(programName).click()
    }

    // choose the stage if relevant
    if (stageName) {
        cy.getBySel('stage-select').click()
        cy.containsExact(stageName).click()
    }
}

export const selectProgramForTE = (programName) => {
    cy.getBySel('accessory-sidebar').contains('Program').click()
    cy.contains(programName).click()
}

export const selectEventWithProgram = ({ programName, stageName }) =>
    selectProgramAndStage({ inputType: INPUT_EVENT, programName, stageName })

export const selectEnrollmentWithProgram = ({ programName }) =>
    selectProgramAndStage({
        inputType: INPUT_ENROLLMENT,
        programName,
    })

export const selectTrackedEntityWithType = (typeName) => {
    cy.getBySel('input-tracked-entity').click()
    cy.getBySel('accessory-sidebar').contains('Choose a type').click()
    cy.contains(typeName).click()
}

export const openInputSidebar = () => {
    cy.getBySel('main-sidebar').contains('Input:').click()
    cy.getBySel('input-panel').should('be.visible')
}

export const openProgramDimensionsSidebar = () => {
    cy.getBySel('main-sidebar').contains('Program dimensions').click()
    cy.getBySel('program-dimensions').should('be.visible')
}

export const openDimension = (dimensionName) => {
    cy.getBySel('program-dimensions-list', EXTENDED_TIMEOUT)
        .contains(dimensionName)
        .click()
}

const clickAddRemoveDimension = (id, label) =>
    cy
        .getBySel(id, EXTENDED_TIMEOUT)
        .contains(label)
        .closest(`[data-test*="dimension-item"]`)
        .findBySelLike('item-button')
        .invoke('attr', 'style', 'visibility: initial')
        .click()

export const clickAddRemoveMainDimension = (label) =>
    clickAddRemoveDimension('main-sidebar', label)

export const clickAddRemoveProgramDimension = (label) =>
    clickAddRemoveDimension('program-dimensions', label)

export const clickAddRemoveProgramDataDimension = (label) =>
    clickAddRemoveDimension('program-dimensions-list', label)

export const clickAddRemoveTrackedEntityTypeDimensions = (label) =>
    clickAddRemoveDimension('tracked-entity-dimensions-list', label)

const selectProgramDimensions = ({
    inputType,
    programName,
    stageName,
    dimensions,
}) => {
    selectProgramAndStage({ inputType, programName, stageName })

    openProgramDimensionsSidebar()

    // add the dimensions as columns
    dimensions.forEach((dimensionName) => {
        clickAddRemoveProgramDataDimension(dimensionName)
    })
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

export const selectEnrollmentWithProgramDimensions = ({
    programName,
    dimensions,
}) =>
    selectProgramDimensions({
        inputType: INPUT_ENROLLMENT,
        programName,
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
