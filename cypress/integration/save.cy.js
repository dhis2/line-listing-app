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
    renameVisualization,
    resaveVisualization,
    saveVisualization,
    saveVisualizationAs,
} from '../helpers/fileMenu.js'
import { expectAxisToHaveDimension } from '../helpers/layout.js'
import {
    clickMenubarUpdateButton,
    clickMenubarInterpretationsButton,
} from '../helpers/menubar.js'
import { selectFixedPeriod, selectRelativePeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    expectAOTitleToContainExact,
    expectTableToBeUpdated,
    expectTableToBeVisible,
    getTableHeaderCells,
    getTableRows,
} from '../helpers/table.js'

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

describe('rename', () => {
    it('replace existing name works correctly', () => {
        const AO_NAME = `TEST RENAME ${new Date().toLocaleString()}`
        const UPDATED_AO_NAME = AO_NAME + ' superduper'
        setupTable()

        // save
        saveVisualization(AO_NAME)
        expectAOTitleToContainExact(AO_NAME)
        expectTableToBeVisible()

        cy.intercept('PUT', '**/api/*/eventVisualizations/*').as('put-rename')

        // rename the AO, changing name only
        renameVisualization(UPDATED_AO_NAME)

        cy.wait('@put-rename')

        cy.getBySel('dhis2-uicore-alertbar')
            .contains('Rename successful')
            .should('be.visible')
        expectTableToBeVisible()
        expectAOTitleToContainExact(AO_NAME)

        cy.reload(true)

        expectTableToBeVisible()
        expectAOTitleToContainExact(UPDATED_AO_NAME)

        deleteVisualization()
    })

    it('add and change and delete name and description', () => {
        const AO_NAME = `TEST RENAME ${new Date().toLocaleString()}`
        const AO_DESC = 'with description'
        const AO_DESC_UPDATED = AO_DESC + ' edited'
        setupTable()

        // save
        saveVisualization(AO_NAME)
        expectAOTitleToContainExact(AO_NAME)
        expectTableToBeVisible()

        // rename the AO, adding a description
        renameVisualization(AO_NAME, AO_DESC)

        clickMenubarInterpretationsButton()
        cy.getBySel('details-panel').should('be.visible')
        cy.getBySel('details-panel').containsExact(AO_DESC)
        clickMenubarInterpretationsButton()

        expectTableToBeVisible()

        // rename the AO, replacing the description
        renameVisualization(AO_NAME, AO_DESC_UPDATED)

        clickMenubarInterpretationsButton()
        cy.getBySel('details-panel').should('be.visible')
        cy.getBySel('details-panel').containsExact(AO_DESC_UPDATED)
        clickMenubarInterpretationsButton()

        expectTableToBeVisible()

        // now enter empty strings for the name and description
        renameVisualization('', '')

        clickMenubarInterpretationsButton()
        cy.getBySel('details-panel').should('be.visible')
        cy.getBySel('details-panel').containsExact('No description')
        clickMenubarInterpretationsButton()

        cy.reload(true)

        // title is not deleted
        cy.getBySel('titlebar').containsExact(AO_NAME)
        clickMenubarInterpretationsButton()
        cy.getBySel('details-panel').should('be.visible')
        // description was successfully deleted
        cy.getBySel('details-panel').contains('No description')
        clickMenubarInterpretationsButton()

        deleteVisualization()
    })

    it('handles failure when renaming', () => {
        const AO_NAME = `TEST RENAME ${new Date().toLocaleString()}`
        const UPDATED_AO_NAME = AO_NAME + ' superduper'
        setupTable()

        // save
        saveVisualization(AO_NAME)
        expectAOTitleToContainExact(AO_NAME)
        expectTableToBeVisible()

        cy.intercept('PUT', '**/api/*/eventVisualizations/*', {
            statusCode: 409,
        }).as('put-rename')

        // rename the AO, changing name only
        renameVisualization(UPDATED_AO_NAME)

        cy.wait('@put-rename')

        cy.getBySel('dhis2-uicore-alertbar')
            .contains('Rename failed')
            .should('be.visible')
        expectTableToBeVisible()
        expectAOTitleToContainExact(AO_NAME)

        cy.reload(true)

        expectTableToBeVisible()
        expectAOTitleToContainExact(AO_NAME)

        deleteVisualization()
    })
})

