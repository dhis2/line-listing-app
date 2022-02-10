import { IconChevronRight16 } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './MenuItem.module.css'

const MenuItem = ({ icon, label, count, onClick, selected }) => (
    <div
        className={cx(styles.container, { [styles.selected]: selected })}
        onClick={onClick}
        tabIndex="0"
    >
        <div className={styles.icon}>{icon}</div>
        <div className={styles.label}>{label}</div>
        {typeof count === 'number' && count > 0 && (
            <div className={styles.count}>{count}</div>
        )}
        <IconChevronRight16 />
    </div>
)

MenuItem.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    count: PropTypes.number,
    selected: PropTypes.bool,
}

export { MenuItem }
