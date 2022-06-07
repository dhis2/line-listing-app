const addProgramDimensions = ({ programName, stageName, dimensions }) => {
    // open the Program dimensions panel
    cy.getWithDataTest('{main-sidebar}').contains('Program dimensions').click()

    // choose the program and stage
    cy.contains('Choose a program').click()
    cy.contains(programName).click()
    cy.contains('Stage').click()
    cy.contains(stageName).click()

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

export { addProgramDimensions }
