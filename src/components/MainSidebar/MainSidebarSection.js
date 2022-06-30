import PropTypes from 'prop-types'
import React from 'react'
import styles from './MainSidebarSection.module.css'

export const MainSidebarSection = ({ children, header, dataTest }) => (
    <div className={styles.container} data-test={dataTest}>
        <div className={styles.header}>{header}</div>
        <div className={styles.list}>{children}</div>
    </div>
)

MainSidebarSection.propTypes = {
    children: PropTypes.node,
    dataTest: PropTypes.string,
    header: PropTypes.string,
}
