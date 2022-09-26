import {
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_LAST_UPDATED,
    DIMENSION_ID_SCHEDULED_DATE,
} from '../../src/modules/dimensionConstants.js'
import { HIV_PROGRAM } from '../data/index.js'
import {
    dimensionIsDisabled,
    dimensionIsEnabled,
} from '../helpers/dimensions.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('program dimensions', () => {
    beforeEach(() => {
        cy.visit('/')

        cy.getBySel('main-sidebar', EXTENDED_TIMEOUT).should('be.visible')

        cy.getBySel('main-sidebar').contains('Program dimensions').click()
    })

    describe('event', () => {
        const event = HIV_PROGRAM

        it('program can be selected and cleared', () => {
            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('program-clear-button').should('not.exist')

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            // select program

            cy.contains(event.programName).click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a program and stage above to add program dimensions.'
            )

            cy.getBySel('program-select').find('.disabled').should('be.visible')

            cy.getBySel('program-clear-button').should('be.visible')

            // clear program

            cy.getBySel('program-clear-button').click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('accessory-sidebar').contains('Choose a program')

            cy.getBySel('program-select').find('.disabled').should('not.exist')

            cy.getBySel('program-clear-button').should('not.exist')
        })

        it('stage can be selected and cleared', () => {
            // check which dimensions are enabled / disabled
            // TODO: add checks for event status, program status, created by, last updated by
            dimensionIsEnabled('dimension-item-eventDate')
            cy.getBySel('dimension-item-eventDate').contains('Event date')

            dimensionIsDisabled('dimension-item-enrollmentDate')
            cy.getBySel('dimension-item-enrollmentDate').contains(
                'Enrollment date'
            )

            dimensionIsDisabled('dimension-item-scheduledDate')
            cy.getBySel('dimension-item-scheduledDate').contains(
                'Scheduled date'
            )

            dimensionIsDisabled('dimension-item-incidentDate')
            cy.getBySel('dimension-item-incidentDate').contains('Incident date')

            dimensionIsEnabled('dimension-item-lastUpdated')
            cy.getBySel('dimension-item-lastUpdated').contains(
                'Last updated on'
            )

            // select program

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            cy.contains(event.programName).click()

            cy.getBySel('accessory-sidebar').contains('Stage')

            cy.getBySel('stage-clear-button').should('not.exist')

            // select stage

            cy.getBySel('accessory-sidebar').contains('Stage').click()

            cy.contains(event.stageName).click()

            cy.getBySel('stage-select').find('.disabled').should('be.visible')

            cy.getBySel('stage-clear-button').should('be.visible')

            cy.getBySel('accessory-sidebar').contains('All types')

            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .its('length')
                .should('be.gte', 1)

            // check which dimensions are enabled / disabled
            dimensionIsEnabled('dimension-item-eventDate')
            cy.getBySel('dimension-item-eventDate').contains(
                event[DIMENSION_ID_EVENT_DATE]
            )

            dimensionIsEnabled('dimension-item-enrollmentDate')
            cy.getBySel('dimension-item-enrollmentDate').contains(
                event[DIMENSION_ID_ENROLLMENT_DATE]
            )

            dimensionIsEnabled('dimension-item-scheduledDate')
            cy.getBySel('dimension-item-scheduledDate').contains(
                event[DIMENSION_ID_SCHEDULED_DATE]
            )

            dimensionIsDisabled('dimension-item-incidentDate')
            cy.getBySel('dimension-item-incidentDate').contains(
                event[DIMENSION_ID_INCIDENT_DATE]
            )

            dimensionIsEnabled('dimension-item-lastUpdated')
            cy.getBySel('dimension-item-lastUpdated').contains(
                event[DIMENSION_ID_LAST_UPDATED]
            )

            // clear stage

            cy.getBySel('stage-clear-button').click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a program and stage above to add program dimensions.'
            )

            cy.getBySel('accessory-sidebar').contains('Stage')

            cy.getBySel('stage-select').find('.disabled').should('not.exist')

            cy.getBySel('stage-clear-button').should('not.exist')

            // check which dimensions are enabled / disabled
            dimensionIsEnabled('dimension-item-eventDate')
            cy.getBySel('dimension-item-eventDate').contains('Event date')

            dimensionIsEnabled('dimension-item-enrollmentDate')
            cy.getBySel('dimension-item-enrollmentDate').contains(
                event[DIMENSION_ID_ENROLLMENT_DATE]
            )

            dimensionIsEnabled('dimension-item-scheduledDate')
            cy.getBySel('dimension-item-scheduledDate').contains(
                event[DIMENSION_ID_SCHEDULED_DATE]
            )

            dimensionIsDisabled('dimension-item-incidentDate')
            cy.getBySel('dimension-item-incidentDate').contains(
                event[DIMENSION_ID_INCIDENT_DATE]
            )

            dimensionIsEnabled('dimension-item-lastUpdated')
            cy.getBySel('dimension-item-lastUpdated').contains(
                event[DIMENSION_ID_LAST_UPDATED]
            )
        })
    })

    describe('enrollment', () => {
        beforeEach(() => {
            cy.getBySel('main-sidebar').contains('Input: Event').click()

            cy.getBySel('input-enrollment').click()

            cy.getBySel('main-sidebar').contains('Input: Enrollment').click()

            cy.getBySel('main-sidebar').contains('Program dimensions').click()
        })

        it('program can be selected and cleared', () => {
            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('program-clear-button').should('not.exist')

            cy.getBySel('accessory-sidebar')
                .contains('Choose a program')
                .click()

            // select program

            cy.contains('HIV Case Surveillance').click()

            cy.getBySel('program-select').find('.disabled').should('be.visible')

            cy.getBySel('program-clear-button').should('be.visible')

            cy.getBySel('accessory-sidebar').contains('All types')

            cy.getBySel('program-dimensions-list')
                .findBySelLike('dimension-item')
                .its('length')
                .should('be.gte', 1)

            // clear program

            cy.getBySel('program-clear-button').click()

            cy.getBySel('accessory-sidebar').contains(
                'Choose a program above to add program dimensions.'
            )

            cy.getBySel('accessory-sidebar').contains('Choose a program')

            cy.getBySel('program-select').find('.disabled').should('not.exist')

            cy.getBySel('program-clear-button').should('not.exist')
        })
    })
})

// TODO: add tests for search, type filtering and selecting dimensions
