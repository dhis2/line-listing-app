import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
} from '../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_FIX_PE_DEC_LAST_YEAR,
    TEST_REL_PE_LAST_YEAR,
} from '../data/index.js'
import { goToAO } from '../helpers/common.js'
import {
    openProgramDimensionsSidebar,
    selectEventWithProgram,
} from '../helpers/dimensions.js'
import {
    deleteVisualization,
    renameVisualization,
    resaveVisualization,
    saveVisualization,
    saveVisualizationAs,
} from '../helpers/fileMenu.js'
import {
    clickMenubarUpdateButton,
    clickMenubarInterpretationsButton,
} from '../helpers/menubar.js'
import { selectFixedPeriod, selectRelativePeriod } from '../helpers/period.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    expectAOTitleToContain,
    expectTableToBeVisible,
} from '../helpers/table.js'

const event = E2E_PROGRAM
const periodLabel = event[DIMENSION_ID_EVENT_DATE]

const setupTable = () => {
    goToStartPage()
    selectEventWithProgram(event)
    openProgramDimensionsSidebar()
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
        const UPDATED_AO_NAME = AO_NAME + ' 2'
        setupTable()

        // save
        saveVisualization(AO_NAME)
        expectAOTitleToContain(AO_NAME)
        expectTableToBeVisible()

        // rename the AO, changing name only
        renameVisualization(UPDATED_AO_NAME)

        cy.reload()

        expectAOTitleToContain(UPDATED_AO_NAME)

        deleteVisualization()
    })

    it('add non existing description works correctly', () => {
        const AO_NAME = `TEST RENAME ${new Date().toLocaleString()}`
        const AO_DESC = 'with description'
        const AO_DESC_UPDATED = AO_DESC + ' edited'
        setupTable()

        // save
        saveVisualization(AO_NAME)
        expectAOTitleToContain(AO_NAME)
        expectTableToBeVisible()

        // rename the AO, adding a description
        renameVisualization(AO_NAME, AO_DESC)

        clickMenubarInterpretationsButton()
        cy.getBySel('details-panel').should('be.visible')
        cy.getBySel('details-panel').contains(AO_DESC)
        clickMenubarInterpretationsButton()

        expectTableToBeVisible()

        // rename the AO, replacing the description
        renameVisualization(AO_NAME, AO_DESC_UPDATED)

        clickMenubarInterpretationsButton()
        cy.getBySel('details-panel').should('be.visible')
        cy.getBySel('details-panel').contains(AO_DESC_UPDATED)
        clickMenubarInterpretationsButton()

        expectTableToBeVisible()

        deleteVisualization()
    })
})

describe('save', () => {
    it('new AO with name saves correctly', () => {
        const AO_NAME = `TEST ${new Date().toLocaleString()}`
        const UPDATED_AO_NAME = AO_NAME + ' 2'
        setupTable()

        // save with a name
        saveVisualization(AO_NAME)
        expectAOTitleToContain(AO_NAME)
        expectTableToBeVisible()

        // save as with name change
        saveVisualizationAs(UPDATED_AO_NAME)
        expectAOTitleToContain(UPDATED_AO_NAME)
        expectTableToBeVisible()

        // save as without name change
        saveVisualizationAs()
        expectAOTitleToContain(UPDATED_AO_NAME + ' (copy)')
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
        expectAOTitleToContain(EXPECTED_AO_NAME_PART_1)
        expectAOTitleToContain(EXPECTED_AO_NAME_PART_2)
        expectAOTitleToContain(EXPECTED_AO_NAME_PART_3)
        expectAOTitleToContain(EXPECTED_AO_NAME_PART_4)
        expectTableToBeVisible()

        // save as without name change
        saveVisualizationAs()
        expectAOTitleToContain(EXPECTED_AO_NAME_PART_1)
        expectAOTitleToContain(EXPECTED_AO_NAME_PART_2)
        expectAOTitleToContain(EXPECTED_AO_NAME_PART_3)
        expectAOTitleToContain(EXPECTED_AO_NAME_PART_4)
        expectAOTitleToContain('(copy)')
        expectTableToBeVisible()

        // save as with name change
        saveVisualizationAs(UPDATED_AO_NAME)
        expectAOTitleToContain(UPDATED_AO_NAME)
        expectTableToBeVisible()

        deleteVisualization()
    })

    it('"save" a copied AO created by others works after editing', () => {
        const AO_NAME = 'E2E: Enrollment - Percentage'
        const COPIED_AO_NAME = `${AO_NAME} - copied ${new Date().toLocaleString()}`

        // opens an AO created by others
        goToAO('MKwZRjXiyAJ')
        expectAOTitleToContain(AO_NAME)

        // saves AO using "Save As"
        saveVisualizationAs(COPIED_AO_NAME)
        expectAOTitleToContain(COPIED_AO_NAME)
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
        expectAOTitleToContain(COPIED_AO_NAME)
        expectTableToBeVisible()

        // deletes AO
        deleteVisualization()
    })
})
