import PropTypes from 'prop-types'
import React from 'react'
import styles from './TrackedEntityMenuItem.module.css'

const TrackedEntityMenuItem = ({ name, subtitle, active, onClick }) => (
    <div
        className={`${styles.menuItem} ${active ? styles.active : ''}`}
        onClick={onClick}
        role="menuitem"
        tabIndex={0}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
            }
        }}
    >
        <span className={styles.name}>{name}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
    </div>
)

TrackedEntityMenuItem.propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool,
    subtitle: PropTypes.string,
}

export { TrackedEntityMenuItem }

