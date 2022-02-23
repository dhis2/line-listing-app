import { VIS_TYPE_LINE_LIST, VIS_TYPE_PIVOT_TABLE } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import LineListIcon from '../../../assets/LineListIcon.js'
import PivotTableIcon from '../../../assets/PivotTableIcon.js'

const ListItemIcon = ({ visType, style }) => {
    switch (visType) {
        case VIS_TYPE_LINE_LIST:
            return <LineListIcon style={style} />
        case VIS_TYPE_PIVOT_TABLE:
            return <PivotTableIcon style={style} />
    }
}

ListItemIcon.propTypes = {
    visType: PropTypes.string.isRequired,
    style: PropTypes.object,
}

export default ListItemIcon
