import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/MessageStatsBar.module.css'

const MessageStatsBar = ({ children }) => (
    <div className={styles.container}>{children}</div>
)

MessageStatsBar.propTypes = {
    children: PropTypes.node.isRequired,
}

export { MessageStatsBar }
