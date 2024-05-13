import { getParentGraphMapFromVisualization } from '../parentGraphMap.js'

describe('getParentGraphMapFromVisualization', () => {
    it('returns an empty object when no org unit axis exists', () => {
        const visualization = {
            columns: [{ dimension: 'dx' }],
            filters: [],
        }
        const parentGraphMap = getParentGraphMapFromVisualization(visualization)
        expect(parentGraphMap).toEqual({})
    })

    it('returns parent graph map correctly for org units', () => {
        const visualization = {
            columns: [
                { dimension: 'dx' },
                {
                    dimension: 'ou',
                    items: [
                        { id: 'orgUnit1', path: '/orgUnit1' },
                        { id: 'orgUnit2', path: '/orgUnit1/orgUnit2' },
                        { id: 'orgUnit3', path: '/orgUnit1/orgUnit3' },
                    ],
                },
            ],
        }
        const parentGraphMap = getParentGraphMapFromVisualization(visualization)
        expect(parentGraphMap).toEqual({
            orgUnit1: '',
            orgUnit2: 'orgUnit1',
            orgUnit3: 'orgUnit1',
        })
    })

    it('handles root org unit case correctly', () => {
        const visualization = {
            columns: [
                { dimension: 'dx' },
                {
                    dimension: 'ou',
                    items: [{ id: 'rootOrgUnit', path: '/rootOrgUnit' }],
                },
            ],
        }
        const parentGraphMap = getParentGraphMapFromVisualization(visualization)
        expect(parentGraphMap).toEqual({ rootOrgUnit: '' })
    })

    it('handles org unit paths with trailing slashes correctly', () => {
        const visualization = {
            columns: [
                { dimension: 'dx' },
                {
                    dimension: 'ou',
                    items: [{ id: 'orgUnit', path: '/orgUnit/' }],
                },
            ],
        }
        const parentGraphMap = getParentGraphMapFromVisualization(visualization)
        expect(parentGraphMap).toEqual({ orgUnit: 'orgUnit' })
    })
})
