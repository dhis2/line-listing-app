import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import {
    E2E_PROGRAM,
    TEST_DIM_TEXT,
    TEST_DIM_TEXT_OPTIONSET,
    TEST_DIM_NUMBER_OPTIONSET,
    TEST_DIM_NUMBER,
    TEST_DIM_INTEGER,
    TEST_DIM_INTEGER_POSITIVE,
    TEST_DIM_INTEGER_NEGATIVE,
    TEST_DIM_INTEGER_ZERO_OR_POSITIVE,
    TEST_DIM_PERCENTAGE,
    TEST_DIM_UNIT_INTERVAL,
    TEST_DIM_TIME,
    TEST_DIM_DATE,
    TEST_DIM_DATETIME,
    TEST_DIM_PHONE_NUMBER,
    TEST_REL_PE_LAST_12_MONTHS,
} from '../data/index.js'
import { selectEventWithProgramDimensions } from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod } from '../helpers/period.js'
import { getTableDataCells } from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

describe('value', () => {
    beforeEach(() => {
        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventWithProgramDimensions({
            programName: E2E_PROGRAM.programName,
            dimensions: [
                TEST_DIM_TEXT,
                TEST_DIM_TEXT_OPTIONSET,
                TEST_DIM_NUMBER_OPTIONSET,
                TEST_DIM_NUMBER,
                TEST_DIM_INTEGER,
                TEST_DIM_INTEGER_POSITIVE,
                TEST_DIM_INTEGER_NEGATIVE,
                TEST_DIM_INTEGER_ZERO_OR_POSITIVE,
                TEST_DIM_PERCENTAGE,
                TEST_DIM_UNIT_INTERVAL,
                TEST_DIM_TIME,
                TEST_DIM_DATE,
                TEST_DIM_DATETIME,
                TEST_DIM_PHONE_NUMBER,
            ],
        })

        selectRelativePeriod({
            label: E2E_PROGRAM[DIMENSION_ID_EVENT_DATE],
            period: TEST_REL_PE_LAST_12_MONTHS,
        })

        clickMenubarUpdateButton()
    })

    it('has the correct white-space css', () => {
        const shouldHaveWhiteSpace = (index, value) =>
            getTableDataCells()
                .eq(index)
                .invoke('css', 'white-space')
                .should('equal', value)

        ;[0, 1, 2, 3].forEach((index) => shouldHaveWhiteSpace(index, 'normal'))
        ;[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].forEach((index) =>
            shouldHaveWhiteSpace(index, 'nowrap')
        )
    })
})
