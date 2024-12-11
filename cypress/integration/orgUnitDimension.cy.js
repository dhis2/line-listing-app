import { DIMENSION_ID_ORGUNIT } from '@dhis2/analytics'
import { CHILD_PROGRAM } from '../data/index.js'
import { selectEventWithProgram } from '../helpers/dimensions.js'
import { deleteVisualization, saveVisualization } from '../helpers/fileMenu.js'
import {
    assertChipContainsText,
    assertTooltipContainsEntries,
} from '../helpers/layout.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import {
    clickOrgUnitDimensionModalUpdateButton,
    deselectOrgUnitTreeItem,
    deselectUserOrgUnit,
    expectOrgUnitDimensionModalToBeVisible,
    expectOrgUnitDimensionToNotBeLoading,
    expectOrgUnitItemToBeSelected,
    expectOrgUnitTreeToBeEnabled,
    openOuDimension,
    selectOrgUnitTreeItem,
    selectUserOrgUnit,
    toggleOrgUnitGroup,
    toggleOrgUnitLevel,
} from '../helpers/orgUnit.js'
import { goToStartPage } from '../helpers/startScreen.js'
import {
    expectAOTitleToContain,
    expectTableToBeVisible,
} from '../helpers/table.js'

const TEST_DEFAULT_ORG_UNIT = 'User organisation unit'
const TEST_CHIP_LABEL = 'Organisation unit'

