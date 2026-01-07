import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './CardSection.module.css'

const ChevronDown = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 12 12"
        width="12"
        height="12"
        fill="currentColor"
    >
        <path d="M6 8.825c-.2 0-.4-.1-.5-.2l-3.3-3.3c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0l2.7 2.7 2.7-2.7c.3-.3.8-.3 1.1 0 .3.3.3.8 0 1.1l-3.2 3.2c-.2.2-.4.3-.6.3Z" />
    </svg>
)

const ChevronRight = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 12 12"
        width="12"
        height="12"
        fill="currentColor"
        style={{ transform: 'rotate(-90deg)' }}
    >
        <path d="M6 8.825c-.2 0-.4-.1-.5-.2l-3.3-3.3c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0l2.7 2.7 2.7-2.7c.3-.3.8-.3 1.1 0 .3.3.3.8 0 1.1l-3.2 3.2c-.2.2-.4.3-.6.3Z" />
    </svg>
)

const CardSection = ({
    icon,
    label,
    count,
    onClick,
    disabled,
    expanded,
    dataTest,
    subtitle,
    children,
    isEmpty,
    nested,
}) => (
    <div
        className={cx(styles.card, {
            [styles.expanded]: expanded,
            [styles.disabled]: disabled,
            [styles.empty]: isEmpty,
            [styles.nested]: nested,
        })}
        data-test={dataTest}
        onClick={!disabled ? onClick : null}
        tabIndex="0"
    >
        <div
            className={cx(styles.header, {
                [styles.expanded]: expanded,
                [styles.disabled]: disabled,
            })}
            data-test={`${dataTest}-header`}
        >
            <div className={styles.labelWrapper}>
                <div className={styles.labelRow}>
                    <div className={styles.chevron}>
                        {expanded ? <ChevronDown /> : <ChevronRight />}
                    </div>
                    <span className={styles.label}>{label}</span>
                </div>
                {subtitle && (
                    <span
                        className={styles.subtitle}
                        data-test={`${dataTest}-subtitle`}
                    >
                        {subtitle}
                    </span>
                )}
            </div>
            {typeof count === 'number' && count > 0 && (
                <div
                    className={cx(styles.count, {
                        [styles.dashed]: disabled,
                    })}
                >
                    {count}
                </div>
            )}
        </div>
        {expanded && !disabled && (
            <div 
                className={styles.content} 
                data-test={`${dataTest}-content`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        )}
    </div>
)

CardSection.propTypes = {
    children: PropTypes.node,
    count: PropTypes.number,
    dataTest: PropTypes.string,
    disabled: PropTypes.bool,
    expanded: PropTypes.bool,
    icon: PropTypes.node,
    label: PropTypes.string.isRequired,
    nested: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    subtitle: PropTypes.string,
    isEmpty: PropTypes.bool,
}

export { CardSection }

