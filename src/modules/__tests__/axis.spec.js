import {
    AXIS_ID_COLUMNS,
    AXIS_ID_FILTERS,
    AXIS_ID_ROWS,
} from '@dhis2/analytics'
import { getAxisName } from '../axis.js'

test('gets name of column axis', () => {
    expect(getAxisName(AXIS_ID_COLUMNS)).toEqual('Columns')
})

test('gets name of filters axis', () => {
    expect(getAxisName(AXIS_ID_FILTERS)).toEqual('Filter')
})

test('gets name of rows axis', () => {
    expect(getAxisName(AXIS_ID_ROWS)).toEqual('Rows')
})

test('throws error for non-existing axis', () => {
    function getNonExistingAxisName() {
        getAxisName('NONEXISTING')
    }
    expect(getNonExistingAxisName).toThrowError(
        'NONEXISTING is not a valid axis id'
    )
})

test('throws error for empty axis', () => {
    function getNonExistingAxisName() {
        getAxisName()
    }
    expect(getNonExistingAxisName).toThrowError(' is not a valid axis id')
})
