import PropTypes from 'prop-types'
import React from 'react'
import PivotTableIcon from '../../../assets/PivotTableIcon.js'

const ListItemIcon = ({ style }) => {
    // TODO different icon for Line List @joe
    return <PivotTableIcon style={style} />
}

ListItemIcon.propTypes = {
    style: PropTypes.object,
}

export default ListItemIcon
