import { E2E_PROGRAM } from '../data/index.js'
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
            const trackerProgram = E2E_PROGRAM

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
                // this will fail in january since default period is "last 12 months" and the first available enrollment is in january current year
                // TODO: add another period if this test is run in january?
                // or add a new enrollment in the test data for december last year?
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

        // org unit isn't required
        expectTableToBeVisible()

        // remove previously added dimension
        clickAddRemoveMainDimension('Last updated by')

        // add org unit to columns without any items selected
        clickAddRemoveMainDimension('Registration org. unit')
        // FIXME: uncomment the following lines once https://dhis2.atlassian.net/browse/DHIS2-16381 is fixed
        // openOuDimension(DIMENSION_ID_ORGUNIT)
        // deselectUserOrgUnit('User organisation unit')
        // clickOrgUnitDimensionModalUpdateButton()

        clickMenubarUpdateButton()

        expectTableToBeVisible()
    })
})
