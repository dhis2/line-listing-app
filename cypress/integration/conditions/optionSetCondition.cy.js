import { DIMENSION_ID_EVENT_DATE } from '../../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    WHO_RMNCH_TRACKER_PROGRAM,
    TEST_DIM_NUMBER_OPTIONSET,
    TEST_DIM_TEXT_OPTIONSET,
    TEST_REL_PE_THIS_YEAR,
    TEST_REL_PE_LAST_YEAR,
    TEST_REL_PE_LAST_5_YEARS,
} from '../../data/index.js'
import {
    openDimension,
    openProgramDimensionsSidebar,
    selectEventWithProgram,
    selectEventWithProgramDimensions,
} from '../../helpers/dimensions.js'
import {
    deleteVisualization,
    saveVisualization,
} from '../../helpers/fileMenu.js'
import {
    assertChipContainsText,
    assertTooltipContainsEntries,
} from '../../helpers/layout.js'
import { clickMenubarUpdateButton } from '../../helpers/menubar.js'
import {
    selectRelativePeriod,
    getPreviousYearStr,
} from '../../helpers/period.js'
import { goToStartPage } from '../../helpers/startScreen.js'
import {
    getTableRows,
    expectAOTitleToContain,
    expectTableToBeVisible,
    expectTableToContainValue,
    expectTableToMatchRows,
    expectTableToNotContainValue,
} from '../../helpers/table.js'
import {
    searchAndSelectInOptionsTransfer,
    selectInOptionsTransfer,
} from '../../helpers/transfer.js'

