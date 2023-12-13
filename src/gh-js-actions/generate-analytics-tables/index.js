const core = require('@actions/core')
const { HttpClient } = require('@actions/http-client')
const { BasicCredentialHandler } = require('@actions/http-client/lib/auth.js')

function createHttpClientWithBasicAuth() {
    const username = core.getInput('dhis2-username')
    const password = core.getInput('dhis2-password')
    const basicCredentialHandler = new BasicCredentialHandler(
        username,
        password
    )

    return new HttpClient(undefined, [basicCredentialHandler])
}

function createApiUrl(endpoint) {
    const apiVersion = core.getInput('dhis2-api-version')

    return `http://127.0.0.1:8080/api/${apiVersion}/${endpoint}`
}

function createAnalyticsTablesGenerationTask(httpClient) {
    const url = createApiUrl('resourceTables/analytics')
    core.debug(`POST request to ${url}`)

    return httpClient
        .post(url)
        .then((response) => response.readBody())
        .then((body) => JSON.parse(body))
        .then(({ response }) => response.id)
}

function getAnalyticsTablesGenerationLog(httpClient, jobId) {
    const url = createApiUrl(`system/tasks/ANALYTICS_TABLE/${jobId}`)
    // core.debug(`GET request to ${url}`)

    return httpClient
        .get(url)
        .then((response) => response.readBody())
        .then((body) => JSON.parse(body))
}

async function pollAnalyticsTableGeneration(httpClient, jobId) {
    const startTime = Date.now()
    // This seems a long time, but on CI a duration of nearly 10 minutes is not uncommon
    const maxDurationInMinutes = 15
    const maxDurationInMs = maxDurationInMinutes * 60 * 60 * 1000
    let logItemStartIndex = 0
    const doPoll = async function (resolve, reject) {
        const logItems = await getAnalyticsTablesGenerationLog(
            httpClient,
            jobId
        )
        const isTableGenerationDone = logItems.some(
            ({ completed }) => completed
        )
        const now = Date.now()
        const elapsedMinutes = ((now - startTime) / 1000 / 60).toFixed(1)
        const isWithinMaxDuration = now - startTime <= maxDurationInMs

        if (isTableGenerationDone) {
            core.notice(
                `Analytics tabled generated successfully in ${elapsedMinutes} minutes`
            )
            resolve(isTableGenerationDone)
        } else if (isWithinMaxDuration) {
            logItems
                .reverse()
                .slice(logItemStartIndex, logItems.length - 1)
                .forEach(({ message, time }) => {
                    core.info(`${time}\t${message}`)
                })
            logItemStartIndex = logItems.length
            setTimeout(doPoll, 2000, resolve, reject)
        } else {
            reject(
                new Error(
                    `Analytics tables generation did not complete within ${maxDurationInMinutes} minutes, aborting.`
                )
            )
        }
    }
    return new Promise(doPoll)
}

async function main() {
    try {
        const httpClient = createHttpClientWithBasicAuth()
        core.notice('Requesting analytics tables generation initialization')
        const jobId = await createAnalyticsTablesGenerationTask(httpClient)
        core.notice(
            `Analytics tables generation initialized with job ID ${jobId}. Progress will be logged below:`
        )
        return await pollAnalyticsTableGeneration(httpClient, jobId)
    } catch (error) {
        core.setFailed(`Could not generate analytics tables: ${error.message}`)
    }
}

main()

module.exports = {
    createHttpClientWithBasicAuth,
    createApiUrl,
    createAnalyticsTablesGenerationTask,
    getAnalyticsTablesGenerationLog,
    pollAnalyticsTableGeneration,
    main,
}
