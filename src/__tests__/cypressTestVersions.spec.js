import { getExcludedTags } from '../../cypress/support/getExcludedTags.js'

describe('get excluded Cypress tags', () => {
    test('instanceVersion 38, minVersion 38', () => {
        const instanceVersion = '38'
        const minVersion = '38'
        expect(getExcludedTags(instanceVersion, minVersion)).toEqual([
            '<38',
            '>38',
            '>=39',
            '>39',
            '>=40',
            '>40',
            '>=41',
        ])
    })

    test('instanceVersion 39, minVersion 38', () => {
        const instanceVersion = '39'
        const minVersion = '38'
        expect(getExcludedTags(instanceVersion, minVersion)).toEqual([
            '<=38',
            '<38',
            '<39',
            '>39',
            '>=40',
            '>40',
            '>=41',
        ])
    })

    test('instanceVersion 40, minVersion 38', () => {
        const instanceVersion = '40'
        const minVersion = '38'
        expect(getExcludedTags(instanceVersion, minVersion)).toEqual([
            '<=38',
            '<38',
            '<=39',
            '<39',
            '<40',
            '>40',
            '>=41',
        ])
    })

    test('instanceVersion 2.38, minVersion 38', () => {
        const instanceVersion = '2.38'
        const minVersion = '38'
        expect(getExcludedTags(instanceVersion, minVersion)).toEqual([
            '<38',
            '>38',
            '>=39',
            '>39',
            '>=40',
            '>40',
            '>=41',
        ])
    })

    test('instanceVersion number 2.38, minVersion 38', () => {
        const instanceVersion = 2.38
        const minVersion = '38'
        expect(getExcludedTags(instanceVersion, minVersion)).toEqual([
            '<38',
            '>38',
            '>=39',
            '>39',
            '>=40',
            '>40',
            '>=41',
        ])
    })

    test('instanceVersion 38-SNAPSHOT.2, minVersion 38', () => {
        const instanceVersion = '38-SNAPSHOT.2'
        const minVersion = '38'
        expect(getExcludedTags(instanceVersion, minVersion)).toEqual([
            '<38',
            '>38',
            '>=39',
            '>39',
            '>=40',
            '>40',
            '>=41',
        ])
    })

    test('instanceVersion 2.41-SNAPSHOT, minVersion 38', () => {
        const instanceVersion = '2.41-SNAPSHOT'
        const minVersion = '38'
        expect(getExcludedTags(instanceVersion, minVersion)).toEqual([
            '<=38',
            '<38',
            '<=39',
            '<39',
            '<40',
            '<=40',
            '<41',
        ])
    })
})
