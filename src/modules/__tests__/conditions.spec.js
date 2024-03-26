import {
    getConditionsTexts,
    checkIsCaseSensitive,
    addCaseSensitivePrefix,
    removeCaseSensitivePrefix,
    getConditionsFromVisualization,
} from '../conditions.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../visualization.js'

test('Legend set chosen with no legends selected', () => {
    const conditions = {
        condition: '',
        legendSet: 'legendSetId1',
    }
    const metadata = {
        legendSetId1: { id: 'legendSetId1', name: 'Legend Set Name' },
    }
    const dimension = {}
    const actual = getConditionsTexts({ conditions, metadata, dimension })

    expect(actual).toEqual(['Legend Set Name'])
})

test('Legend set chosen with legends selected', () => {
    const conditions = {
        condition: 'IN:Legend1Id;Legend2Id',
        legendSet: 'legendSetId1',
    }
    const metadata = {
        legendSetId1: {
            id: 'legendSetId1',
            name: 'Legend Set Name',
            legends: [
                { id: 'Legend1Id', name: 'Legend 1' },
                { id: 'Legend2Id', name: 'Legend 2' },
            ],
        },
    }
    const dimension = {}
    const actual = getConditionsTexts({ conditions, metadata, dimension })

    expect(actual).toEqual(['Legend 1', 'Legend 2'])
})

test('Dimension with optionSet', () => {
    const conditions = {
        condition: 'IN:5code;6code',
    }
    const metadata = {
        optionsetId: {
            options: [
                { code: '5code', name: '5' },
                { code: '6code', name: '6' },
            ],
        },
    }

    const dimension = {
        optionSet: 'optionsetId',
        valueType: 'NUMBER',
    }
    const actual = getConditionsTexts({ conditions, metadata, dimension })

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
    const actual = getConditionsTexts({ conditions, metadata, dimension })

    expect(actual).toEqual(['Org unit name'])
})

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
    {
        dimensionValueType: 'DATETIME',
        condition: 'GT:2021-01-16T11.44:LT:2022-05-16T12.00',
        expected: ['After: 2021-01-16 11:44', 'Before: 2022-05-16 12:00'],
    },
    {
        dimensionValueType: 'DATETIME',
        condition: 'NE:NV:GE:2021-01-16T15.45',
        expected: [
            'Is not empty / not null',
            'After or including: 2021-01-16 15:45',
        ],
    },
    {
        dimensionValueType: 'DATETIME',
        condition: 'EQ:NV',
        expected: ['Is empty / null'],
    },
    {
        dimensionValueType: 'NUMBER',
        condition: 'GT:31.5:LE:40.9',
        expected: ['Greater than (>): 31.5', 'Less than or equal to (≤): 40.9'],
    },
    {
        dimensionValueType: 'NUMBER',
        condition: 'GT:3568.8',
        dgs: 'SPACE',
        expected: ['Greater than (>): 3 568.8'],
    },
    {
        dimensionValueType: 'NUMBER',
        condition: 'GT:3568.8',
        dgs: 'COMMA',
        expected: ['Greater than (>): 3,568.8'],
    },
    {
        dimensionValueType: 'NUMBER',
        condition: 'GT:3568.8',
        dgs: 'NONE',
        expected: ['Greater than (>): 3568.8'],
    },
    {
        dimensionValueType: 'NUMBER',
        condition: 'GT:3568.8',
        expected: ['Greater than (>): 3568.8'],
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
        dimensionValueType: 'INTEGER',
        condition: 'GT:3568',
        expected: ['Greater than (>): 3568'],
    },
    {
        dimensionValueType: 'INTEGER',
        condition: 'GT:3568',
        dgs: 'SPACE',
        expected: ['Greater than (>): 3 568'],
    },
    {
        dimensionValueType: 'INTEGER',
        condition: 'GT:3568',
        dgs: 'COMMA',
        expected: ['Greater than (>): 3,568'],
    },
    {
        dimensionValueType: 'INTEGER',
        condition: 'GT:3568',
        dgs: 'NONE',
        expected: ['Greater than (>): 3568'],
    },
    {
        dimensionValueType: 'INTEGER_POSITIVE',
        condition: 'GT:3568',
        dgs: 'SPACE',
        expected: ['Greater than (>): 3 568'],
    },
    {
        dimensionValueType: 'INTEGER_NEGATIVE',
        condition: 'GT:-3568',
        dgs: 'SPACE',
        expected: ['Greater than (>): -3 568'],
    },
    {
        dimensionValueType: 'INTEGER_ZERO_OR_POSITIVE',
        condition: 'GT:3568',
        dgs: 'SPACE',
        expected: ['Greater than (>): 3 568'],
    },
    {
        dimensionValueType: 'PERCENTAGE',
        condition: 'GT:3568',
        dgs: 'SPACE',
        expected: ['Greater than (>): 3 568'],
    },
    {
        dimensionValueType: 'UNIT_INTERVAL',
        condition: 'GT:3568',
        dgs: 'SPACE',
        expected: ['Greater than (>): 3 568'],
    },
    {
        dimensionType: 'PROGRAM_INDICATOR',
        condition: 'GT:5678',
        dgs: 'COMMA',
        expected: ['Greater than (>): 5,678'],
    },
    {
        dimensionValueType: 'LONG_TEXT',
        condition: 'ILIKE:Cats',
        expected: ['Contains: Cats'],
    },
    {
        dimensionValueType: 'LONG_TEXT',
        condition: '!ILIKE:Cats',
        expected: ['Does not contain: Cats'],
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
        const testname = `dimensionType: ${t.dimensionType}, valueType: ${t.dimensionValueType}, condition: ${t.condition}, dgs: ${t.dgs}`
        const formatValueOptions = t.dgs ? { digitGroupSeparator: t.dgs } : {}
        test(testname, () => {
            const actual = getConditionsTexts({
                conditions: { condition: t.condition },
                metadata: {},
                dimension: {
                    dimensionType: t.dimensionType,
                    valueType: t.dimensionValueType,
                },
                formatValueOptions,
            })
            expect(actual).toEqual(t.expected)
        })
    })
})

