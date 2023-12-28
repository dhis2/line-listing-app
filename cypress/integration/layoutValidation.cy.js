import { CHILD_PROGRAM } from '../data/index.js'
import {
    clickAddRemoveMainDimension,
    clickAddRemoveProgramDimension,
    openProgramDimensionsSidebar,
    selectEnrollmentWithProgram,
    selectEventWithProgram,
    selectTrackedEntityWithType,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { goToStartPage } from '../helpers/startScreen.js'
import { expectTableToBeVisible } from '../helpers/table.js'

describe('layout validation', () => {
    const types = ['event', 'enrollment']
    types.forEach((type) => {
        it(`validates that program, columns and org unit are required (${type})`, () => {
            const trackerProgram = CHILD_PROGRAM

            goToStartPage()

            if (type === 'enrollemnt') {
                cy.getBySel('input-enrollment').click()
            }

            clickMenubarUpdateButton()

            cy.getBySel('error-container').contains('No program selected')

            if (type === 'event') {
                // select a program (without selecting stage, should auto-select)
                selectEventWithProgram({
                    programName: trackerProgram.programName,
                })
            } else {
                selectEnrollmentWithProgram({
                    programName: trackerProgram.programName,
                })
            }

            openProgramDimensionsSidebar()

            // remove org unit
            clickAddRemoveProgramDimension('Organisation unit')

            clickMenubarUpdateButton()

            // columns is required
            cy.getBySel('error-container').contains('Columns is empty')

            // add something other than org unit to columns
            clickAddRemoveMainDimension('Last updated by')

            clickMenubarUpdateButton()

            // org unit dimension is required
            cy.getBySel('error-container').contains(
                'No organisation unit selected'
            )

            // remove previously added dimension
            clickAddRemoveMainDimension('Last updated by')

            // add org unit to columns
            clickAddRemoveProgramDimension('Organisation unit')

            clickMenubarUpdateButton()

            // validation succeeds when all above are provided
            expectTableToBeVisible()
        })
    })
    it(['>=41'], 'validates that type and org unit are required (TE)', () => {
        goToStartPage()

        cy.getBySel('input-tracked-entity').click()

        clickMenubarUpdateButton()

        cy.getBySel('error-container').contains(
            'No tracked entity type selected'
        )

        selectTrackedEntityWithType('Person')

        // remove org unit
        clickAddRemoveMainDimension('Registration org. unit')

        clickMenubarUpdateButton()

        // columns is required
        cy.getBySel('error-container').contains('Columns is empty')

        // add something other than org unit to columns
        clickAddRemoveMainDimension('Last updated by')

        clickMenubarUpdateButton()

        // org unit dimension is required
        cy.getBySel('error-container').contains('No organisation unit selected')

        // remove previously added dimension
        clickAddRemoveMainDimension('Last updated by')

        // add org unit to columns
        clickAddRemoveMainDimension('Registration org. unit')

        clickMenubarUpdateButton()

        // validation succeeds when all above are provided
        expectTableToBeVisible()
    })
})
