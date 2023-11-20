import {
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_ORGANISATION_UNIT,
    VALUE_TYPE_TEXT,
} from '@dhis2/analytics'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../../modules/visualization.js'
import { getDimensionsWithSuffix } from '../DefaultAxis.js'

describe('getDimensionsWithSuffix for data elements', () => {
    const metadata = {
        p1: {
            id: 'p1',
            name: 'Program1',
        },
        p2: {
            id: 'p2',
            name: 'Program2',
        },
        p1s1: {
            id: 'p1s1',
            name: 'P1 Stage1',
        },
        p1s2: {
            id: 'p1s2',
            name: 'P1 Stage2',
        },
        p2s1: {
            id: 'p2s1',
            name: 'P2 Stage1',
        },
        p2s2: {
            id: 'p2s2',
            name: 'P2 Stage2',
        },
        'p1s1.d1': {
            id: 'p1s1.d1',
            name: 'Dimension1',
            dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
            optionSet: 'OptionSet1',
            valueType: VALUE_TYPE_TEXT,
        },
        'p1s1.d2': {
            id: 'p1s1.d2',
            name: 'Dimension2',
            dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
            optionSet: 'OptionSet2',
            valueType: VALUE_TYPE_TEXT,
        },
        'p1s2.d1': {
            id: 'p1s2.d1',
            name: 'Dimension1',
            dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
            optionSet: 'OptionSet1',
            valueType: VALUE_TYPE_TEXT,
        },
        'p1s2.d2': {
            id: 'p1s2.d2',
            name: 'Dimension2',
            dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
            optionSet: 'OptionSet2',
            valueType: VALUE_TYPE_TEXT,
        },
        'p1s2.d3': {
            id: 'p1s2.d3',
            name: 'Dimension3',
            dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
            optionSet: 'OptionSet3',
            valueType: VALUE_TYPE_TEXT,
        },
        'p1.p1s1.d1': {
            id: 'p1.p1s1.d1',
            name: 'Dimension1',
            dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
            optionSet: 'OptionSet1',
            valueType: VALUE_TYPE_TEXT,
        },
        'p1.p1s2.d1': {
            id: 'p1.p1s2.d1',
            name: 'Dimension1',
            dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
            optionSet: 'OptionSet1',
            valueType: VALUE_TYPE_TEXT,
        },
        'p1.p1s2.d2': {
            id: 'p1.p1s2.d2',
            name: 'Dimension2',
            dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
            optionSet: 'OptionSet2',
            valueType: VALUE_TYPE_TEXT,
        },
        'p2.p2s1.d1': {
            id: 'p2.p2s1.d1',
            name: 'Dimension1',
            dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
            optionSet: 'OptionSet1',
            valueType: VALUE_TYPE_TEXT,
        },
        'p2.p2s1.d3': {
            id: 'p2.p2s1.d3',
            name: 'Dimension3',
            dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
            optionSet: 'OptionSet3',
            valueType: VALUE_TYPE_TEXT,
        },
        'p2.p2s2.d1': {
            id: 'p2.p2s2.d1',
            name: 'Dimension1',
            dimensionType: DIMENSION_TYPE_DATA_ELEMENT,
            optionSet: 'OptionSet1',
            valueType: VALUE_TYPE_TEXT,
        },
    }

    it('returns correct result for: non-TE, no duplicates -> no suffix', () => {
        const id1 = 'p1s1.d1',
            id2 = 'p1s1.d2',
            id3 = 'p1s2.d3'
        const dimensionIds = [id1, id2, id3]
        const output = getDimensionsWithSuffix({
            dimensionIds,
            metadata,
            inputType: OUTPUT_TYPE_ENROLLMENT,
        })

        expect(output[0].id).toEqual(id1)
        expect(output[0].name).toEqual('Dimension1')
        expect(output[0].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[0].optionSet).toEqual('OptionSet1')
        expect(output[0].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[0].suffix).toBeUndefined()

        expect(output[1].id).toEqual(id2)
        expect(output[1].name).toEqual('Dimension2')
        expect(output[1].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[1].optionSet).toEqual('OptionSet2')
        expect(output[1].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[1].suffix).toBeUndefined()

        expect(output[2].id).toEqual(id3)
        expect(output[2].name).toEqual('Dimension3')
        expect(output[2].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[2].optionSet).toEqual('OptionSet3')
        expect(output[2].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[2].suffix).toBeUndefined()
    })

    it('returns correct result for: non-TE, with duplicates per stage -> stage suffix', () => {
        const id1 = 'p1s1.d1',
            id2 = 'p1s2.d1'
        const dimensionIds = [id1, id2]
        const output = getDimensionsWithSuffix({
            dimensionIds,
            metadata,
            inputType: OUTPUT_TYPE_ENROLLMENT,
        })

        expect(output[0].id).toEqual(id1)
        expect(output[0].name).toEqual('Dimension1')
        expect(output[0].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[0].optionSet).toEqual('OptionSet1')
        expect(output[0].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[0].suffix).toEqual('P1 Stage1')

        expect(output[1].id).toEqual(id2)
        expect(output[1].name).toEqual('Dimension1')
        expect(output[1].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[1].optionSet).toEqual('OptionSet1')
        expect(output[1].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[1].suffix).toEqual('P1 Stage2')
    })

    it('returns correct result for: TE, no duplicates -> no suffix', () => {
        const id1 = 'p1.p1s1.d1',
            id2 = 'p1.p1s2.d2',
            id3 = 'p2.p2s1.d3'
        const dimensionIds = [id1, id2, id3]
        const output = getDimensionsWithSuffix({
            dimensionIds,
            metadata,
            inputType: OUTPUT_TYPE_TRACKED_ENTITY,
        })

        expect(output[0].id).toEqual(id1)
        expect(output[0].name).toEqual('Dimension1')
        expect(output[0].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[0].optionSet).toEqual('OptionSet1')
        expect(output[0].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[0].suffix).toBeUndefined()

        expect(output[1].id).toEqual(id2)
        expect(output[1].name).toEqual('Dimension2')
        expect(output[1].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[1].optionSet).toEqual('OptionSet2')
        expect(output[1].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[1].suffix).toBeUndefined()

        expect(output[2].id).toEqual(id3)
        expect(output[2].name).toEqual('Dimension3')
        expect(output[2].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[2].optionSet).toEqual('OptionSet3')
        expect(output[2].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[2].suffix).toBeUndefined()
    })

    it('returns correct result for: TE, with duplicates per stage -> stage suffix', () => {
        const id1 = 'p1.p1s1.d1',
            id2 = 'p1.p1s2.d1',
            id3 = 'p1.p1s2.d2' // no duplicate, just reference
        const dimensionIds = [id1, id2, id3]
        const output = getDimensionsWithSuffix({
            dimensionIds,
            metadata,
            inputType: OUTPUT_TYPE_ENROLLMENT,
        })

        expect(output[0].id).toEqual(id1)
        expect(output[0].name).toEqual('Dimension1')
        expect(output[0].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[0].optionSet).toEqual('OptionSet1')
        expect(output[0].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[0].suffix).toEqual('P1 Stage1')

        expect(output[1].id).toEqual(id2)
        expect(output[1].name).toEqual('Dimension1')
        expect(output[1].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[1].optionSet).toEqual('OptionSet1')
        expect(output[1].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[1].suffix).toEqual('P1 Stage2')

        expect(output[2].id).toEqual(id3)
        expect(output[2].name).toEqual('Dimension2')
        expect(output[2].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[2].optionSet).toEqual('OptionSet2')
        expect(output[2].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[2].suffix).toBeUndefined()
    })

    it('returns correct result for: TE, with duplicates per program -> program suffix', () => {
        const id1 = 'p1.p1s1.d1',
            id2 = 'p2.p2s1.d1',
            id3 = 'p1.p1s2.d2' // no duplicate, just reference
        const dimensionIds = [id1, id2, id3]
        const output = getDimensionsWithSuffix({
            dimensionIds,
            metadata,
            inputType: OUTPUT_TYPE_ENROLLMENT,
        })

        expect(output[0].id).toEqual(id1)
        expect(output[0].name).toEqual('Dimension1')
        expect(output[0].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[0].optionSet).toEqual('OptionSet1')
        expect(output[0].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[0].suffix).toEqual('Program1')

        expect(output[1].id).toEqual(id2)
        expect(output[1].name).toEqual('Dimension1')
        expect(output[1].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[1].optionSet).toEqual('OptionSet1')
        expect(output[1].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[1].suffix).toEqual('Program2')

        expect(output[2].id).toEqual(id3)
        expect(output[2].name).toEqual('Dimension2')
        expect(output[2].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[2].optionSet).toEqual('OptionSet2')
        expect(output[2].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[2].suffix).toBeUndefined()
    })

    it('returns correct result for: TE, with duplicates per program and stage -> stage suffix', () => {
        const id1 = 'p1.p1s1.d1', // stage duplicate of id3
            id2 = 'p1.p1s2.d1', // stage duplicate of id1
            id3 = 'p2.p2s1.d1', // program duplicate of id1 and id3
            id4 = 'p1.p1s2.d2' // no duplicate, just reference
        const dimensionIds = [id1, id2, id3, id4]
        const output = getDimensionsWithSuffix({
            dimensionIds,
            metadata,
            inputType: OUTPUT_TYPE_ENROLLMENT,
        })

        expect(output[0].id).toEqual(id1)
        expect(output[0].name).toEqual('Dimension1')
        expect(output[0].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[0].optionSet).toEqual('OptionSet1')
        expect(output[0].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[0].suffix).toEqual('P1 Stage1')

        expect(output[1].id).toEqual(id2)
        expect(output[1].name).toEqual('Dimension1')
        expect(output[1].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[1].optionSet).toEqual('OptionSet1')
        expect(output[1].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[1].suffix).toEqual('P1 Stage2')

        expect(output[2].id).toEqual(id3)
        expect(output[2].name).toEqual('Dimension1')
        expect(output[2].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[2].optionSet).toEqual('OptionSet1')
        expect(output[2].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[2].suffix).toEqual('P2 Stage1')

        expect(output[3].id).toEqual(id4)
        expect(output[3].name).toEqual('Dimension2')
        expect(output[3].dimensionType).toEqual(DIMENSION_TYPE_DATA_ELEMENT)
        expect(output[3].optionSet).toEqual('OptionSet2')
        expect(output[3].valueType).toEqual(VALUE_TYPE_TEXT)
        expect(output[3].suffix).toBeUndefined()
    })
})

