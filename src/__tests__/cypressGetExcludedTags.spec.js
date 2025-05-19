import { getExcludedTags } from '../../cypress/plugins/excludeByVersionTags.js'

describe('get excluded Cypress tags', () => {
    test('instanceVersion 2.40', () => {
        expect(getExcludedTags('2.40')).toEqual([
            '<40',
            '>40',
            '>=41',
            '>41',
            '>=42',
            '>42',
            '>=43',
        ])
    })

    test('instanceVersion 2.41', () => {
        expect(getExcludedTags('2.41')).toEqual([
            '<=40',
            '<40',
            '<41',
            '>41',
            '>=42',
            '>42',
            '>=43',
        ])
    })

    test('instanceVersion 2.42-SNAPSHOT', () => {
        expect(getExcludedTags('2.42-SNAPSHOT')).toEqual([
            '<=40',
            '<40',
            '<=41',
            '<41',
            '<42',
            '>42',
            '>=43',
        ])
    })

    test('instanceVersion dev', () => {
        expect(getExcludedTags('dev')).toEqual([
            '<=40',
            '<40',
            '<=41',
            '<41',
            '<42',
            '<=42',
            '<43',
        ])
    })

    // unexpected argument forms
    test('instanceVersion 40', () => {
        expect(getExcludedTags('40')).toEqual([
            '<40',
            '>40',
            '>=41',
            '>41',
            '>=42',
            '>42',
            '>=43',
        ])
    })

    test('instanceVersion 40-SNAPSHOT.2', () => {
        expect(getExcludedTags('40-SNAPSHOT.2')).toEqual([
            '<40',
            '>40',
            '>=41',
            '>41',
            '>=42',
            '>42',
            '>=43',
        ])
    })

    test('instanceVersion Dev', () => {
        expect(getExcludedTags('Dev')).toEqual([
            '<=40',
            '<40',
            '<=41',
            '<41',
            '<42',
            '<=42',
            '<43',
        ])
    })

    test('instanceVersion 2.39', () => {
        expect(() => {
            getExcludedTags('2.39')
        }).toThrow()
    })
})
