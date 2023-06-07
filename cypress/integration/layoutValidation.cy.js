import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import { CHILD_PROGRAM, TEST_REL_PE_LAST_YEAR } from '../data/index.js'
import {
    clickAddRemoveMainDimension,
    selectEventWithProgram,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import { expectTableToBeVisible } from '../helpers/table.js'

describe('layout validation', () => {
    const trackerProgram = CHILD_PROGRAM

    it('program is required', () => {
        goToStartPage()

        clickMenubarUpdateButton()

        cy.getBySel('error-container').contains('No program selected')
    })
    it('stage is required', () => {
        // select a program
        selectEventWithProgram({ programName: trackerProgram.programName })

        clickMenubarUpdateButton()

        cy.getBySel('error-container').contains('No stage selected')
    })
    it('columns is required', () => {
        // select a stage
        selectEventWithProgram({
            stageName: trackerProgram.stageName,
        })

        // remove org unit
        clickAddRemoveMainDimension('Organisation unit')

        clickMenubarUpdateButton()

        cy.getBySel('error-container').contains('Columns is empty')
    })
    it('org unit dimension is required', () => {
        // add something other than org unit to columns
        clickAddRemoveMainDimension('Last updated by')

        clickMenubarUpdateButton()

        cy.getBySel('error-container').contains('No organisation unit selected')
    })
    it('validation succeeds when all above are provided', () => {
        // add a time dimension to columns
        selectRelativePeriod({
            label: trackerProgram[DIMENSION_ID_EVENT_DATE],
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()
    })
})