describe('getDimensionsWithSuffix for program dimensions', () => {
    const metadata = {
        p1: {
            id: 'p1',
            name: 'Program1',
        },
        p2: {
            id: 'p2',
            name: 'Program2',
        },
        ou: {
            id: 'ou',
            name: 'Organisation unit',
            dimensionType: DIMENSION_TYPE_ORGANISATION_UNIT,
        },
        'p1.ou': {
            id: 'p1.ou',
            name: 'Organisation unit',
            dimensionType: DIMENSION_TYPE_ORGANISATION_UNIT,
        },
        'p2.ou': {
            id: 'p2.ou',
            name: 'Organisation unit',
            dimensionType: DIMENSION_TYPE_ORGANISATION_UNIT,
        },
    }

    it('returns correct result for: non-TE, no duplicates -> no suffix', () => {
        const id1 = 'ou'
        const dimensionIds = [id1]
        const output = getDimensionsWithSuffix({
            dimensionIds,
            metadata,
            inputType: OUTPUT_TYPE_ENROLLMENT,
        })

        expect(output[0].id).toEqual(id1)
        expect(output[0].name).toEqual('Organisation unit')
        expect(output[0].dimensionType).toEqual(
            DIMENSION_TYPE_ORGANISATION_UNIT
        )
        expect(output[0].suffix).toBeUndefined()
    })

    it('returns correct result for: TE, no duplicates -> no suffix', () => {
        const id1 = 'ou',
            id2 = 'p1.ou'
        const dimensionIds = [id1, id2]

        metadata.ou.name = 'Registration org. unit'

        const output = getDimensionsWithSuffix({
            dimensionIds,
            metadata,
            inputType: OUTPUT_TYPE_TRACKED_ENTITY,
        })

        expect(output[0].id).toEqual(id1)
        expect(output[0].name).toEqual('Registration org. unit')
        expect(output[0].dimensionType).toEqual(
            DIMENSION_TYPE_ORGANISATION_UNIT
        )
        expect(output[0].suffix).toBeUndefined()

        expect(output[1].id).toEqual(id2)
        expect(output[1].name).toEqual('Organisation unit')
        expect(output[1].dimensionType).toEqual(
            DIMENSION_TYPE_ORGANISATION_UNIT
        )
        expect(output[1].suffix).toBeUndefined()
    })

    it('returns correct result for: TE, duplicates -> program suffix', () => {
        const id1 = 'ou',
            id2 = 'p1.ou',
            id3 = 'p2.ou'
        const dimensionIds = [id1, id2, id3]

        metadata.ou.name = 'Registration org. unit'

        const output = getDimensionsWithSuffix({
            dimensionIds,
            metadata,
            inputType: OUTPUT_TYPE_TRACKED_ENTITY,
        })

        expect(output[0].id).toEqual(id1)
        expect(output[0].name).toEqual('Registration org. unit')
        expect(output[0].dimensionType).toEqual(
            DIMENSION_TYPE_ORGANISATION_UNIT
        )
        expect(output[0].suffix).toBeUndefined()

        expect(output[1].id).toEqual(id2)
        expect(output[1].name).toEqual('Organisation unit')
        expect(output[1].dimensionType).toEqual(
            DIMENSION_TYPE_ORGANISATION_UNIT
        )
        expect(output[1].suffix).toEqual('Program1')

        expect(output[2].id).toEqual(id3)
        expect(output[2].name).toEqual('Organisation unit')
        expect(output[2].dimensionType).toEqual(
            DIMENSION_TYPE_ORGANISATION_UNIT
        )
        expect(output[2].suffix).toEqual('Program2')
    })
})

/* cases:
    Data element duplicates
    -DED1    Not TE, not duplicate -> no suffix
    -DED2    Not TE, duplicate per stage -> stage suffix
    -DED3    TE, not duplicate -> no suffix
    -DED4    TE, duplicate per stage -> stage suffix
    -DED5    TE, duplicate per program -> program suffix
    -DED6    TE, duplicate per stage and program -> stage suffix

    Time dimensions
    TD1    Not TE, regardless of name -> no suffix
    TD2    TE, custom name -> no suffix
    TD3    TE, default name -> program suffix

    Other dimensions
    OD1    Program indicator (regardless of all other rules) -> no suffix
    OD2    Global dimension (regardless of all other rules) -> no suffix
    OD3    TET dimensions / PA (regardless of all other rules) -> no suffix
    OD4    “Program dimensions” event/program status, org unit -> program suffix
*/
