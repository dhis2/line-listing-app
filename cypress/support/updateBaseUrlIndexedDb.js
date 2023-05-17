export function updateBaseUrlIndexedDb({
    appName,
    baseUrlDbName,
    baseUrlStoreName,
    baseUrl,
}) {
    const openRequest = indexedDB.open(baseUrlDbName)
    addOpenRequestHandlers({
        openRequest,
        appName,
        baseUrlDbName,
        baseUrlStoreName,
        baseUrl,
    })
}

function addOpenRequestHandlers({
    openRequest,
    appName,
    baseUrlDbName,
    baseUrlStoreName,
    baseUrl,
}) {
    openRequest.onupgradeneeded = () => {
        console.warn(
            `IndexedDB ${baseUrlDbName} needs an update. This could be a problem ¯\\_(ツ)_/¯`
        )
    }
    openRequest.onerror = () => {
        console.error(
            `Could not open indexedDB ${baseUrlDbName}`,
            openRequest.error
        )
    }
    openRequest.onsuccess = () => {
        const db = openRequest.result

        if (db.objectStoreNames.contains(baseUrlStoreName)) {
            const transaction = db.transaction(baseUrlStoreName, 'readwrite')
            const baseUrlStore = transaction.objectStore(baseUrlStoreName)
            const readRequest = baseUrlStore.get(appName)
            addReadRequestHandlers({
                readRequest,
                baseUrlStore,
                appName,
                baseUrlDbName,
                baseUrl,
            })
        }
    }
}

function addReadRequestHandlers({
    readRequest,
    baseUrlStore,
    appName,
    baseUrlDbName,
    baseUrl,
}) {
    readRequest.onsuccess = () => {
        if (readRequest.result === baseUrl) {
            console.log(
                `Base URL (${baseUrl}) in Cypress ENV is equal to the value in indexedDB. All is well.`
            )
        } else {
            console.log(
                `Base URL in Cypress ENV (${baseUrl}) and not equal to the value found in indexedDB (${readRequest.result}). We will attempt an update.`
            )

            const putRequest = baseUrlStore.put({ appName, baseUrl })
            addPutRequestHandlers({ putRequest, baseUrlDbName, baseUrl })
        }
    }
    readRequest.onerror = () => {
        console.error(
            `Could not read baseUrl from indexedDB ${baseUrlDbName}`,
            readRequest.error
        )
    }
}

function addPutRequestHandlers({ putRequest, baseUrlDbName, baseUrl }) {
    putRequest.onsuccess = () => {
        console.log(`Base URL in indexedDB updated successfully to ${baseUrl}`)
    }
    putRequest.onerror = () => {
        console.error(
            `Could not update baseUrl in indexedDB ${baseUrlDbName}`,
            putRequest.error
        )
    }
}
