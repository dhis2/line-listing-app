import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
} from '../../src/modules/dimensionConstants.js'
import {
    HIV_PROGRAM,
    ANALYTICS_PROGRAM,
    TEST_REL_PE_LAST_12_MONTHS,
} from '../data/index.js'
import {
    selectEnrollmentProgram,
    selectEventProgram,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod } from '../helpers/period.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const downloadIsEnabled = () =>
    cy
        .getBySel('menubar', EXTENDED_TIMEOUT)
        .contains('Download')
        .should('not.have.attr', 'disabled')

const downloadIsDisabled = () =>
    cy
        .getBySel('menubar', EXTENDED_TIMEOUT)
        .contains('Download')
        .should('have.attr', 'disabled')

describe('download', () => {
    it('download button enables when required dimensions are selected (event)', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        downloadIsDisabled()

        selectEventProgram({
            programName: HIV_PROGRAM.programName,
            stageName: HIV_PROGRAM.stageName,
        })

        clickMenubarUpdateButton()

        downloadIsDisabled()

        selectRelativePeriod({
            label: HIV_PROGRAM[DIMENSION_ID_EVENT_DATE],
            period: TEST_REL_PE_LAST_12_MONTHS,
        })

        clickMenubarUpdateButton()

        downloadIsEnabled()
    })

    it('download button enables when required dimensions are selected (enrollment)', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        downloadIsDisabled()

        selectEnrollmentProgram({
            programName: ANALYTICS_PROGRAM.programName,
        })

        clickMenubarUpdateButton()

        downloadIsDisabled()

        selectRelativePeriod({
            label: ANALYTICS_PROGRAM[DIMENSION_ID_ENROLLMENT_DATE],
            period: TEST_REL_PE_LAST_12_MONTHS,
        })

        clickMenubarUpdateButton()

        downloadIsEnabled()
    })
})