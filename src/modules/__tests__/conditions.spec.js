import { getConditions } from '../conditions.js'

test('Legend set chosen with no conditions selected', () => {
    const conditions = {
        condition: '',
        legendSet: 'legendSetId1',
    }
    const metadata = {
        legendSetId1: { id: 'legendSetId1', name: 'Legend Set Name' },
    }
    const dimension = {}
    const actual = getConditions({ conditions, metadata, dimension })

    expect(actual).toEqual(['Legend Set Name'])
})

test('Legend set chosen with conditions selected', () => {
    const conditions = {
        condition: 'IN:Condition1Id;Condition2Id',
        legendSet: 'legendSetId1',
    }
    const metadata = {
        legendSetId1: {
            id: 'legendSetId1',
            name: 'Legend Set Name',
            legends: [
                { id: 'Condition1Id', name: 'Condition 1' },
                { id: 'Condition2Id', name: 'Condition 2' },
            ],
        },
    }
    const dimension = {}
    const actual = getConditions({ conditions, metadata, dimension })

    expect(actual).toEqual(['Condition 1', 'Condition 2'])
})

test('Dimension with optionSet', () => {
    const conditions = {
        condition: 'IN:5code;6code',
    }
    const metadata = {
        '5Id': { code: '5code', name: '5' },
        '6Id': { code: '6code', name: '6' },
    }
    const dimension = {
        optionSet: 'optionsetId',
        valueType: 'NUMBER',
    }
    const actual = getConditions({ conditions, metadata, dimension })

    expect(actual).toEqual(['5', '6'])
})

test('Organisation unit dimension with EQ condition', () => {
    const conditions = {
        condition: 'EQ:OrgUnitId1',
    }
    const metadata = {
        OrgUnitId1: { id: 'OrgUnitId1', name: 'Org unit name' },
    }
    const dimension = {
        valueType: 'ORGANISATION_UNIT',
    }
    const actual = getConditions({ conditions, metadata, dimension })

    expect(actual).toEqual(['Org unit name'])
})

//DATETIME tests are disabled until node v16 due to needing support for replaceAll

const tests = [
    {
        dimensionValueType: 'BOOLEAN',
        condition: 'IN:1;NV',
        expected: ['Yes', 'Not answered'],
    },
    {
        dimensionValueType: 'TRUE_ONLY',
        condition: 'IN:NV',
        expected: ['Not answered'],
    },
    // {
    //     dimensionValueType: 'DATETIME',
    //     condition: 'GT:2021-01-16T11.44:LT:2022-05-16T12.00',
    //     expected: ['After: 2021-01-16 11:44', 'Before: 2022-05-16 12:00'],
    // },
    // {
    //     dimensionValueType: 'DATETIME',
    //     condition: 'NE:NV:GE:2021-01-16T15.45',
    //     expected: [
    //         'Is not empty / not null',
    //         'After or including: 2021-01-16 15:45',
    //     ],
    // },
    // {
    //     dimensionValueType: 'DATETIME',
    //     condition: 'EQ:NV',
    //     expected: ['Is empty / null'],
    // },
    {
        dimensionValueType: 'NUMBER',
        condition: 'GT:31.5:LE:40.9',
        expected: ['Greater than (>): 31.5', 'Less than or equal to (≤): 40.9'],
    },
    {
        dimensionValueType: 'NUMBER',
        condition: 'EQ:NV:LE:40.9',
        expected: ['Is empty / null', 'Less than or equal to (≤): 40.9'],
    },
    {
        dimensionValueType: 'NUMBER',
        condition: 'NE:NV',
        expected: ['Is not empty / not null'],
    },
    {
        dimensionValueType: 'INTEGER',
        condition: 'GT:31:LE:40',
        expected: ['Greater than (>): 31', 'Less than or equal to (≤): 40'],
    },
    {
        dimensionValueType: 'INTEGER',
        condition: 'EQ:NV:LE:40',
        expected: ['Is empty / null', 'Less than or equal to (≤): 40'],
    },
    {
        dimensionValueType: 'INTEGER',
        condition: 'NE:NV',
        expected: ['Is not empty / not null'],
    },
    {
        dimensionValueType: 'LONG_TEXT',
        condition: 'ILIKE:Cats',
        expected: ['Contains: Cats'],
    },
    {
        dimensionValueType: 'LONG_TEXT',
        condition: 'NE:NV:LIKE:Cats',
        expected: ['Is not empty / not null', 'Contains: Cats'],
    },
    {
        dimensionValueType: 'LONG_TEXT',
        condition: 'EQ:NV',
        expected: ['Is empty / null'],
    },
]

describe('conditions that do not include legend sets or option sets', () => {
    tests.forEach((t) => {
        const testname = `valueType: ${t.dimensionValueType}, condition: ${t.condition}`
        test(testname, () => {
            const actual = getConditions({
                conditions: { condition: t.condition },
                metadata: {},
                dimension: { valueType: t.dimensionValueType },
            })
            expect(actual).toEqual(t.expected)
        })
    })
})
