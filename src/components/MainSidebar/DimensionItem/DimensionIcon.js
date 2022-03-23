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
import DynamicDimensionIcon from '../../../assets/DynamicDimensionIcon.js'
import {
    DIMENSION_TYPE_PERIOD,
    DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
    DIMENSION_TYPE_CATEGORY,
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_STATUS,
    DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET,
    DIMENSION_TYPE_OU,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
    DIMENSION_TYPE_USER,
} from '../../../modules/dimensionConstants.js'

const DIMENSION_TYPE_ICONS = {
    /**PROGRAM**/
    [DIMENSION_TYPE_DATA_ELEMENT]: IconDimensionData16,
    [DIMENSION_TYPE_PROGRAM_ATTRIBUTE]: IconDimensionData16,
    [DIMENSION_TYPE_PROGRAM_INDICATOR]: IconDimensionProgramIndicator16,
    [DIMENSION_TYPE_CATEGORY]: IconFilter16,
    [DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET]:
        IconDimensionCategoryOptionGroupset16,
    /**YOURS**/
    [DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET]:
        IconDimensionOrgUnitGroupset16,
    /**MAIN**/
    [DIMENSION_TYPE_OU]: IconDimensionOrgUnit16,
    [DIMENSION_TYPE_STATUS]: IconCheckmarkCircle16,
    [DIMENSION_TYPE_USER]: IconUser16,
    /**TIME**/
    [DIMENSION_TYPE_PERIOD]: IconCalendar16,
}

// Presentational component used by dnd - do not add redux or dnd functionality

const InternalDimensionIcon = ({ dimensionType }) => {
    const Icon =
        dimensionType && DIMENSION_TYPE_ICONS[dimensionType]
            ? DIMENSION_TYPE_ICONS[dimensionType]
            : DynamicDimensionIcon

    return <Icon />
}

InternalDimensionIcon.propTypes = {
    dimensionType: PropTypes.string,
}

const DimensionIcon = React.memo(InternalDimensionIcon)

export { DimensionIcon }
