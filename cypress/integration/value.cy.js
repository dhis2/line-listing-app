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
import { goToStartPage } from '../helpers/startScreen.js'
import { getTableDataCells } from '../helpers/table.js'

const shouldHaveWhiteSpace = (index, value) =>
    getTableDataCells()
        .eq(index)
        .invoke('css', 'white-space')
        .should('equal', value)

describe('value', () => {
    it('has the correct white-space css', () => {
        const programDimensionsWithWrap = [
            TEST_DIM_TEXT,
            TEST_DIM_TEXT_OPTIONSET,
            TEST_DIM_NUMBER_OPTIONSET,
        ]
        const programDimensionsWithoutWrap = [
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
        ]
        const programDimensions = [
            ...programDimensionsWithWrap,
            ...programDimensionsWithoutWrap,
        ]

        goToStartPage()

        selectEventWithProgramDimensions({
            programName: E2E_PROGRAM.programName,
            dimensions: programDimensions,
        })

        selectRelativePeriod({
            label: E2E_PROGRAM[DIMENSION_ID_EVENT_DATE],
            period: TEST_REL_PE_LAST_12_MONTHS,
        })

        clickMenubarUpdateButton()

        const dimensions = [
            'Organisation unit name',
            ...programDimensions,
            E2E_PROGRAM[DIMENSION_ID_EVENT_DATE],
        ]

        programDimensionsWithWrap.forEach((dim) =>
            shouldHaveWhiteSpace(dimensions.indexOf(dim), 'normal')
        )
        programDimensionsWithoutWrap.forEach((dim) =>
            shouldHaveWhiteSpace(dimensions.indexOf(dim), 'nowrap')
        )
    })
})
