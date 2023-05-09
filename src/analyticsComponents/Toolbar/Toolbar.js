import PropTypes from 'prop-types'
import React from 'react'

export const Toolbar = ({ children }) => <div>{children}</div>

Toolbar.propTypes = {
    children: PropTypes.node,
}
