import { VIS_TYPE_PIVOT_TABLE } from '@dhis2/analytics'
import lineListConfig from './lineListConfig.jsx'
import pivotTableConfig from './pivotTableConfig.jsx'

export const getOptionsByType = ({ type, serverVersion }) => {
    switch (type) {
        case VIS_TYPE_PIVOT_TABLE:
            return pivotTableConfig()
        default:
            return lineListConfig(serverVersion)
    }
}
