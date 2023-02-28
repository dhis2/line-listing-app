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
    TEST_DIM_INTEGER_POSITIVE,
    TEST_DIM_INTEGER_NEGATIVE,
    TEST_DIM_INTEGER_ZERO_OR_POSITIVE,
    TEST_DIM_WITH_PRESET,
} from '../data/index.js'
import { selectEventWithProgramDimensions } from '../helpers/dimensions.js'
import { goToStartPage } from '../helpers/startScreen.js'

describe('layout', () => {
    it('expansion caret can be toggled', () => {
        goToStartPage()
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
                TEST_DIM_INTEGER_POSITIVE,
                TEST_DIM_INTEGER_NEGATIVE,
                TEST_DIM_INTEGER_ZERO_OR_POSITIVE,
                TEST_DIM_WITH_PRESET,
            ],
        })

        cy.getBySel('columns-axis')
            .contains(TEST_DIM_INTEGER_POSITIVE)
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
