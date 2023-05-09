import PropTypes from 'prop-types'
import React from 'react'

export const Aside = ({ children }) => <div>{children}</div>

Aside.propTypes = {
    children: PropTypes.node,
}
