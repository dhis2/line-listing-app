import * as core from '@actions/core'
import { HttpClient } from '@actions/http-client'
import {
    createApiUrl,
    createAnalyticsTablesGenerationTask,
    getAnalyticsTablesGenerationLog,
} from '../index.js'

jest.useFakeTimers()

describe('Custom GitHub JS Action - Generate Analytics Tables', () => {
    const httpClientGetSpy = jest.spyOn(HttpClient.prototype, 'get')
    const httpClientPostSpy = jest.spyOn(HttpClient.prototype, 'post')
    const httpClient = new HttpClient()
    const createHttpClientMockImplementation = (responseObject) => async () =>
        Promise.resolve({
            readBody: () => Promise.resolve(JSON.stringify(responseObject)),
        })

    describe('createApiUrl', () => {
        it('returns the expect result', () => {
            jest.spyOn(core, 'getInput').mockReturnValueOnce('39')

            expect(createApiUrl('test/endpoint')).toBe(
                'http://127.0.0.1:8080/api/39/test/endpoint'
            )
        })
    })

    describe('createAnalyticsTablesGenerationTask', () => {
        it('does a POST requests to resourceTables/analytics and returns a job id', async () => {
            jest.spyOn(core, 'getInput').mockReturnValueOnce('39')
            const testId = 'test-id'
            httpClientPostSpy.mockImplementationOnce(
                createHttpClientMockImplementation({
                    response: {
                        id: testId,
                    },
                })
            )

            const id = await createAnalyticsTablesGenerationTask(httpClient)

            expect(httpClientPostSpy).toHaveBeenCalledTimes(1)
            expect(httpClientPostSpy).toHaveBeenCalledWith(
                'http://127.0.0.1:8080/api/39/resourceTables/analytics'
            )
            expect(id).toBe('test-id')
        })
    })

    describe('checkAnalyticsTablesGenerationCompletion', () => {
        it('does a GET requests to system/tasks/ANALYTICS_TABLE/<JOB-ID>', async () => {
            jest.spyOn(core, 'getInput').mockReturnValueOnce('39')
            const jobLogItems = [
                { completed: false },
                { completed: false },
                { completed: false },
            ]
            httpClientGetSpy.mockImplementationOnce(
                createHttpClientMockImplementation(jobLogItems)
            )
            const result = await getAnalyticsTablesGenerationLog(
                httpClient,
                'test-job-id'
            )

            expect(httpClientGetSpy).toHaveBeenCalledTimes(1)
            expect(httpClientGetSpy).toHaveBeenCalledWith(
                'http://127.0.0.1:8080/api/39/system/tasks/ANALYTICS_TABLE/test-job-id'
            )
            expect(result).toEqual(jobLogItems)
        })
    })

    /* We should really also test the pollAnalyticsTableGeneration function but that's rather hard to do */
})