describe(`Org unit dimension`, () => {
    it('selects items correctly', () => {
        const TEST_ROOT = 'Sierra Leone'
        goToStartPage()
        selectEventWithProgram(CHILD_PROGRAM)
        clickMenubarUpdateButton()
        expectTableToBeVisible()
        assertChipContainsText(TEST_CHIP_LABEL, 1)
        assertTooltipContainsEntries(TEST_CHIP_LABEL, [TEST_DEFAULT_ORG_UNIT])

        const TEST_DISTRICT_1 = 'Bo'
        cy.log(`selects a district level org unit - ${TEST_DISTRICT_1}`)
        openOuDimension(DIMENSION_ID_ORGUNIT)
        expectOrgUnitDimensionModalToBeVisible()
        expectOrgUnitDimensionToNotBeLoading()
        expectOrgUnitTreeToBeEnabled()
        deselectUserOrgUnit(TEST_DEFAULT_ORG_UNIT)
        selectOrgUnitTreeItem(TEST_ROOT)
        selectOrgUnitTreeItem(TEST_DISTRICT_1)
        clickOrgUnitDimensionModalUpdateButton()
        expectTableToBeVisible()
        assertChipContainsText(TEST_CHIP_LABEL, 2)
        assertTooltipContainsEntries(TEST_CHIP_LABEL, [
            TEST_ROOT,
            TEST_DISTRICT_1,
        ])

        // FIXME: backend issue DHIS2-16258, uncomment all the lines below once fixed
        // const TEST_DISTRICT_2 = 'Bombali'
        // const TEST_CHIEFDOM = 'Biriwa'
        // cy.log(
        //     `selects a chiefdom level org unit - ${TEST_CHIEFDOM} in ${TEST_DISTRICT_2}`
        // )
        // openOuDimension(DIMENSION_ID_ORGUNIT)
        // expectOrgUnitDimensionModalToBeVisible()
        // expectOrgUnitDimensionToNotBeLoading()
        // expectOrgUnitItemToBeSelected(TEST_ROOT)
        // expectOrgUnitItemToBeSelected(TEST_DISTRICT_1)
        // openOrgUnitTreeItem(TEST_DISTRICT_2)
        // expectOrgUnitDimensionToNotBeLoading()
        // selectOrgUnitTreeItem(TEST_CHIEFDOM)
        // clickOrgUnitDimensionModalUpdateButton()
        // expectTableToBeVisible()
        // assertChipContainsText(TEST_CHIP_LABEL, 3)
        // assertTooltipContainsEntries(TEST_CHIP_LABEL, [
        //     TEST_ROOT,
        //     TEST_DISTRICT_1,
        //     TEST_CHIEFDOM,
        // ])

        // cy.log(`deselects ${TEST_DISTRICT_1} and ${TEST_CHIEFDOM}`)
        openOuDimension(DIMENSION_ID_ORGUNIT)
        expectOrgUnitDimensionModalToBeVisible()
        // expectOrgUnitDimensionToNotBeLoading()
        // expectOrgUnitItemToBeSelected(TEST_ROOT)
        expectOrgUnitItemToBeSelected(TEST_DISTRICT_1)
        // expectOrgUnitItemToBeSelected(TEST_CHIEFDOM)
        deselectOrgUnitTreeItem(TEST_DISTRICT_1)
        // deselectOrgUnitTreeItem(TEST_CHIEFDOM)
        clickOrgUnitDimensionModalUpdateButton()
        expectTableToBeVisible()
        assertChipContainsText(TEST_CHIP_LABEL, 1)
        assertTooltipContainsEntries(TEST_CHIP_LABEL, [TEST_ROOT])

        const TEST_LEVEL = 'District'
        cy.log(`selects a level - ${TEST_LEVEL}`)
        openOuDimension(DIMENSION_ID_ORGUNIT)
        expectOrgUnitDimensionModalToBeVisible()
        expectOrgUnitDimensionToNotBeLoading()
        expectOrgUnitTreeToBeEnabled()
        toggleOrgUnitLevel(TEST_LEVEL)
        clickOrgUnitDimensionModalUpdateButton()
        expectTableToBeVisible()
        assertChipContainsText(TEST_CHIP_LABEL, 2)
        assertTooltipContainsEntries(TEST_CHIP_LABEL, [
            TEST_ROOT,
            `Levels: ${TEST_LEVEL}`,
        ])

        cy.log(`deselects ${TEST_LEVEL}`)
        openOuDimension(DIMENSION_ID_ORGUNIT)
        expectOrgUnitDimensionModalToBeVisible()
        expectOrgUnitDimensionToNotBeLoading()
        toggleOrgUnitLevel(TEST_LEVEL)
        clickOrgUnitDimensionModalUpdateButton()
        expectTableToBeVisible()
        assertChipContainsText(TEST_CHIP_LABEL, 1)
        assertTooltipContainsEntries(TEST_CHIP_LABEL, [TEST_ROOT])

        const TEST_GROUP = 'Eastern Area'
        cy.log(`selects a group - ${TEST_GROUP}`)
        openOuDimension(DIMENSION_ID_ORGUNIT)
        expectOrgUnitDimensionModalToBeVisible()
        expectOrgUnitDimensionToNotBeLoading()
        expectOrgUnitItemToBeSelected(TEST_ROOT)
        toggleOrgUnitGroup(TEST_GROUP)
        clickOrgUnitDimensionModalUpdateButton()
        expectTableToBeVisible()
        assertChipContainsText(TEST_CHIP_LABEL, 2)
        assertTooltipContainsEntries(TEST_CHIP_LABEL, [
            TEST_ROOT,
            `Groups: ${TEST_GROUP}`,
        ])

        cy.log(`deselects ${TEST_GROUP}`)
        openOuDimension(DIMENSION_ID_ORGUNIT)
        expectOrgUnitDimensionModalToBeVisible()
        expectOrgUnitDimensionToNotBeLoading()
        toggleOrgUnitGroup(TEST_GROUP)
        clickOrgUnitDimensionModalUpdateButton()
        expectTableToBeVisible()
        assertChipContainsText(TEST_CHIP_LABEL, 1)
        assertTooltipContainsEntries(TEST_CHIP_LABEL, [TEST_ROOT])

        const TEST_USER_ORG_UNIT = 'User sub-units'
        cy.log(`selects a user org unit - '${TEST_USER_ORG_UNIT}'`)
        openOuDimension(DIMENSION_ID_ORGUNIT)
        expectOrgUnitDimensionModalToBeVisible()
        expectOrgUnitDimensionToNotBeLoading()
        expectOrgUnitItemToBeSelected(TEST_ROOT)
        expectOrgUnitTreeToBeEnabled()
        selectUserOrgUnit(TEST_USER_ORG_UNIT)
        expectOrgUnitTreeToBeEnabled()
        clickOrgUnitDimensionModalUpdateButton()
        expectTableToBeVisible()
        assertChipContainsText(TEST_CHIP_LABEL, 2)
        assertTooltipContainsEntries(TEST_CHIP_LABEL, [TEST_USER_ORG_UNIT])

        cy.log(`deselects '${TEST_USER_ORG_UNIT}'`)
        openOuDimension(DIMENSION_ID_ORGUNIT)
        expectOrgUnitDimensionModalToBeVisible()
        expectOrgUnitDimensionToNotBeLoading()
        expectOrgUnitTreeToBeEnabled()
        deselectUserOrgUnit(TEST_USER_ORG_UNIT)
        expectOrgUnitTreeToBeEnabled()
        expectOrgUnitItemToBeSelected(TEST_ROOT)
        clickOrgUnitDimensionModalUpdateButton()
        expectTableToBeVisible()
        assertChipContainsText(TEST_CHIP_LABEL, 1)
        assertTooltipContainsEntries(TEST_CHIP_LABEL, [TEST_ROOT])
    })

    it('saves and loads items correctly', () => {
        const TEST_DISTRICTS = ['Port Loko', 'Pujehun', 'Tonkolili']
        const TEST_LEVEL = 'District'

        goToStartPage()
        selectEventWithProgram(CHILD_PROGRAM)
        cy.log('selects districts and level')
        openOuDimension(DIMENSION_ID_ORGUNIT)
        expectOrgUnitDimensionModalToBeVisible()
        expectOrgUnitDimensionToNotBeLoading()
        expectOrgUnitTreeToBeEnabled()
        deselectUserOrgUnit(TEST_DEFAULT_ORG_UNIT)
        TEST_DISTRICTS.forEach((district) => selectOrgUnitTreeItem(district))
        toggleOrgUnitLevel(TEST_LEVEL)
        clickOrgUnitDimensionModalUpdateButton()
        expectTableToBeVisible()
        assertChipContainsText(TEST_CHIP_LABEL, 4)
        assertTooltipContainsEntries(TEST_CHIP_LABEL, [
            ...TEST_DISTRICTS,
            `Levels: ${TEST_LEVEL}`,
        ])

        cy.log('saves AO')
        const AO_NAME = `TEST ${new Date().toLocaleString()}`
        saveVisualization(AO_NAME)
        expectAOTitleToContain(AO_NAME)

        cy.log('asserts that districts are still selected')
        assertChipContainsText(TEST_CHIP_LABEL, 4)
        assertTooltipContainsEntries(TEST_CHIP_LABEL, [
            ...TEST_DISTRICTS,
            `Levels: ${TEST_LEVEL}`,
        ])
        openOuDimension(DIMENSION_ID_ORGUNIT)
        expectOrgUnitDimensionModalToBeVisible()
        expectOrgUnitDimensionToNotBeLoading()
        TEST_DISTRICTS.forEach((district) =>
            expectOrgUnitItemToBeSelected(district)
        )
        cy.getBySelLike('modal-action-cancel').click()
        deleteVisualization()
    })
})
