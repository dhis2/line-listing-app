import { AXIS_ID_COLUMNS } from '@dhis2/analytics'
import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
} from '../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_DIM_NUMBER,
    TEST_FIX_PE_DEC_LAST_YEAR,
    TEST_REL_PE_LAST_YEAR,
    TEST_DIM_INTEGER,
} from '../data/index.js'
import { goToAO } from '../helpers/common.js'
import {
    openProgramDimensionsSidebar,
    selectEventWithProgramDimensions,
    selectTrackedEntityWithTypeAndProgramDimensions,
    clickAddRemoveProgramDataDimension,
} from '../helpers/dimensions.js'
import {
    deleteVisualization,
    openAOByName,
    resaveVisualization,
    saveVisualization,
    saveVisualizationAs,
} from '../helpers/fileMenu.js'
import { expectAxisToHaveDimension } from '../helpers/layout.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectFixedPeriod, selectRelativePeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    expectAOTitleToContain,
    expectAOTitleToContainExact,
    expectTableToBeUpdated,
    expectTableToBeVisible,
    getTableHeaderCells,
    getTableRows,
} from '../helpers/table.js'
import { getApiBaseUrl } from '../support/util.js'

const event = E2E_PROGRAM
const periodLabel = event[DIMENSION_ID_EVENT_DATE]

const setupTable = () => {
    goToStartPage()
    selectEventWithProgramDimensions({
        ...event,
        dimensions: [TEST_DIM_INTEGER],
    })
    selectFixedPeriod({
        label: periodLabel,
        period: TEST_FIX_PE_DEC_LAST_YEAR,
    })
    clickMenubarUpdateButton()
    expectTableToBeVisible()
}

const uidRe = /\/([a-zA-Z][a-zA-Z0-9]{10})$/

const deleteVisualizationWithUid = (uid) =>
    cy.request({
        method: 'DELETE',
        url: `${getApiBaseUrl()}/api/eventVisualizations/${uid}`,
        failOnStatusCode: false, // carry on even if the delete fails
    })

