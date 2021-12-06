import PropTypes from 'prop-types'
import React from 'react'
import { visTypeMap } from '../../../modules/visualization.js'

const ListItemIcon = ({ visType, style }) => {
    const Icon = visTypeMap[visType].icon

    return <Icon style={style} />
}

ListItemIcon.propTypes = {
    style: PropTypes.object,
    visType: PropTypes.string,
}

export default ListItemIcon
