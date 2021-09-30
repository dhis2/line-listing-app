import pivotTableConfig from './pivotTableConfig'

export const getOptionsByType = type => {
    switch (type) {
        // TODO: Add case for line list type
        default:
            return pivotTableConfig()
    }
}
