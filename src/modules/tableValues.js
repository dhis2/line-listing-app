import {
    formatValue,
    VALUE_TYPE_AGE,
    VALUE_TYPE_DATE,
    VALUE_TYPE_DATETIME,
    VALUE_TYPE_TEXT,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import moment from 'moment'
import {
    DIMENSION_ID_EVENT_STATUS,
    DIMENSION_ID_PROGRAM_STATUS,
    DIMENSION_ID_LAST_UPDATED,
} from './dimensionConstants.js'
import { extractDimensionIdParts } from './utils.js'
import { headersMap, getStatusNames } from './visualization.js'

const getFormattedCellValue = ({ value, header = {}, visualization = {} }) => {
    if (
        header.name &&
        [
            headersMap[DIMENSION_ID_EVENT_STATUS],
            headersMap[DIMENSION_ID_PROGRAM_STATUS],
        ].includes(
            extractDimensionIdParts(header.name, visualization.type).dimensionId
        )
    ) {
        return getStatusNames()[value] || value
    }

    if ([VALUE_TYPE_DATE, VALUE_TYPE_DATETIME].includes(header.valueType)) {
        return (
            value &&
            moment(value).format(
                header.name === headersMap[DIMENSION_ID_LAST_UPDATED] ||
                    header.valueType === VALUE_TYPE_DATETIME
                    ? 'yyyy-MM-DD hh:mm'
                    : 'yyyy-MM-DD'
            )
        )
    } else if (header?.valueType === VALUE_TYPE_AGE) {
        return value && moment(value).format('yyyy-MM-DD')
    } else {
        return formatValue(
            value,
            header.valueType || VALUE_TYPE_TEXT,
            header.optionSet
                ? {}
                : {
                      digitGroupSeparator: visualization.digitGroupSeparator,
                      skipRounding: false,
                  }
        )
    }
}

const getHeaderText = ({ stageOffset, column } = {}) => {
    if (!column) {
        return ''
    }

    if (Number.isInteger(stageOffset)) {
        let postfix

        if (stageOffset === 0) {
            postfix = i18n.t('most recent')
        } else if (stageOffset === 1) {
            postfix = i18n.t('oldest')
        } else if (stageOffset > 1) {
            postfix = i18n.t('oldest {{repeatEventIndex}}', {
                repeatEventIndex: `+${stageOffset - 1}`,
            })
        } else if (stageOffset < 0) {
            postfix = i18n.t('most recent {{repeatEventIndex}}', {
                repeatEventIndex: stageOffset,
            })
        }

        return `${column} (${postfix})`
    }

    return column
}

export { getFormattedCellValue, getHeaderText }
