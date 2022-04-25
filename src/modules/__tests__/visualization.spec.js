import {
    dimensionMetadataPropMap,
    getDimensionMetadataFields,
    getDimensionMetadataFromVisualization,
} from '../visualization.js'

describe('getDimensionMetadataFromVisualization', () => {
    const entries = Object.entries(dimensionMetadataPropMap)
    const [listName1, objectName1] = entries[0]
    const [listName2, objectName2] = entries[1]

    const testObject1 = {
        id: 'testId1',
        name: 'testName1',
    }
    const testObject2 = {
        id: 'testId2',
        name: 'testName2',
    }

    const visualization = {
        [listName1]: [
            {
                [objectName1]: testObject1,
            },
        ],
        [listName2]: [
            {
                [objectName2]: testObject2,
            },
        ],
    }

    const expectedMetadata = {
        [testObject1.id]: testObject1,
        [testObject2.id]: testObject2,
    }

    it('returns a metadata object', () => {
        expect(getDimensionMetadataFromVisualization(visualization)).toEqual(
            expectedMetadata
        )
    })
})

describe('getDimensionMetadataFields', () => {
    const entries = Object.entries(dimensionMetadataPropMap)
    const actualValue = getDimensionMetadataFields()

    it('returns the correct length', () => {
        expect(actualValue.length).toBe(entries.length)
    })
})
