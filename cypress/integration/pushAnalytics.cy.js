import { TEST_AO } from '../data/index.js'
import { goToAO } from '../helpers/common.js'
import { goToStartPage } from '../helpers/startScreen.js'

describe('push-analytics', () => {
    it(['>=41'], 'has a push-analytics.json file', () => {
        goToStartPage()
        cy.request('push-analytics.json').as('file')

        cy.get('@file').should((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('version')
            expect(response.body).to.have.property('showVisualization')
            expect(response.body).to.have.property('triggerDownload')
            expect(response.body).to.have.property('obtainDownloadArtifact')
            expect(response.body).to.have.property('clearVisualization')
        })
    })

    it(
        ['>=41'],
        'can download a file using the instructions in the push-analytics.json',
        () => {
            /* Stub window.open to prevent actually opening the HTML+CSS file in
             * a new tab, because Cypress does not handle this well */
            const windowOpenStub = cy.stub().as('open')
            cy.on('window:before:load', (win) => {
                cy.stub(win, 'open').callsFake(windowOpenStub)
            })

            goToAO(TEST_AO.id)

            // Trigger the download from the UI as push-analytics does
            cy.contains('button', 'Download').should('be.enabled').click()
            cy.contains('li', 'HTML+CSS (.html+css)')
                .should('be.visible')
                .click()

            // Assert that window.open was called with correct URL and target
            cy.get('@open').should('have.been.calledOnce')
            cy.get('@open').should((stub) => {
                const urlInstance = stub.getCall(0).args[0]
                const target = stub.getCall(0).args[1]

                expect(urlInstance).to.have.property('pathname')
                expect(urlInstance.pathname).to.satisfy((pathname) =>
                    // Note that this does not include the AO ID, but the program ID
                    pathname.endsWith(
                        '/analytics/events/query/eBAyeGv0exc.html+css'
                    )
                )
                expect(target).to.equal('_blank')
            })
        }
    )
})
