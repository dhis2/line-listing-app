import {
    VALUE_TYPE_DATE,
    VALUE_TYPE_DATETIME,
    VALUE_TYPE_NUMBER,
    VALUE_TYPE_INTEGER,
    VALUE_TYPE_USERNAME,
    VALUE_TYPE_AGE,
    VALUE_TYPE_TEXT,
} from '@dhis2/analytics'
import { getFormattedCellValue, getHeaderText } from '../tableValues.js'

describe('getFormattedCellValue', () => {
    describe('DATE and DATETIME', () => {
        test('date', () => {
            const header = {
                valueType: VALUE_TYPE_DATE,
            }
            const value = '2021-12-01 12:25:03.900'

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'COMMA' },
                })
            ).toEqual('2021-12-01')
        })

        test('datetime', () => {
            const header = {
                valueType: VALUE_TYPE_DATETIME,
            }
            const value = '2021-12-01 12:25:03.900'

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'COMMA' },
                })
            ).toEqual('2021-12-01 12:25')
        })

        test('name = lastupdated (date)', () => {
            const header = {
                name: 'lastupdated',
                valueType: VALUE_TYPE_DATE,
            }
            const value = '2022-07-05 09:37:29.078'

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'COMMA' },
                })
            ).toEqual('2022-07-05 09:37')
        })

        // TODO is this how we want this case handled?
        test('datetime no value', () => {
            const header = {
                valueType: VALUE_TYPE_DATETIME,
            }
            const value = undefined

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'COMMA' },
                })
            ).toEqual(undefined)
        })
    })

    describe('getFormattedCellValue other types', () => {
        test('number with comma', () => {
            const header = {
                valueType: VALUE_TYPE_NUMBER,
            }
            const value = 3700.5

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'COMMA' },
                })
            ).toEqual('3,700.50')
        })

        test('username', () => {
            const header = {
                valueType: VALUE_TYPE_USERNAME,
            }
            const value = 'rainbowdash'

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'COMMA' },
                })
            ).toEqual('rainbowdash')
        })

        test('no type', () => {
            const header = {}
            const value = 3700.5

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'COMMA' },
                })
            ).toEqual('3700.5')
        })

        test('integer with space', () => {
            const header = {
                valueType: VALUE_TYPE_INTEGER,
            }
            const value = 3700000

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'SPACE' },
                })
            ).toEqual('3 700 000')
        })

        test('integer with comma', () => {
            const header = {
                valueType: VALUE_TYPE_INTEGER,
            }
            const value = 3700000

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'COMMA' },
                })
            ).toEqual('3,700,000')
        })

        test('age', () => {
            const header = {
                valueType: VALUE_TYPE_AGE,
            }
            const value = '2021-12-01 12:25:03.900'

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'COMMA' },
                })
            ).toEqual('2021-12-01')
        })

        test('numeric option set', () => {
            const header = {
                valueType: VALUE_TYPE_NUMBER,
                optionSet: 'a1b2c3d4',
            }
            const value = 'Fifty-five'

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'COMMA' },
                })
            ).toEqual('Fifty-five')
        })

        test('text option set', () => {
            const header = {
                valueType: VALUE_TYPE_TEXT,
                optionSet: 'a1b2c3d4',
            }
            const value = 'Option five'

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'COMMA' },
                })
            ).toEqual('Option five')
        })
    })

    describe('PROGRAM_STATUS and EVENT_STATUS', () => {
        test('programstatus random value', () => {
            const header = {
                name: 'programstatus',
            }
            const value = 'rANdOm'

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'COMMA' },
                })
            ).toEqual('rANdOm')
        })

        test('programstatus COMPLETED', () => {
            const header = {
                name: 'programstatus',
            }
            const value = 'COMPLETED'

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'COMMA' },
                })
            ).toEqual('Completed')
        })

        test('eventstatus random value', () => {
            const header = {
                name: 'eventstatus',
            }
            const value = 3.7

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'COMMA' },
                })
            ).toEqual(3.7)
        })

        test('eventstatus ACTIVE', () => {
            const header = {
                name: 'eventstatus',
            }
            const value = 'ACTIVE'

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'COMMA' },
                })
            ).toEqual('Active')
        })

        // TODO is this how we want this case handled?
        test('eventstatus no value', () => {
            const header = {
                name: 'eventstatus',
            }
            const value = undefined

            expect(
                getFormattedCellValue({
                    header,
                    value,
                    visualization: { digitGroupSeparator: 'COMMA' },
                })
            ).toEqual(undefined)
        })
    })
})
describe('getHeaderText', () => {
    test('returns header text for non-repeated event', () => {
        const header = {
            column: 'AEFI - Fever',
        }

        expect(getHeaderText(header)).toEqual('AEFI - Fever')
    })

    test('returns header text for stageOffset 0', () => {
        const header = {
            column: 'AEFI - Fever',
            stageOffset: 0,
        }

        expect(getHeaderText(header)).toEqual('AEFI - Fever (most recent)')
    })

    test('returns header text for stageOffset 1', () => {
        const header = {
            column: 'AEFI - Fever',
            stageOffset: 1,
        }

        expect(getHeaderText(header)).toEqual('AEFI - Fever (oldest)')
    })

    test('returns header text for stageOffset 3', () => {
        const header = {
            column: 'AEFI - Fever',
            stageOffset: 3,
        }

        expect(getHeaderText(header)).toEqual('AEFI - Fever (oldest +2)')
    })

    test('returns header text for stageOffset -1', () => {
        const header = {
            column: 'AEFI - Fever',
            stageOffset: -1,
        }

        expect(getHeaderText(header)).toEqual('AEFI - Fever (most recent -1)')
    })

    test('returns header text for stageOffset -2', () => {
        const header = {
            column: 'AEFI - Fever',
            stageOffset: -2,
        }

        expect(getHeaderText(header)).toEqual('AEFI - Fever (most recent -2)')
    })

    test('returns empty string if header is empty object', () => {
        const header = {}
        expect(getHeaderText(header)).toEqual('')
    })

    test('returns empty string if header undefined', () => {
        expect(getHeaderText()).toEqual('')
    })

    // TODO is this really a realistic scenario?
    test('returns corrupt string if missing column prop', () => {
        expect(getHeaderText({ stageOffset: 1 })).toEqual('')
    })
})
