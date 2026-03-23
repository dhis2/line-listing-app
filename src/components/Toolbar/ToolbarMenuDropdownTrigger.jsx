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
    showChevron = true,
    disabled = false,
}) => {
    const triggerClassName = [
        styles.trigger,
        className,
        disabled && styles.disabled,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <button
            type="button"
            className={triggerClassName}
            onClick={onClick}
            data-test={dataTest}
            aria-expanded={open}
            disabled={disabled}
        >
            {icon && <span className={styles.icon}>{icon}</span>}
            {label && <span className={styles.label}>{label}</span>}
            {showChevron && (
                <span className={styles.chevron}>
                    <IconChevronDown16 />
                </span>
            )}
        </button>
    )
}

ToolbarMenuDropdownTrigger.propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.node,
    label: PropTypes.string,
    open: PropTypes.bool,
    dataTest: PropTypes.string,
    className: PropTypes.string,
    showChevron: PropTypes.bool,
    disabled: PropTypes.bool,
}