describe('save', () => {
    it('new AO with name saves correctly (event)', () => {
        const AO_NAME = `SAVE-${Date.now()}-EVENT`
        const UPDATED_AO_NAME = AO_NAME + '-superduper'
        setupTable()

        // save with a name
        saveVisualization(AO_NAME)
        expectAOTitleToContainExact(AO_NAME)
        expectTableToBeVisible()

        cy.url()
            .should('match', uidRe)
            .then((url) => {
                const uid = url.match(uidRe)[1]
                cy.wrap(uid).as('firstSavedUid')
            })

        // subscribe to the AO
        cy.getBySel('dhis2-analytics-interpretationsanddetailstoggler').click()
        cy.intercept(
            'POST',
            /\/api\/\d+\/eventVisualizations\/\w+\/subscriber/,
            (req) => {
                req.continue((res) => {
                    expect([200, 201]).to.include(res.statusCode)
                })
            }
        ).as('post-subscriber')
        cy.get('button').contains('Subscribe').should('be.visible').click()
        cy.wait('@post-subscriber')
        cy.get('button').contains('Unsubscribe').should('be.visible')
        cy.getBySel('dhis2-analytics-interpretationsanddetailstoggler').click()
        cy.contains('About this line list').should('not.exist')

        // check first GET request fetches subscribers
        cy.intercept(
            'GET',
            /\/api\/\d+\/eventVisualizations\/\w+\?fields=subscribers/
        ).as('get-subscribers')

        // check the save request contains subscribers
        cy.intercept(
            'PUT',
            /\/api\/\d+\/eventVisualizations\/\w+(\?.*)?/,
            (req) => {
                expect(req.body).to.have.property('subscribers')
            }
        ).as('put-save')

        // click update to enable Save
        clickMenubarUpdateButton()
        resaveVisualization()
        cy.wait('@get-subscribers')
        cy.wait('@put-save')

        // open AO by name
        goToStartPage()
        openAOByName(AO_NAME)
        expectTableToBeVisible()

        // check user is still subscribed
        cy.getBySel('dhis2-analytics-interpretationsanddetailstoggler').click()
        cy.get('button').contains('Unsubscribe').should('be.visible')
        cy.getBySel('dhis2-analytics-interpretationsanddetailstoggler').click()
        cy.contains('About this line list').should('not.exist')

        // save as with name change
        cy.intercept(
            'POST',
            /\/api\/\d+\/eventVisualizations(\?.*)?/,
            (req) => {
                expect(req.body).to.not.have.property('subscribers')
            }
        ).as('post-saveas')

        saveVisualizationAs(UPDATED_AO_NAME)
        cy.wait('@post-saveas')
        expectAOTitleToContainExact(UPDATED_AO_NAME)
        expectTableToBeVisible()

        cy.getBySel('dhis2-analytics-interpretationsanddetailstoggler').click()
        cy.contains('About this line list').should('be.visible')
        cy.get('button').contains('Unsubscribe').should('not.exist')

        cy.url()
            .should('match', uidRe)
            .then((url) => {
                const uid = url.match(uidRe)[1]
                cy.wrap(uid).as('secondSavedUid')
            })

        // save as without name change
        saveVisualizationAs()
        expectAOTitleToContainExact(UPDATED_AO_NAME + ' (copy)')
        expectTableToBeVisible()

        // delete all the saved AOs
        deleteVisualization()
        cy.get('@firstSavedUid').then(deleteVisualizationWithUid)
        cy.get('@secondSavedUid').then(deleteVisualizationWithUid)
    })

    it(['>=41'], 'new AO with name saves correctly (TE)', () => {
        const AO_NAME = `SAVE-${Date.now()}-TE`
        const UPDATED_AO_NAME = AO_NAME + '-superduper'

        // set up a simple TE line list
        goToStartPage()
        selectTrackedEntityWithTypeAndProgramDimensions({
            typeName: 'Person',
            programName: event.programName,
            dimensions: [TEST_DIM_NUMBER],
        })
        clickMenubarUpdateButton()
        expectTableToBeVisible()

        // save with a name
        saveVisualization(AO_NAME)
        expectAOTitleToContainExact(AO_NAME)
        expectTableToBeVisible()

        cy.url()
            .should('match', uidRe)
            .then((url) => {
                const uid = url.match(uidRe)[1]
                cy.wrap(uid).as('firstSavedUid')
            })

        // open AO by name
        goToStartPage()
        openAOByName(AO_NAME)
        expectTableToBeVisible()

        // expect axis to contain dimension with properly prefixed id
        expectAxisToHaveDimension(
            AXIS_ID_COLUMNS,
            'J1QQtmzqhJz.jfuXZB3A1ko.Vcu7eF3ndYW'
        )

        // save as with name change
        saveVisualizationAs(UPDATED_AO_NAME)
        expectAOTitleToContainExact(UPDATED_AO_NAME)
        expectTableToBeVisible()

        cy.url()
            .should('match', uidRe)
            .then((url) => {
                const uid = url.match(uidRe)[1]
                cy.wrap(uid).as('secondSavedUid')
            })

        // save as without name change
        saveVisualizationAs()
        expectAOTitleToContainExact(UPDATED_AO_NAME + ' (copy)')
        expectTableToBeVisible()

        // delete all the saved AOs
        deleteVisualization()
        cy.get('@firstSavedUid').then(deleteVisualizationWithUid)
        cy.get('@secondSavedUid').then(deleteVisualizationWithUid)
    })

    it('new AO with sorted table saves correctly', () => {
        const AO_NAME = `SAVE-${Date.now()}-SORTING`
        setupTable()

        // save with a name
        saveVisualization(AO_NAME)
        expectAOTitleToContainExact(AO_NAME)
        expectTableToBeVisible()

        // apply sorting
        getTableHeaderCells()
            .find(`button[title*="${TEST_DIM_INTEGER}"]`)
            .click()

        expectTableToBeUpdated()

        cy.intercept('POST', /eventVisualizations\?/).as('saveAO')
        cy.intercept('GET', /eventVisualizations\/[a-zA-Z0-9]+\?/).as('loadAO')

        saveVisualizationAs(AO_NAME)

        cy.wait('@saveAO')
            .its('request.body')
            .should('have.property', 'sorting')

        cy.wait('@loadAO')
            .its('response.body')
            .should('have.property', 'sorting')

        expectTableToBeVisible()

        getTableRows()
            .eq(0)
            .find('td')
            .eq(1)
            .invoke('text')
            .then(parseInt)
            .then(($cell0Value) => expect($cell0Value).to.equal(10))

        getTableRows()
            .eq(3)
            .find('td')
            .eq(1)
            .invoke('text')
            .then(parseInt)
            .then(($cell3Value) => expect($cell3Value).to.equal(46))

        deleteVisualization()
    })

    it('new AO saves correctly after adding/removing sorting', () => {
        const AO_NAME = `SAVE-${Date.now()}-SORTING-TOGGLING`
        setupTable()

        // save with a name
        saveVisualization(AO_NAME)
        expectAOTitleToContainExact(AO_NAME)
        expectTableToBeVisible()

        cy.url()
            .should('match', uidRe)
            .then((url) => {
                const uid = url.match(uidRe)[1]
                cy.wrap(uid).as('firstSavedUid')
            })

        // apply sorting
        getTableHeaderCells()
            .find(`button[title*="${TEST_DIM_INTEGER}"]`)
            .click()

        expectTableToBeUpdated()

        // remove dimension with sorting
        clickAddRemoveProgramDataDimension(TEST_DIM_INTEGER)
        clickMenubarUpdateButton()
        expectTableToBeUpdated()

        cy.intercept('POST', /eventVisualizations\?/).as('saveAO')

        saveVisualizationAs(AO_NAME)

        cy.wait('@saveAO')
            .its('request.body')
            .should('not.have.property', 'sorting')

        expectTableToBeVisible()

        // delete all the saved AOs
        deleteVisualization()
        cy.get('@firstSavedUid').then(deleteVisualizationWithUid)
    })

    it('new AO without name saves correctly', () => {
        cy.clock(cy.clock(Date.UTC(2022, 11, 29), ['Date'])) // month is 0-indexed, 11 = December
        const AO_DAY = '29'
        const AO_MONTH = 'Dec'
        const AO_YEAR = '2022'
        const AO_UNTITLED = 'Untitled'
        const UPDATED_AO_NAME = `SAVE-${Date.now()}-NONAME`
        setupTable()

        cy.log('Save for the first time')
        // save without a name
        cy.intercept('GET', /eventVisualizations\/[a-zA-Z][a-zA-Z0-9]{10}/).as(
            'getSavedAO'
        )
        saveVisualization()
        cy.url()
            .should('match', uidRe)
            .then((url) => {
                const uid = url.match(uidRe)[1]
                cy.wrap(uid).as('firstSavedUid')
            })

        cy.wait('@getSavedAO')
        expectAOTitleToContain(AO_UNTITLED)
        expectAOTitleToContain(AO_DAY)
        expectAOTitleToContain(AO_MONTH)
        expectAOTitleToContain(AO_YEAR)
        expectTableToBeVisible()

        // save as without name change
        cy.log('Save as without name change')
        cy.intercept('GET', /eventVisualizations\/[a-zA-Z][a-zA-Z0-9]{10}/).as(
            'getSavedAsAO'
        )
        saveVisualizationAs()
        cy.wait('@getSavedAsAO')
        cy.url()
            .should('match', uidRe)
            .then((url) => {
                const uid = url.match(uidRe)[1]
                cy.wrap(uid).as('secondSavedUid')
            })
        expectAOTitleToContain(AO_UNTITLED)
        expectAOTitleToContain(AO_DAY)
        expectAOTitleToContain(AO_MONTH)
        expectAOTitleToContain(AO_YEAR)
        expectAOTitleToContain('(copy)')
        expectTableToBeVisible()

        // save as with name change
        cy.log('Save as with name change')
        saveVisualizationAs(UPDATED_AO_NAME)
        expectAOTitleToContainExact(UPDATED_AO_NAME)
        expectTableToBeVisible()

        // delete all the saved AOs
        deleteVisualization()
        cy.get('@firstSavedUid').then(deleteVisualizationWithUid)
        cy.get('@secondSavedUid').then(deleteVisualizationWithUid)
    })

    it('"save" a copied AO created by others works after editing', () => {
        const AO_NAME = 'E2E: Enrollment - Percentage'
        const COPIED_AO_NAME = `${AO_NAME}-copied-${Date.now()}`

        // opens an AO created by others
        goToAO('MKwZRjXiyAJ')
        expectAOTitleToContainExact(AO_NAME)

        // saves AO using "Save As"
        saveVisualizationAs(COPIED_AO_NAME)
        expectAOTitleToContainExact(COPIED_AO_NAME)
        expectTableToBeVisible()

        // edits the AO
        openProgramDimensionsSidebar()
        selectRelativePeriod({
            label: event[DIMENSION_ID_ENROLLMENT_DATE],
            period: TEST_REL_PE_LAST_YEAR,
        })
        clickMenubarUpdateButton()

        expectTableToBeVisible()

        // saves AO using "Save"
        resaveVisualization()
        expectAOTitleToContainExact(COPIED_AO_NAME)
        expectTableToBeVisible()

        // deletes AO
        deleteVisualization()
    })
})
