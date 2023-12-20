import { E2E_PROGRAM } from '../data/index.js'
import {
    selectEnrollmentWithProgram,
    selectEventWithProgram,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { goToStartPage } from '../helpers/startScreen.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const downloadIsEnabled = () =>
    cy
        .getBySel('dhis2-analytics-hovermenubar', EXTENDED_TIMEOUT)
        .contains('Download')
        .should('not.have.attr', 'disabled')

const downloadIsDisabled = () =>
    cy
        .getBySel('dhis2-analytics-hovermenubar', EXTENDED_TIMEOUT)
        .contains('Download')
        .should('have.attr', 'disabled')

describe('download', () => {
    it('download button enables when required dimensions are selected (event)', () => {
        cy.setTestDescription(
            'Ensures the download button is enabled when required dimensions are selected in an event-based analysis.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'DownloadFunctionality' },
            { key: 'action', value: 'EnableDownloadButton' },
            { key: 'context', value: 'EventBasedAnalysis' },
        ])

        goToStartPage()

        downloadIsDisabled()

        selectEventWithProgram({
            programName: E2E_PROGRAM.programName,
        })

        clickMenubarUpdateButton()

        downloadIsEnabled()
    })

    it('download button enables when required dimensions are selected (enrollment)', () => {
        cy.setTestDescription(
            'Verifies that the download button is enabled when necessary dimensions are selected in an enrollment-based analysis.'
        )
        cy.addTestAttributes([
            { key: 'feature', value: 'DownloadFunctionality' },
            { key: 'action', value: 'EnableDownloadButton' },
            { key: 'context', value: 'EnrollmentBasedAnalysis' },
        ])

        goToStartPage()

        downloadIsDisabled()

        selectEnrollmentWithProgram({
            programName: E2E_PROGRAM.programName,
        })

        clickMenubarUpdateButton()

        downloadIsEnabled()
    })
})
