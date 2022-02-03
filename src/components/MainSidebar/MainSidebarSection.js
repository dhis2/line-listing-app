import PropTypes from 'prop-types'
import React from 'react'
import styles from './MainSidebarSection.module.css'

export const MainSidebarSection = ({ children, header }) => (
    <div className={styles.container}>
        <div className={styles.header}>{header}</div>
        <div className={styles.list}>{children}</div>
    </div>
)

MainSidebarSection.propTypes = {
    children: PropTypes.node,
    header: PropTypes.string,
}
