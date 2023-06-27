import { E2E_PROGRAM } from '../data/index.js'
import {
    selectEnrollmentProgram,
    selectEventWithProgram,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { goToStartPage } from '../helpers/startScreen.js'
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
        goToStartPage()

        downloadIsDisabled()

        selectEventWithProgram({
            programName: E2E_PROGRAM.programName,
            stageName: E2E_PROGRAM.stageName,
        })

        clickMenubarUpdateButton()

        downloadIsEnabled()
    })

    it('download button enables when required dimensions are selected (enrollment)', () => {
        goToStartPage()

        downloadIsDisabled()

        selectEnrollmentProgram({
            programName: E2E_PROGRAM.programName,
        })

        clickMenubarUpdateButton()

        downloadIsEnabled()
    })
})
