import { CHILD_PROGRAM } from '../data/index.js'
import {
    clickAddRemoveMainDimension,
    clickAddRemoveProgramDimension,
    openProgramDimensionsSidebar,
    selectEventWithProgram,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { goToStartPage } from '../helpers/startScreen.js'
import { expectTableToBeVisible } from '../helpers/table.js'

/* This files constains sequential tests, which means that some test steps
 * depend on a previous step. With test isolation switched on (the default setting)
 * each step (`it` block) will start off in a fresh window, and that breaks this kind
 * of test. So `testIsolation` was set to false here. */
describe('layout validation', { testIsolation: false }, () => {
    const trackerProgram = CHILD_PROGRAM

    it('program is required', () => {
        cy.setTestDescription(
            'Verifies that selecting a program is a required step for layout validation.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'LayoutValidation' },
            { key: 'action', value: 'CheckProgramRequirement' },
            { key: 'validationRequirement', value: 'ProgramRequirement' },
        ])

        goToStartPage()

        clickMenubarUpdateButton()

        cy.getBySel('error-container').contains('No program selected')
    })

    it('columns is required', () => {
        cy.setTestDescription(
            'Checks that having columns is a necessary condition for layout validation.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'LayoutValidation' },
            { key: 'action', value: 'CheckColumnsRequirement' },
            { key: 'validationRequirement', value: 'ColumnsRequirement' },
        ])

        // select a program (without selecting stage, should auto-select)
        selectEventWithProgram({ programName: trackerProgram.programName })

        openProgramDimensionsSidebar()

        // remove org unit
        clickAddRemoveProgramDimension('Organisation unit')

        clickMenubarUpdateButton()

        cy.getBySel('error-container').contains('Columns is empty')
    })

    it('org unit dimension is required', () => {
        cy.setTestDescription(
            'Ensures that selecting an organisation unit dimension is mandatory for layout validation.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'LayoutValidation' },
            { key: 'action', value: 'CheckOrgUnitDimensionRequirement' },
            {
                key: 'validationRequirement',
                value: 'OrgUnitDimensionRequirement',
            },
        ])

        // add something other than org unit to columns
        clickAddRemoveMainDimension('Last updated by')

        clickMenubarUpdateButton()

        cy.getBySel('error-container').contains('No organisation unit selected')
    })

    it('validation succeeds when all above are provided', () => {
        cy.setTestDescription(
            'Confirms that layout validation succeeds when all necessary conditions are met.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'LayoutValidation' },
            { key: 'action', value: 'ValidateSuccessWithAllConditions' },
            { key: 'validationOutcome', value: 'Success' },
        ])

        // remove previously added dimension
        clickAddRemoveMainDimension('Last updated by')

        // add org unit to columns
        clickAddRemoveProgramDimension('Organisation unit')

        clickMenubarUpdateButton()

        expectTableToBeVisible()
    })
})
