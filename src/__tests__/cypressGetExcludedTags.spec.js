import { getExcludedTags } from '../../cypress/plugins/excludeByVersionTags.js'

describe('get excluded Cypress tags', () => {
    test('instanceVersion 2.39', () => {
        expect(getExcludedTags('2.39')).toEqual([
            '<=38',
            '<38',
            '<39',
            '>39',
            '>=40',
            '>40',
            '>=41',
        ])
    })

    test('instanceVersion 2.40', () => {
        expect(getExcludedTags('2.40')).toEqual([
            '<=38',
            '<38',
            '<=39',
            '<39',
            '<40',
            '>40',
            '>=41',
        ])
    })

    test('instanceVersion 2.41-SNAPSHOT', () => {
        expect(getExcludedTags('2.41-SNAPSHOT')).toEqual([
            '<=38',
            '<38',
            '<=39',
            '<39',
            '<40',
            '<=40',
            '<41',
        ])
    })

    test('instanceVersion dev', () => {
        expect(getExcludedTags('dev')).toEqual([
            '<=38',
            '<38',
            '<=39',
            '<39',
            '<40',
            '<=40',
            '<41',
        ])
    })

    // unexpected argument forms
    test('instanceVersion 39', () => {
        expect(getExcludedTags('39')).toEqual([
            '<38',
            '>38',
            '>=39',
            '>39',
            '>=40',
            '>40',
            '>=41',
        ])
    })

    test('instanceVersion 39-SNAPSHOT.2', () => {
        expect(getExcludedTags('39-SNAPSHOT.2')).toEqual([
            '<38',
            '>38',
            '>=39',
            '>39',
            '>=40',
            '>40',
            '>=41',
        ])
    })

    test('instanceVersion Dev', () => {
        expect(getExcludedTags('Dev')).toEqual([
            '<=38',
            '<38',
            '<=39',
            '<39',
            '<40',
            '<=40',
            '<41',
        ])
    })

    test('instanceVersion 2.38', () => {
        expect(() => {
            getExcludedTags('2.38')
        }).toThrow()
    })
})
