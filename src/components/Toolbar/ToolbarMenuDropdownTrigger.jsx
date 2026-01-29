import { IconChevronDown16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './ToolbarMenuDropdownTrigger.module.css'

export const ToolbarMenuDropdownTrigger = ({
    icon,
    label,
    onClick,
    open,
    dataTest,
    className,
}) => {
    const triggerClassName = className
        ? `${styles.trigger} ${className}`
        : styles.trigger

    return (
        <button
            type="button"
            className={triggerClassName}
            onClick={onClick}
            data-test={dataTest}
            aria-expanded={open}
        >
            {icon && <span className={styles.icon}>{icon}</span>}
            <span className={styles.label}>{label}</span>
            <span className={styles.chevron}>
                <IconChevronDown16 />
            </span>
        </button>
    )
}

ToolbarMenuDropdownTrigger.propTypes = {
    icon: PropTypes.node,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    open: PropTypes.bool,
    dataTest: PropTypes.string,
    className: PropTypes.string,
}
