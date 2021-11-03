import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/MessageButtonStrip.module.css'

const MessageButtonStrip = ({ children }) => (
    <div className={styles.container}>{children}</div>
)

MessageButtonStrip.propTypes = {
    children: PropTypes.node.isRequired,
}

export { MessageButtonStrip }
