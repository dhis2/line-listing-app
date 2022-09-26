import { HIV_PROGRAM, TEST_REL_PE_LAST_12_MONTHS } from '../data/index.js'
import { selectEventProgram } from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod } from '../helpers/period.js'
import { expectTableToBeVisible } from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const openContextMenu = (id) =>
    cy
        .getBySel('main-sidebar')
        .findBySel(`dimension-item-${id}`)
        .findBySel('dimension-menu-button')
        .invoke('attr', 'style', 'visibility: initial')
        .click()

describe('layout validation', () => {
    it('columns is required', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        // remove org unit
        openContextMenu('ou')
        cy.containsExact('Remove').click()

        clickMenubarUpdateButton()

        cy.getBySel('error-container').contains('Columns is empty')
    })
    it('org unit dimension is required', () => {
        // add something other than org unit to columns
        openContextMenu('lastUpdatedBy')
        cy.containsExact('Add to Columns').click()

        clickMenubarUpdateButton()

        cy.getBySel('error-container').contains('No organisation unit selected')
    })
    it('time dimension is required', () => {
        // remove previously added dimension
        openContextMenu('lastUpdatedBy')
        cy.containsExact('Remove').click()

        // add org unit to columns
        openContextMenu('ou')
        cy.containsExact('Add to Columns').click()

        clickMenubarUpdateButton()

        cy.getBySel('error-container').contains('No time dimension selected')
    })
    it('program is required', () => {
        // add a time dimension to columns
        selectRelativePeriod({
            label: 'Event date',
            period: TEST_REL_PE_LAST_12_MONTHS,
        })

        clickMenubarUpdateButton()

        cy.getBySel('error-container').contains('No program selected')
    })
    it('stage is required', () => {
        // select a program
        selectEventProgram({ programName: HIV_PROGRAM.programName })

        clickMenubarUpdateButton()

        cy.getBySel('error-container').contains('No stage selected')
    })
    it('validation succeeds when all above are provided', () => {
        // select a stage
        selectEventProgram({
            programName: HIV_PROGRAM.programName,
            stageName: HIV_PROGRAM.stageName,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()
    })
})
