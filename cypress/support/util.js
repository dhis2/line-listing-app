export const EXTENDED_TIMEOUT = { timeout: 25000 }

export const getApiBaseUrl = () => {
    const baseUrl = Cypress.env('dhis2BaseUrl') || ''

    if (!baseUrl) {
        throw new Error(
            'No `dhis2BaseUrl` found. Please make sure to add it to `cypress.env.json`'
        )
    }

    return baseUrl
}
