import { getExcludedTags } from '../../cypress/support/getExcludedTags.js'

describe('get excluded Cypress tags', () => {
    test('instanceVersion 2.38, minVersion 2.38', () => {
        const instanceVersion = '2.38'
        const minVersion = '2.38'
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

    test('instanceVersion 2.39, minVersion 2.38', () => {
        const instanceVersion = '2.39'
        const minVersion = '2.38'
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

    test('instanceVersion 2.40, minVersion 2.38', () => {
        const instanceVersion = '2.40'
        const minVersion = '2.38'
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

    test('instanceVersion 2.41-SNAPSHOT, minVersion 2.38', () => {
        const instanceVersion = '2.41-SNAPSHOT'
        const minVersion = '2.38'
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

    test('instanceVersion dev, minVersion 2.38', () => {
        const instanceVersion = 'dev'
        const minVersion = '2.38'
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

    test('instanceVersion number 2.38, minVersion number 2.38', () => {
        const instanceVersion = 2.38
        const minVersion = 2.38
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

    // unexpected argument forms
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

    test('instanceVersion 38-SNAPSHOT.2, minVersion 2.38', () => {
        const instanceVersion = '38-SNAPSHOT.2'
        const minVersion = '2.38'
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

    test('instanceVersion Dev, minVersion 2.38', () => {
        const instanceVersion = 'Dev'
        const minVersion = '2.38'
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

    test('instanceVersion 37, minVersion 2.38 should throw', () => {
        const instanceVersion = '37'
        const minVersion = '2.38'
        expect(() => {
            getExcludedTags(instanceVersion, minVersion)
        }).toThrow()
    })
})
