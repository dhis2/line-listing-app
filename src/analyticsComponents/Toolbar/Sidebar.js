import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

export const Sidebar = ({ children, isHidden }) => (
    <div className={cx('container', { isHidden })}>{children}</div>
)

Sidebar.propTypes = {
    children: PropTypes.node,
    isHidden: PropTypes.bool,
}
