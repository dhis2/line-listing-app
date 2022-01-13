import { PROP_MOST_RECENT, PROP_OLDEST } from '../../modules/ui.js'
import { OUTPUT_TYPE_EVENT } from '../../modules/visualization.js'
import reducer, {
    DEFAULT_UI,
    SET_UI_INPUT,
    CLEAR_UI_PROGRAM,
    UPDATE_UI_PROGRAM_ID,
    UPDATE_UI_PROGRAM_STAGE,
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

        it('is pure', () => {
            const state = {}

            expect(reducer(state, inputAction).input).not.toBe(state)
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

    describe(`reducer: ${CLEAR_UI_PROGRAM}`, () => {
        const prevState = {
            program: {
                id: 'P',
                stage: 'S',
            },
        }

        const clearProgramAction = {
            type: CLEAR_UI_PROGRAM,
        }

        it('clears the selected program', () => {
            expect(reducer(prevState, clearProgramAction)).toEqual({
                program: {},
            })
        })

        it('is pure', () => {
            const state = {}

            expect(reducer(state, clearProgramAction)).not.toBe(state)
        })
    })

    describe(`reducer: ${UPDATE_UI_PROGRAM_ID}`, () => {
        const programId = 'p'

        const programIdAction = {
            type: UPDATE_UI_PROGRAM_ID,
            value: programId,
        }

        it('sets the new program id', () => {
            expect(reducer({}, programIdAction).program.id).toBe(programId)
        })

        it('is pure', () => {
            const state = {}

            expect(
                reducer({ program: state }, programIdAction).program
            ).not.toBe(state)
        })
    })

    describe(`reducer: ${UPDATE_UI_PROGRAM_STAGE}`, () => {
        const programStage = 's'

        const programStageAction = {
            type: UPDATE_UI_PROGRAM_STAGE,
            value: programStage,
        }

        it('sets the new program stage', () => {
            expect(reducer({}, programStageAction).program.stage).toBe(
                programStage
            )
        })

        it('is pure', () => {
            const state = {}

            expect(
                reducer({ program: state }, programStageAction).program
            ).not.toBe(state)
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
