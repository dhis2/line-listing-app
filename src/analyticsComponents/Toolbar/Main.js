import PropTypes from 'prop-types'
import React from 'react'

export const Main = ({ children }) => <div>{children}</div>

Main.propTypes = {
    children: PropTypes.node,
}
