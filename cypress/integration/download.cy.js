import { E2E_PROGRAM } from '../data/index.js'
import {
    selectEnrollmentWithProgram,
    selectEventWithProgram,
    selectTrackedEntityWithType,
} from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    getTableHeaderCells,
    expectTableToBeVisible,
} from '../helpers/table.js'
import { EXTENDED_TIMEOUT, getApiBaseUrl } from '../support/util.js'

const apiBaseUrl = getApiBaseUrl()

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

const assertDisplayPropertyInDonwload = (displayProperty) => {
    const dimensionName =
        displayProperty === 'NAME' ? 'Agricultural Region' : 'Agri Reg'

    goToStartPage()

    selectEnrollmentWithProgram({
        programName: E2E_PROGRAM.programName,
    })

    cy.getBySel('main-sidebar').contains('Your dimensions').click()

    cy.getBySel('your-dimensions-list')
        .contains(dimensionName, EXTENDED_TIMEOUT)
        .click()

    cy.contains('Add to Columns').click()

    clickMenubarUpdateButton()

    expectTableToBeVisible()

    getTableHeaderCells().contains(dimensionName).should('be.visible')

    cy.getBySel('dhis2-analytics-hovermenubar', EXTENDED_TIMEOUT)
        .contains('Download')
        .click()

    cy.intercept(`${apiBaseUrl}/analytics/enrollments/query/*.html+css*`).as(
        'getDownload'
    )

    // override window.open to force the donwload to open in the same tab
    // see: https://glebbahmutov.com/blog/cypress-tips-and-tricks/#deal-with-windowopen
    cy.window().then((win) => {
        cy.stub(win, 'open').callsFake((url) => {
            return win.open.wrappedMethod.call(win, url, '_self')
        })
    })

    cy.getBySel('dhis2-analytics-hovermenulist')
        .contains('HTML+CSS (.html+css)')
        .click()

    cy.wait('@getDownload').then(({ request, response }) => {
        expect(request.url).to.include(`displayProperty=${displayProperty}`)
        expect(response.body).to.include(dimensionName)
    })
}

describe('download', () => {
    it('download button enables when required dimensions are selected (event)', () => {
        goToStartPage()

        downloadIsDisabled()

        selectEventWithProgram({
            programName: E2E_PROGRAM.programName,
        })

        clickMenubarUpdateButton()

        downloadIsEnabled()
    })

    it('download button enables when required dimensions are selected (enrollment)', () => {
        goToStartPage()

        downloadIsDisabled()

        selectEnrollmentWithProgram({
            programName: E2E_PROGRAM.programName,
        })

        clickMenubarUpdateButton()

        downloadIsEnabled()
    })

    it(
        ['>=41'],
        'download button enables when required dimensions are selected (TE)',
        () => {
            goToStartPage()

            downloadIsDisabled()

            selectTrackedEntityWithType('Person')

            clickMenubarUpdateButton()

            downloadIsEnabled()
        }
    )

    it('displayProperty with NAME value is passed in the download URL', () => {
        assertDisplayPropertyInDonwload('NAME')
    })

    it('displayProperty with SHORTNAME value is passed in the download URL', () => {
        // override user setting for displayProperty
        cy.intercept(`${apiBaseUrl}/me?fields=*`, (req) => {
            req.reply((res) => {
                res.send({
                    body: {
                        ...res.body,
                        settings: {
                            ...res.body.settings,
                            keyAnalysisDisplayProperty: 'shortName',
                        },
                    },
                })
            })
        })

        assertDisplayPropertyInDonwload('SHORTNAME')
    })
})
