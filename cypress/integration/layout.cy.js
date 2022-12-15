import {
    E2E_PROGRAM,
    TEST_DIM_TEXT,
    TEST_DIM_LETTER,
    TEST_DIM_LONG_TEXT,
    TEST_DIM_EMAIL,
    TEST_DIM_USERNAME,
    TEST_DIM_URL,
    TEST_DIM_PHONE_NUMBER,
    TEST_DIM_NUMBER,
    TEST_DIM_UNIT_INTERVAL,
    TEST_DIM_PERCENTAGE,
    TEST_DIM_INTEGER,
    TEST_DIM_POSITIVE_INTEGER,
    TEST_DIM_NEGATIVE_INTEGER,
    TEST_DIM_POSITIVE_OR_ZERO,
    TEST_DIM_WITH_PRESET,
} from '../data/index.js'
import { selectEventWithProgramDimensions } from '../helpers/dimensions.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('layout', () => {
    it('expansion caret can be toggled', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        selectEventWithProgramDimensions({
            ...E2E_PROGRAM,
            dimensions: [
                TEST_DIM_TEXT,
                TEST_DIM_LETTER,
                TEST_DIM_LONG_TEXT,
                TEST_DIM_EMAIL,
                TEST_DIM_USERNAME,
                TEST_DIM_URL,
                TEST_DIM_PHONE_NUMBER,
                TEST_DIM_NUMBER,
                TEST_DIM_UNIT_INTERVAL,
                TEST_DIM_PERCENTAGE,
                TEST_DIM_INTEGER,
                TEST_DIM_POSITIVE_INTEGER,
                TEST_DIM_NEGATIVE_INTEGER,
                TEST_DIM_POSITIVE_OR_ZERO,
                TEST_DIM_WITH_PRESET,
            ],
        })

        cy.getBySel('columns-axis')
            .contains(TEST_DIM_POSITIVE_INTEGER)
            .should('be.visible')

        cy.getBySel('layout-height-toggle').click()

        cy.getBySel('columns-axis')
            .contains(TEST_DIM_WITH_PRESET)
            .should('not.be.visible')

        cy.getBySel('layout-height-toggle').click()

        cy.getBySel('columns-axis')
            .contains(TEST_DIM_WITH_PRESET)
            .should('be.visible')
    })
})