describe('save', () => {
    it('new AO with name saves correctly (event)', () => {
        const AO_NAME = `TEST event ${new Date().toLocaleString()}`
        const UPDATED_AO_NAME = AO_NAME + ' superduper'
        setupTable()

        // save with a name
        saveVisualization(AO_NAME)
        expectAOTitleToContainExact(AO_NAME)
        expectTableToBeVisible()

        // open AO by name
        goToStartPage()
        openAOByName(AO_NAME)
        expectTableToBeVisible()

        // save as with name change
        saveVisualizationAs(UPDATED_AO_NAME)
        expectAOTitleToContainExact(UPDATED_AO_NAME)
        expectTableToBeVisible()

        // save as without name change
        saveVisualizationAs()
        expectAOTitleToContainExact(UPDATED_AO_NAME + ' (copy)')
        expectTableToBeVisible()

        deleteVisualization()
    })

    it(['>=41'], 'new AO with name saves correctly (TE)', () => {
        const AO_NAME = `TEST TE ${new Date().toLocaleString()}`
        const UPDATED_AO_NAME = AO_NAME + ' superduper'

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

        // save as without name change
        saveVisualizationAs()
        expectAOTitleToContainExact(UPDATED_AO_NAME + ' (copy)')
        expectTableToBeVisible()

        // delete AO to clean up
        deleteVisualization()
    })

    it('new AO with sorted table saves correctly', () => {
        const AO_NAME = `TEST SORTING ${new Date().toLocaleString()}`
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
        const AO_NAME = `TEST SORTING TOGGLING ${new Date().toLocaleString()}`
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

        deleteVisualization()
    })

    it('new AO without name saves correctly', () => {
        cy.clock(cy.clock(Date.UTC(2022, 11, 29), ['Date'])) // month is 0-indexed, 11 = December
        const EXPECTED_AO_NAME_PART_1 = 'Untitled Line list visualization'
        const EXPECTED_AO_NAME_PART_2 = '29'
        const EXPECTED_AO_NAME_PART_3 = 'Dec'
        const EXPECTED_AO_NAME_PART_4 = '2022' // locally the date is "29 Dec 2022" but on CI it's "Dec 29, 2022", so it's split into different parts to cater for both cases
        const UPDATED_AO_NAME = `TEST ${new Date().toLocaleString()}`
        setupTable()

        // save without a name
        saveVisualization()
        expectAOTitleToContainExact(EXPECTED_AO_NAME_PART_1)
        expectAOTitleToContainExact(EXPECTED_AO_NAME_PART_2)
        expectAOTitleToContainExact(EXPECTED_AO_NAME_PART_3)
        expectAOTitleToContainExact(EXPECTED_AO_NAME_PART_4)
        expectTableToBeVisible()

        // save as without name change
        saveVisualizationAs()
        expectAOTitleToContainExact(EXPECTED_AO_NAME_PART_1)
        expectAOTitleToContainExact(EXPECTED_AO_NAME_PART_2)
        expectAOTitleToContainExact(EXPECTED_AO_NAME_PART_3)
        expectAOTitleToContainExact(EXPECTED_AO_NAME_PART_4)
        expectAOTitleToContainExact('(copy)')
        expectTableToBeVisible()

        // save as with name change
        saveVisualizationAs(UPDATED_AO_NAME)
        expectAOTitleToContainExact(UPDATED_AO_NAME)
        expectTableToBeVisible()

        deleteVisualization()
    })

    it('"save" a copied AO created by others works after editing', () => {
        const AO_NAME = 'E2E: Enrollment - Percentage'
        const COPIED_AO_NAME = `${AO_NAME} - copied ${new Date().toLocaleString()}`

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
