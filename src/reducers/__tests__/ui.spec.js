import { PROP_MOST_RECENT, PROP_OLDEST } from '../../modules/ui.js'
import { OUTPUT_TYPE_EVENT } from '../../modules/visualization.js'
import reducer, {
    DEFAULT_UI,
    SET_UI_INPUT,
    SET_UI_PROGRAM,
    SET_UI_PROGRAM_ID,
    SET_UI_PROGRAM_STAGE,
    SET_UI_REPETITION,
} from '../ui.js'

describe('reducer: store.ui', () => {
    it('returns the default state when no matching action', () => {
        const actualState = reducer(DEFAULT_UI, { type: 'NO_MATCH' })

        expect(actualState).toEqual(DEFAULT_UI)
    })

    describe(`reducer: ${SET_UI_INPUT}`, () => {
        const input = {
            type: OUTPUT_TYPE_EVENT,
        }

        const inputAction = {
            type: SET_UI_INPUT,
            value: input,
        }

        it('returns a new object', () => {
            const state = {}

            expect(reducer(state, inputAction)).not.toBe(
                reducer(state, inputAction)
            )
        })

        it('sets the new value', () => {
            const prevState = {
                input: {
                    type: 'tracked entity',
                    trackedEntityType: 'person',
                },
            }

            expect(reducer(prevState, inputAction)).toEqual({
                input,
            })
        })
    })

    describe(`reducer: ${SET_UI_PROGRAM}`, () => {
        const prevState = {
            program: {
                id: 'P',
                stage: 'S',
            },
        }

        const programId = 'p'

        const programStage = 's'

        const program = {
            id: programId,
        }

        const programAction = {
            type: SET_UI_PROGRAM,
            value: program,
        }

        const programIdAction = {
            type: SET_UI_PROGRAM_ID,
            value: programId,
        }

        const programStageAction = {
            type: SET_UI_PROGRAM_STAGE,
            value: programStage,
        }

        it('returns a new object', () => {
            const state = {}

            expect(reducer(state, programAction)).not.toBe(
                reducer(state, programAction)
            )
        })

        it('sets the new program object', () => {
            expect(reducer(prevState, programAction)).toEqual({
                program,
            })
        })

        it('sets the new program id', () => {
            expect(reducer(prevState, programIdAction).program.id).toEqual(
                programId
            )
        })

        it('sets the new program stage', () => {
            expect(
                reducer(prevState, programStageAction).program.stage
            ).toEqual(programStage)
        })
    })

    describe(`reducer: ${SET_UI_REPETITION}`, () => {
        const getTestRepetition = () => ({
            [PROP_MOST_RECENT]: 2,
            [PROP_OLDEST]: 1,
        })

        const dimensionId = 'abc'

        it('adds repetition by dimension id', () => {
            const actualState = reducer(
                {},
                {
                    type: SET_UI_REPETITION,
                    value: {
                        dimensionId,
                        repetition: getTestRepetition(),
                    },
                }
            )

            const expectedState = {
                repetitionByDimension: {
                    abc: getTestRepetition(),
                },
            }

            expect(actualState).toEqual(expectedState)
        })

        it('overrides existing repetitions by dimension id', () => {
            const updatedRepetition = {
                ...getTestRepetition(),
                [PROP_MOST_RECENT]: 999,
            }

            const initialState = {
                repetitionByDimension: {
                    abc: getTestRepetition(),
                },
            }

            const actualState = reducer(initialState, {
                type: SET_UI_REPETITION,
                value: {
                    dimensionId,
                    repetition: updatedRepetition,
                },
            })

            const expectedState = {
                repetitionByDimension: {
                    [dimensionId]: updatedRepetition,
                },
            }

            expect(actualState).toEqual(expectedState)
        })
    })
})
