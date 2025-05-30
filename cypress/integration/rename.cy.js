import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_FIX_PE_DEC_LAST_YEAR,
    TEST_DIM_INTEGER,
} from '../data/index.js'
import { selectEventWithProgramDimensions } from '../helpers/dimensions.js'
import {
    deleteVisualization,
    renameVisualization,
    saveVisualization,
} from '../helpers/fileMenu.js'
import {
    clickMenubarUpdateButton,
    clickMenubarInterpretationsButton,
} from '../helpers/menubar.js'
import { selectFixedPeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    expectAOTitleToContainExact,
    expectTableToBeVisible,
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
        const AO_NAME = `SAVE-${Date.now()}-RENAME`
        const UPDATED_AO_NAME = AO_NAME + '-superduper'
        setupTable()

        // save
        saveVisualization(AO_NAME)
        expectAOTitleToContainExact(AO_NAME)
        expectTableToBeVisible()

        cy.intercept(
            'GET',
            /\/api\/\d+\/eventVisualizations\/\w+\?fields=.*/
        ).as('get-rename')

        cy.intercept('PUT', /\/api\/\d+\/eventVisualizations\/\w+/, (req) => {
            expect(req.body).to.have.property('subscribers')
            expect(req.body).to.have.property('filters')
        }).as('put-rename')
        // rename the AO, changing name only
        renameVisualization(UPDATED_AO_NAME)

        cy.wait('@get-rename')
        cy.wait('@put-rename')
        cy.wait('@get-rename')

        cy.getBySel('dhis2-uicore-alertbar')
            .contains('Rename successful')
            .should('be.visible')
        expectTableToBeVisible()
        expectAOTitleToContainExact(UPDATED_AO_NAME)

        cy.reload(true)

        expectTableToBeVisible()
        expectAOTitleToContainExact(UPDATED_AO_NAME)

        deleteVisualization()
    })

    it('add and change and delete name and description', () => {
        const AO_NAME = `SAVE-${Date.now()}-RENAME`
        const AO_DESC = 'w/description'
        const AO_DESC_UPDATED = AO_DESC + '-edited'
        setupTable()

        // save
        saveVisualization(AO_NAME)
        expectAOTitleToContainExact(AO_NAME)
        expectTableToBeVisible()

        cy.intercept('PUT', '**/api/*/eventVisualizations/*').as('put-rename')
        // rename the AO, adding a description
        renameVisualization(AO_NAME, AO_DESC)
        cy.wait('@put-rename')

        clickMenubarInterpretationsButton()
        cy.getBySel('details-panel').should('be.visible')
        cy.getBySel('details-panel').containsExact(AO_DESC)
        clickMenubarInterpretationsButton()

        expectTableToBeVisible()

        cy.intercept('PUT', '**/api/*/eventVisualizations/*').as('put-rename2')
        // rename the AO, replacing the description
        renameVisualization(AO_NAME, AO_DESC_UPDATED)
        cy.wait('@put-rename2')

        clickMenubarInterpretationsButton()
        cy.getBySel('details-panel').should('be.visible')
        cy.getBySel('details-panel').containsExact(AO_DESC_UPDATED)
        clickMenubarInterpretationsButton()

        expectTableToBeVisible()

        cy.intercept('PUT', '**/api/*/eventVisualizations/*').as('put-rename3')
        // now enter empty strings for the name and description
        renameVisualization('', '')
        cy.wait('@put-rename3')

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
        const AO_NAME = `SAVE-${Date.now()}-RENAME`
        const UPDATED_AO_NAME = AO_NAME + '-superduper'
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
