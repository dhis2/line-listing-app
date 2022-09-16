/**PROGRAM**/

import {
    DIMENSION_TYPE_CATEGORY,
    DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
    DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET,
} from '@dhis2/analytics'

export const DIMENSION_TYPES_PROGRAM = new Set([
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
    DIMENSION_TYPE_CATEGORY,
    DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
])

export const DIMENSION_TYPES_YOURS = new Set([
    DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET,
])

/**MAIN**/
export const DIMENSION_TYPE_STATUS = 'STATUS'
export const DIMENSION_TYPE_USER = 'USER'

/** DIMENSION_IDS */

export const DIMENSION_ID_PROGRAM_STATUS = 'programStatus'
export const DIMENSION_ID_EVENT_STATUS = 'eventStatus'
export const DIMENSION_ID_CREATED_BY = 'createdBy'
export const DIMENSION_ID_LAST_UPDATED_BY = 'lastUpdatedBy'

/**TIME - specific time dimensions**/
export const DIMENSION_ID_EVENT_DATE = 'eventDate'
export const DIMENSION_ID_ENROLLMENT_DATE = 'enrollmentDate'
export const DIMENSION_ID_INCIDENT_DATE = 'incidentDate'
export const DIMENSION_ID_SCHEDULED_DATE = 'scheduledDate'
export const DIMENSION_ID_LAST_UPDATED = 'lastUpdated'

export const DIMENSION_IDS_TIME = new Set([
    DIMENSION_ID_EVENT_DATE,
    DIMENSION_ID_ENROLLMENT_DATE,
    DIMENSION_ID_INCIDENT_DATE,
    DIMENSION_ID_SCHEDULED_DATE,
    DIMENSION_ID_LAST_UPDATED,
])

export const getUiDimensionType = ({ dimensionId, dimensionType }) => {
    switch (dimensionId) {
        case DIMENSION_ID_PROGRAM_STATUS:
        case DIMENSION_ID_EVENT_STATUS:
            return DIMENSION_TYPE_STATUS

        case DIMENSION_ID_CREATED_BY:
        case DIMENSION_ID_LAST_UPDATED_BY:
            return DIMENSION_TYPE_USER

        default:
            return dimensionType
    }
}
