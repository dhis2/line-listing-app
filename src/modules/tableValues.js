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
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_LAST_UPDATED,
    DIMENSION_ID_CREATED_BY,
    DIMENSION_ID_LAST_UPDATED_BY,
} from './dimensionConstants.js'
import { extractDimensionIdParts } from './dimensionId.js'
import { getTimeDimensions } from './timeDimensions.js'
import {
    headersMap,
    getDimensionIdFromHeaderName,
    getStatusNames,
} from './visualization.js'

const timeDimensions = getTimeDimensions()

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

    // TODO: Remove this when DHIS2-15225 is resolved in backend
    if (
        [
            headersMap[DIMENSION_ID_CREATED_BY],
            headersMap[DIMENSION_ID_LAST_UPDATED_BY],
        ].includes(header.name) &&
        value === ',  ()'
    ) {
        return ''
    }

    let valueType = header.valueType

    if ([VALUE_TYPE_DATE, VALUE_TYPE_DATETIME].includes(valueType)) {
        const dimensionId = extractDimensionIdParts(
            header.name,
            visualization.type
        ).dimensionId

        if (
            header.name &&
            [
                headersMap[DIMENSION_ID_EVENT_DATE],
                headersMap[DIMENSION_ID_ENROLLMENT_DATE],
                headersMap[DIMENSION_ID_INCIDENT_DATE],
                headersMap[DIMENSION_ID_SCHEDULED_DATE],
            ].includes(dimensionId)
        ) {
            // override valueType for time dimensions to format the value as date (DHIS2-17855)
            valueType =
                timeDimensions[
                    getDimensionIdFromHeaderName(dimensionId, visualization)
                ].formatType
        }

        return (
            value &&
            moment(value).format(
                header.name === headersMap[DIMENSION_ID_LAST_UPDATED] ||
                    valueType === VALUE_TYPE_DATETIME
                    ? 'yyyy-MM-DD HH:mm'
                    : 'yyyy-MM-DD'
            )
        )
    } else if (valueType === VALUE_TYPE_AGE) {
        return value && moment(value).format('yyyy-MM-DD')
    } else {
        return formatValue(
            value,
            valueType || VALUE_TYPE_TEXT,
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
        let repetitionSuffix

        if (stageOffset === 0) {
            repetitionSuffix = i18n.t('most recent')
        } else if (stageOffset === 1) {
            repetitionSuffix = i18n.t('oldest')
        } else if (stageOffset > 1) {
            repetitionSuffix = i18n.t('oldest {{repeatEventIndex}}', {
                repeatEventIndex: `+${stageOffset - 1}`,
            })
        } else if (stageOffset < 0) {
            repetitionSuffix = i18n.t('most recent {{repeatEventIndex}}', {
                repeatEventIndex: stageOffset,
            })
        }

        return `${column} (${repetitionSuffix})`
    }

    return column
}

export { getFormattedCellValue, getHeaderText }