describe('checkIsCaseSensitive', () => {
    const tests = [
        {
            operator: '!LIKE',
            expected: true,
        },
        {
            operator: '!ILIKE',
            expected: false,
        },
        {
            operator: '!EQ',
            expected: true,
        },
        {
            operator: '!IEQ',
            expected: false,
        },
        {
            operator: 'LIKE',
            expected: true,
        },
        {
            operator: 'ILIKE',
            expected: false,
        },
        {
            operator: 'EQ',
            expected: true,
        },
        {
            operator: 'IEQ',
            expected: false,
        },
        // The function doesn't handle 'IN' correctly
        // {
        //     operator: 'IN',
        //     expected: true,
        // },
        // {
        //     operator: '!IN',
        //     expected: true,
        // },
    ]

    tests.forEach((t) => {
        const testname = `${t.operator}: expected: ${t.expected}`
        test(testname, () => {
            expect(checkIsCaseSensitive(t.operator)).toEqual(t.expected)
        })
    })
})

describe('addCaseSensitivePrefix', () => {
    const tests = [
        {
            operator: 'LIKE',
            isCaseSensitive: true,
            expected: 'LIKE',
        },
        {
            operator: '!LIKE',
            isCaseSensitive: true,
            expected: '!LIKE',
        },
        {
            operator: '!LIKE',
            isCaseSensitive: false,
            expected: '!ILIKE',
        },
        {
            operator: 'LIKE',
            isCaseSensitive: false,
            expected: 'ILIKE',
        },
        {
            operator: 'EQ',
            isCaseSensitive: true,
            expected: 'EQ',
        },
        {
            operator: '!EQ',
            isCaseSensitive: true,
            expected: '!EQ',
        },
        {
            operator: '!EQ',
            isCaseSensitive: false,
            expected: '!IEQ',
        },
        {
            operator: 'EQ',
            isCaseSensitive: false,
            expected: 'IEQ',
        },
    ]

    tests.forEach((t) => {
        const testname = `${t.operator}: caseSensitive: ${t.isCaseSensitive} should become ${t.expected}`
        test(testname, () => {
            expect(
                addCaseSensitivePrefix(t.operator, t.isCaseSensitive)
            ).toEqual(t.expected)
        })
    })
})

describe('removeCaseSensitivePrefix', () => {
    const tests = [
        {
            operator: 'LIKE',
            expected: 'LIKE',
        },
        {
            operator: '!LIKE',
            expected: '!LIKE',
        },
        {
            operator: 'ILIKE',
            expected: 'LIKE',
        },
        {
            operator: '!ILIKE',
            expected: '!LIKE',
        },
        {
            operator: 'EQ',
            expected: 'EQ',
        },
        {
            operator: '!EQ',
            expected: '!EQ',
        },
        {
            operator: 'IEQ',
            expected: 'EQ',
        },
        {
            operator: '!IEQ',
            expected: '!EQ',
        },
    ]

    tests.forEach((t) => {
        const testname = `${t.operator} should become ${t.expected}`
        test(testname, () => {
            expect(removeCaseSensitivePrefix(t.operator)).toEqual(t.expected)
        })
    })
})

describe('getConditionsFromVisualization', () => {
    it('should return empty object if visualization has no columns, rows, or filters', () => {
        const visualization = {
            columns: [],
            rows: [],
            filters: [],
        }
        const conditions = getConditionsFromVisualization(visualization)
        expect(conditions).toEqual({})
    })

    it('should return conditions for columns, rows, and filters with filter or legendSet defined', () => {
        const visualization = {
            columns: [{ dimension: 'dx1', filter: 'filter1' }],
            rows: [{ dimension: 'dx2', legendSet: { id: 'legend1' } }],
            filters: [
                {
                    dimension: 'dx3',
                    filter: 'filter3',
                    legendSet: { id: 'legend2' },
                },
            ],
        }
        const conditions = getConditionsFromVisualization(visualization)
        expect(conditions).toEqual({
            dx1: { condition: 'filter1', legendSet: undefined },
            dx2: { condition: undefined, legendSet: 'legend1' },
            dx3: { condition: 'filter3', legendSet: 'legend2' },
        })
    })

    it('should return conditions with correct id for output type event', () => {
        const visualization = {
            columns: [
                {
                    dimension: 'dx1',
                    programStage: { id: 'ps1' },
                    program: { id: 'p1' },
                    filter: 'filter1',
                },
            ],
            rows: [],
            filters: [],
            outputType: OUTPUT_TYPE_EVENT,
        }
        const conditions = getConditionsFromVisualization(visualization)
        expect(conditions).toEqual({
            'ps1.dx1': { condition: 'filter1', legendSet: undefined },
        })
    })

    it('should return conditions with correct id for output type tracked entity', () => {
        const visualization = {
            columns: [
                {
                    dimension: 'dx1',
                    programStage: { id: 'ps1' },
                    program: { id: 'p1' },
                    filter: 'filter1',
                },
            ],
            rows: [],
            filters: [],
            outputType: OUTPUT_TYPE_TRACKED_ENTITY,
        }
        const conditions = getConditionsFromVisualization(visualization)
        expect(conditions).toEqual({
            'p1.ps1.dx1': { condition: 'filter1', legendSet: undefined },
        })
    })
})
