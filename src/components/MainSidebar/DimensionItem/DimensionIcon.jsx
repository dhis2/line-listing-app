import {
    DIMENSION_TYPE_PROGRAM_INDICATOR,
    DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_CATEGORY,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_PERIOD,
    DIMENSION_TYPE_ORGANISATION_UNIT,
    DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET,
} from '@dhis2/analytics'
import {
    IconDimensionData16,
    IconDimensionProgramIndicator16,
    IconFilter16,
    IconDimensionCategoryOptionGroupset16,
    IconDimensionOrgUnitGroupset16,
    IconDimensionOrgUnit16,
    IconCheckmarkCircle16,
    IconUser16,
    IconCalendar16,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    DIMENSION_TYPE_STATUS,
    DIMENSION_TYPE_USER,
} from '../../../modules/dimensionConstants.js'

// TODO: move this to ui-icons when Joe is back and has a chance to alter the design
const IconDimensionProgramAttribute16 = () => (
    <svg
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="m15 3 v10h-7v-10z m-1 1 v2h-5v-2z m0 3 v2h-5v-2z m0 3 v2h-5v-2z m-7 -6 h-5v7h5v1h-6v-10h6z"
            fill="#010101"
            fillRule="evenodd"
        />
    </svg>
)

const DIMENSION_TYPE_ICONS = {
    /**PROGRAM**/
    [DIMENSION_TYPE_DATA_ELEMENT]: IconDimensionData16,
    [DIMENSION_TYPE_PROGRAM_ATTRIBUTE]: IconDimensionProgramAttribute16,
    [DIMENSION_TYPE_PROGRAM_INDICATOR]: IconDimensionProgramIndicator16,
    [DIMENSION_TYPE_CATEGORY]: IconFilter16,
    [DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET]:
        IconDimensionCategoryOptionGroupset16,
    /**YOURS**/
    [DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET]:
        IconDimensionOrgUnitGroupset16,
    /**MAIN**/
    [DIMENSION_TYPE_ORGANISATION_UNIT]: IconDimensionOrgUnit16,
    [DIMENSION_TYPE_STATUS]: IconCheckmarkCircle16,
    [DIMENSION_TYPE_USER]: IconUser16,
    /**TIME**/
    [DIMENSION_TYPE_PERIOD]: IconCalendar16,
}

// Presentational component used by dnd - do not add redux or dnd functionality

const DimensionIcon = ({ dimensionType }) => {
    const Icon = dimensionType && DIMENSION_TYPE_ICONS[dimensionType]

    return Icon ? <Icon /> : null
}

DimensionIcon.propTypes = {
    dimensionType: PropTypes.string,
}

export { DimensionIcon }
