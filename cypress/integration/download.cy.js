import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import { HIV_PROGRAM, TEST_REL_PE_LAST_12_MONTHS } from '../data/index.js'
import { selectEventProgram } from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod } from '../helpers/period.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('download', () => {
    it('download button enable/disable', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        cy.getBySel('menubar')
            .contains('Download')
            .should('have.attr', 'disabled')

        selectEventProgram({
            programName: HIV_PROGRAM.programName,
            stageName: HIV_PROGRAM.stageName,
        })

        clickMenubarUpdateButton()

        cy.getBySel('menubar')
            .contains('Download')
            .should('have.attr', 'disabled')

        selectRelativePeriod({
            label: HIV_PROGRAM[DIMENSION_ID_EVENT_DATE],
            period: TEST_REL_PE_LAST_12_MONTHS,
        })

        clickMenubarUpdateButton()

        cy.getBySel('menubar')
            .contains('Download')
            .should('not.have.attr', 'disabled')
    })
})
