import {
    DIMENSION_ID_PROGRAM_STATUS,
    DIMENSION_ID_EVENT_STATUS,
} from '../dimensionConstants.js'
import { getIsMainDimensionDisabled } from '../mainDimensions.js'
import {
    PROGRAM_TYPE_WITH_REGISTRATION,
    PROGRAM_TYPE_WITHOUT_REGISTRATION,
} from '../programTypes.js'
import { OUTPUT_TYPE_ENROLLMENT, OUTPUT_TYPE_EVENT } from '../visualization.js'

describe('ER > Dimensions > getIsMainDimensionDisabled', () => {
    test.each([
        {
            inputType: OUTPUT_TYPE_EVENT,
            programType: undefined,
            expected: {
                [DIMENSION_ID_EVENT_STATUS]: false,
                [DIMENSION_ID_PROGRAM_STATUS]: true,
            },
        },
        {
            inputType: OUTPUT_TYPE_EVENT,
            programType: PROGRAM_TYPE_WITHOUT_REGISTRATION,
            expected: {
                [DIMENSION_ID_EVENT_STATUS]: false,
                [DIMENSION_ID_PROGRAM_STATUS]: true,
            },
        },
        {
            inputType: OUTPUT_TYPE_EVENT,
            programType: PROGRAM_TYPE_WITH_REGISTRATION,
            expected: {
                [DIMENSION_ID_EVENT_STATUS]: false,
                [DIMENSION_ID_PROGRAM_STATUS]: false,
            },
        },
        {
            inputType: OUTPUT_TYPE_ENROLLMENT,
            programType: undefined,
            expected: {
                [DIMENSION_ID_EVENT_STATUS]: true,
                [DIMENSION_ID_PROGRAM_STATUS]: false,
            },
        },
        {
            inputType: OUTPUT_TYPE_ENROLLMENT,
            programType: PROGRAM_TYPE_WITH_REGISTRATION,
            expected: {
                [DIMENSION_ID_EVENT_STATUS]: true,
                [DIMENSION_ID_PROGRAM_STATUS]: false,
            },
        },
    ])(
        'returns the correct disabled state for event and program status given inputType is "$inputType" and programType is "$programType"',
        ({ inputType, programType, expected }) => {
            expect(
                getIsMainDimensionDisabled({
                    dimensionId: DIMENSION_ID_EVENT_STATUS,
                    inputType,
                    programType,
                })
            ).toBe(expected[DIMENSION_ID_EVENT_STATUS])
            expect(
                getIsMainDimensionDisabled({
                    dimensionId: DIMENSION_ID_PROGRAM_STATUS,
                    inputType,
                    programType,
                })
            ).toBe(expected[DIMENSION_ID_PROGRAM_STATUS])
        }
    )
})
