import * as core from '@actions/core'
import {
    getdhis2DockerHubImageTag,
    getDhis2DbDumpUrl,
    getdhis2DbCacheKey,
    getDhis2ApiVersion,
    main,
} from '../index.js'

describe('Custom GitHub JS Action - Instance Version Params', () => {
    const validVersionString = '2.38.0'

    describe('getdhis2DockerHubImageTag', () => {
        it('returns the expected string', () => {
            expect(getdhis2DockerHubImageTag(validVersionString)).toBe(
                'dhis2/core:2.38.0'
            )
        })
    })

    describe('getDhis2DbDumpUrl', () => {
        // it('returns the expected string', () => {
        //     expect(getDhis2DbDumpUrl(validVersionString)).toBe(
        //         'https://databases.dhis2.org/sierra-leone/2.38.0/dhis2-db-sierra-leone.sql.gz'
        //     )
        // })

        // it('omits hotfix version', () => {
        //     expect(getDhis2DbDumpUrl('2.38.0.1')).toBe(
        //         'https://databases.dhis2.org/sierra-leone/2.38.0/dhis2-db-sierra-leone.sql.gz'
        //     )
        // })
        it('always returns the same URL string', () => {
            const expectedString =
                'https://databases.dhis2.org/sierra-leone/2.38/dhis2-db-sierra-leone.sql.gz'

            expect(getDhis2DbDumpUrl('2.39.0.1')).toBe(expectedString)
            expect(getDhis2DbDumpUrl('2.40')).toBe(expectedString)
            expect(getDhis2DbDumpUrl('2.37.9.9-rc')).toBe(expectedString)
        })
    })

    describe('getdhis2DbCacheKey', () => {
        it('returns the expected string', () => {
            expect(getdhis2DbCacheKey(validVersionString)).toBe(
                'dhis2-core-v38-db-dump'
            )
        })
    })

    describe('dhis2ApiVersion', () => {
        it('returns the expected string', () => {
            expect(getDhis2ApiVersion(validVersionString)).toBe('38')
        })
    })

    describe('main', () => {
        it('works as expected', () => {
            jest.spyOn(core, 'getInput').mockReturnValueOnce(validVersionString)
            const setOutputSpy = jest.spyOn(core, 'setOutput')

            main()

            expect(setOutputSpy).toHaveBeenCalledTimes(4)
            expect(setOutputSpy.mock.calls[0]).toEqual([
                'dhis2-docker-hub-image-tag',
                'dhis2/core:2.38.0',
            ])
            expect(setOutputSpy.mock.calls[1]).toEqual([
                'dhis2-db-dump-url',
                'https://databases.dhis2.org/sierra-leone/2.38/dhis2-db-sierra-leone.sql.gz',
            ])
            expect(setOutputSpy.mock.calls[2]).toEqual([
                'dhis2-db-cache-key',
                'dhis2-core-v38-db-dump',
            ])
            expect(setOutputSpy.mock.calls[3]).toEqual([
                'dhis2-api-version',
                '38',
            ])
        })
    })
})