describe('Option set condition', () => {
    it('Option set (number) displays correctly', () => {
        const dimensionName = TEST_DIM_NUMBER_OPTIONSET
        const valueToFilterBy = 'Eight'
        const valueToFilterOut = 'Four'

        goToStartPage()

        selectEventWithProgram(E2E_PROGRAM)

        openProgramDimensionsSidebar()

        selectRelativePeriod({
            label: E2E_PROGRAM[DIMENSION_ID_EVENT_DATE],
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        openDimension(dimensionName)

        cy.getBySel('button-add-condition').should('not.exist')

        cy.contains('Add to Columns').click()

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        expectTableToContainValue(valueToFilterBy)
        expectTableToContainValue(valueToFilterOut)

        assertChipContainsText(dimensionName, 'all')

        openDimension(dimensionName)

        searchAndSelectInOptionsTransfer(valueToFilterBy)

        cy.getBySel('conditions-modal').contains('Update').click()

        expectTableToBeVisible()

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [valueToFilterBy])

        expectTableToNotContainValue(valueToFilterOut)
        expectTableToContainValue(valueToFilterBy)

        expectTableToMatchRows([
            `${getPreviousYearStr()}-12-23`,
            `${getPreviousYearStr()}-12-22`,
        ])
    })

    it('Option set (text) displays correctly', () => {
        const dimensionName = TEST_DIM_TEXT_OPTIONSET
        const filteredOutOptionName = 'COVID 19 - Moderna'
        const filteredOptionName = 'COVID 19 - AstraZeneca'

        goToStartPage()

        selectEventWithProgram(E2E_PROGRAM)

        openProgramDimensionsSidebar()

        selectRelativePeriod({
            label: E2E_PROGRAM[DIMENSION_ID_EVENT_DATE],
            period: TEST_REL_PE_LAST_YEAR,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        openDimension(dimensionName)

        cy.getBySel('button-add-condition').should('not.exist')

        cy.contains('Add to Columns').click()

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        expectTableToContainValue(filteredOutOptionName)
        expectTableToContainValue(filteredOptionName)

        assertChipContainsText(dimensionName, 'all')

        openDimension(dimensionName)

        searchAndSelectInOptionsTransfer(filteredOptionName)

        cy.getBySel('conditions-modal').contains('Update').click()

        assertChipContainsText(dimensionName, 1)

        assertTooltipContainsEntries(dimensionName, [filteredOptionName])

        expectTableToNotContainValue(filteredOutOptionName)
        expectTableToContainValue(filteredOptionName)

        expectTableToMatchRows([`${getPreviousYearStr()}-12-10`])
    })

    it('Options with same code but from different option sets display correctly', () => {
        const testData = [
            {
                dimensionName: 'WHOMCH Pain medication given',
                filteredOptionNames: ['Morphine', 'Spinal'],
            },
            {
                dimensionName: 'WHOMCH Clinical impression of pre-eclampsia',
                filteredOptionNames: [
                    'None',
                    'Pre-eclampsia',
                    'Severe pre-eclampsia',
                ],
            },
        ]

        const assertTableChipAndTooltip = () => {
            getTableRows()
                .eq(0)
                .find('td')
                .eq(3)
                .invoke('text')
                .then(($cell3Value) =>
                    expect($cell3Value).to.equal('Pre-eclampsia')
                )

            getTableRows()
                .eq(0)
                .find('td')
                .eq(4)
                .invoke('text')
                .then(($cell4Value) =>
                    expect($cell4Value).to.equal('Suspected')
                )

            getTableRows()
                .eq(0)
                .find('td')
                .eq(5)
                .invoke('text')
                .then(($cell5Value) => expect($cell5Value).to.equal('Morphine'))

            testData.forEach(({ dimensionName, filteredOptionNames }) => {
                assertChipContainsText(
                    dimensionName,
                    filteredOptionNames.length
                )

                assertTooltipContainsEntries(dimensionName, filteredOptionNames)
            })
        }

        const eventProgram = WHO_RMNCH_TRACKER_PROGRAM

        goToStartPage()

        selectEventWithProgramDimensions({
            programName: eventProgram.programName,
            stageName: eventProgram.stageName,
            dimensions: [
                'First name',
                'Last name',
                'WHOMCH Clinical impression of pre-eclampsia',
                'WHOMCH Confirmed or suspected infection',
                'WHOMCH Pain medication given',
            ],
        })

        selectRelativePeriod({
            label: eventProgram[DIMENSION_ID_EVENT_DATE],
            period: TEST_REL_PE_THIS_YEAR,
        })

        selectRelativePeriod({
            label: eventProgram[DIMENSION_ID_EVENT_DATE],
            period: TEST_REL_PE_LAST_5_YEARS,
        })

        // Narrow down rows to the one we need for testing
        cy.getBySelLike('layout-chip').contains('First name').click()
        cy.getBySel('button-add-condition').click()
        cy.contains('Choose a condition type').click()
        cy.contains('exactly').click()
        cy.getBySel('alphanumeric-condition')
            .find('input[type="text"]')
            .type('sandra')
        cy.getBySel('conditions-modal').contains('Hide').click()

        cy.getBySelLike('layout-chip').contains('Last name').click()
        cy.getBySel('button-add-condition').click()
        cy.contains('Choose a condition type').click()
        cy.contains('exactly').click()
        cy.getBySel('alphanumeric-condition')
            .find('input[type="text"]')
            .type('cook')

        cy.getBySel('conditions-modal').contains('Hide').click()

        // select some items in option set for testing tooltips
        testData.forEach(({ dimensionName, filteredOptionNames }) => {
            cy.getBySelLike('layout-chip').contains(dimensionName).click()

            filteredOptionNames.forEach(selectInOptionsTransfer)

            cy.getBySel('conditions-modal').contains('Hide').click()
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()

        // Table and tooltips should show the correct labels for option set
        assertTableChipAndTooltip()

        const AO_NAME = `TEST option set ${new Date().toLocaleString()}`
        saveVisualization(AO_NAME)

        expectAOTitleToContain(AO_NAME)

        // reload
        cy.reload(true)

        expectAOTitleToContain(AO_NAME)
        expectTableToBeVisible()

        // Table and tooltips should show the correct labels also when loading a saved AO
        assertTableChipAndTooltip()

        deleteVisualization()
    })
})
