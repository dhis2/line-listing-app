import * as core from '@actions/core'
import { HttpClient } from '@actions/http-client'
import versionsFixture from '../__fixtures__/versions.json'
import {
    isValidVersionString,
    getMinDHIS2Version,
    getReleaseCandidates,
    getBrokenVersions,
    getStableVersions,
    computeSupportedVersions,
    main,
    STABLE_VERSIONS_URL,
} from '../index.js'

describe('Custom GitHub JS Action - Supported Versions', () => {
    const mockHttpGetToReturnFixture = () =>
        jest
            .spyOn(HttpClient.prototype, 'get')
            .mockImplementationOnce(async () =>
                Promise.resolve({
                    readBody: () =>
                        Promise.resolve(JSON.stringify(versionsFixture)),
                })
            )

    describe('isValidVersionString', () => {
        it('accepts a valid regular version', () => {
            expect(isValidVersionString('2.38.0')).toBe(true)
            expect(isValidVersionString('2.38.0.1')).toBe(true)
        })
        it('accepts a release candidate version', () => {
            expect(isValidVersionString('2.38.0-rc', true)).toBe(true)
            expect(isValidVersionString('2.38.0.1-rc', true)).toBe(true)
        })
        it('rejects invalid values', () => {
            expect(isValidVersionString('3.38.0')).toBe(false) // wrong start
            expect(isValidVersionString('2.38-rc')).toBe(false) // rc without passing 2nd arg
            expect(isValidVersionString('2.38-xx', true)).toBe(false) // wrong suffix
            expect(isValidVersionString('2')).toBe(false) // too short
            expect(isValidVersionString('2.38')).toBe(false) // too short
            expect(isValidVersionString('2.38.0.1.0')).toBe(false) // too long
            expect(isValidVersionString('2.str.0.1')).toBe(false) // not an int >= 0
            expect(isValidVersionString('2.-1.0.1')).toBe(false) // negative int
        })
    })

    describe('getMinDHIS2Version', () => {
        it('reads the minDHIS2Version correctly from the default location', () => {
            expect(getMinDHIS2Version()).toBe('2.38')
        })
        it('reads the minDHIS2Version correctly from a custom location', () => {
            jest.spyOn(core, 'getInput').mockReturnValueOnce(
                'src/gh-js-actions/supported-versions/__fixtures__'
            )
            expect(getMinDHIS2Version()).toBe('2.37')
        })
        it('will error if no d2 config file is found', () => {
            jest.spyOn(core, 'getInput').mockReturnValueOnce(
                'this/is/not/a/valid/path'
            )
            expect(getMinDHIS2Version).toThrow('Cannot find module')
        })
    })

    describe('getReleaseCandidates', () => {
        it('returns an array of release candidates if one is supplied', () => {
            const rc1 = '2.38.4-rc'
            jest.spyOn(core, 'getInput').mockReturnValueOnce(rc1)
            expect(getReleaseCandidates()).toEqual([rc1])
        })
        it('returns an array of release candidates if multiple are supplied', () => {
            const rc1 = '2.38.4-rc'
            const rc2 = '2.39.1-rc'
            jest.spyOn(core, 'getInput').mockReturnValueOnce(`${rc1},${rc2}`)
            expect(getReleaseCandidates()).toEqual([rc1, rc2])
        })
        it('returns an empty array when input is empty', () => {
            jest.spyOn(core, 'getInput').mockReturnValueOnce('')
            expect(getReleaseCandidates()).toEqual([])
        })
    })
    describe('getBrokenVersions', () => {
        it('returns an array of broken versions if one is supplied', () => {
            const brokenVersion1 = '2.39.2.1'
            jest.spyOn(core, 'getInput').mockReturnValueOnce(brokenVersion1)
            expect(getBrokenVersions()).toEqual([brokenVersion1])
        })
        it('returns an array of broken versions if multiple are supplied', () => {
            const brokenVersion1 = '2.39.2.1'
            const brokenVersion2 = '2.37.9.1'
            jest.spyOn(core, 'getInput').mockReturnValueOnce(
                `${brokenVersion1},${brokenVersion2}`
            )
            expect(getBrokenVersions()).toEqual([
                brokenVersion1,
                brokenVersion2,
            ])
        })
        it('returns an empty array when input is empty', () => {
            jest.spyOn(core, 'getInput').mockReturnValueOnce('')
            expect(getBrokenVersions()).toEqual([])
        })
    })

    describe('getStableVersions', () => {
        it('calls the right URL to get the stable versions and returns the versions array', async () => {
            const httpGetMock = mockHttpGetToReturnFixture()

            const results = await getStableVersions()

            expect(httpGetMock).toHaveBeenCalledWith(STABLE_VERSIONS_URL)
            expect(results).toEqual(versionsFixture.versions)
            expect(Array.isArray(results)).toBe(true)
        })
    })

    describe('computeSupportedVersions', () => {
        it('should produce the correct output given a known input', () => {
            expect(
                computeSupportedVersions({
                    stableVersions: versionsFixture.versions,
                })
            ).toEqual(['2.40.0.1', '2.39.2.1', '2.38.4.3', '2.37.9.1'])
        })
        it('should omit lower versions when a minDHIS2Version is provided', () => {
            expect(
                computeSupportedVersions({
                    stableVersions: versionsFixture.versions,
                    minDHIS2Version: '2.38',
                })
            ).toEqual(['2.40.0.1', '2.39.2.1', '2.38.4.3'])
        })
        it('should replace a stables version with RCs when releaseCandidates are provided', () => {
            expect(
                computeSupportedVersions({
                    stableVersions: versionsFixture.versions,
                    releaseCandidates: ['2.40.0.2-rc', '2.39.2.2-rc'],
                })
            ).toEqual(['2.40.0.2-rc', '2.39.2.2-rc', '2.38.4.3', '2.37.9.1'])
        })
        it('should omit broken versions when brokenVersions are provided', () => {
            expect(
                computeSupportedVersions({
                    stableVersions: versionsFixture.versions,
                    brokenVersions: ['2.39.2.1', '2.37.9.1'],
                })
            ).toEqual(['2.40.0.1', '2.38.4.3'])
        })
    })

    describe('main', () => {
        it('works as expected without inputs', async () => {
            mockHttpGetToReturnFixture()
            const setOutputSpy = jest.spyOn(core, 'setOutput')

            const expectedValue = JSON.stringify([
                '2.40.0.1',
                '2.39.2.1',
                '2.38.4.3',
            ])

            await main()

            expect(setOutputSpy).toHaveBeenCalledWith('versions', expectedValue)
        })
        it('works as expected with inputs', async () => {
            mockHttpGetToReturnFixture()
            jest.spyOn(core, 'getInput').mockImplementation((fieldName) => {
                switch (fieldName) {
                    case 'release-candidates':
                        return '2.40.0.2-rc,2.39.2.2-rc'
                    case 'config-dir':
                        return 'src/gh-js-actions/supported-versions/__fixtures__'
                    default:
                        return ''
                }
            })
            const setOutputSpy = jest.spyOn(core, 'setOutput')

            const expectedValue = JSON.stringify([
                '2.40.0.2-rc',
                '2.39.2.2-rc',
                '2.38.4.3',
                '2.37.9.1',
            ])

            await main()

            expect(setOutputSpy).toHaveBeenCalledWith('versions', expectedValue)
        })
        it('calls setFailed if the process fails', async () => {
            mockHttpGetToReturnFixture()
            jest.spyOn(core, 'getInput').mockImplementation((fieldName) => {
                switch (fieldName) {
                    case 'release-candidates':
                        return 'not.a.valid.rc,2.39.2.2-rc'
                    case 'config-dir':
                        return 'src/gh-js-actions/supported-versions/__fixtures__'
                    default:
                        return ''
                }
            })
            const setFailedSpy = jest.spyOn(core, 'setFailed')

            await main()

            expect(setFailedSpy).toHaveBeenCalledWith(
                'Could not compute supported versions: The string "not.a.valid.rc" is not a valid release candidate version'
            )
        })
    })
})
