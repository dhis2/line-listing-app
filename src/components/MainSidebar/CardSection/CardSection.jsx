import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './CardSection.module.css'

const ChevronDown = () => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M3.37575 4.75194C3.18135 4.41861 3.42175 4 3.80765 4L8.19163 4C8.57753 4 8.81796 4.41861 8.62352 4.75194L6.43154 8.5096C6.2386 8.8404 5.7607 8.8404 5.56776 8.5096L3.37575 4.75194Z"
            fill="currentColor"
        />
    </svg>
)

const ChevronRight = () => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M5.00194 8.62401C4.66861 8.81841 4.25 8.57801 4.25 8.19211V3.80813C4.25 3.42223 4.66861 3.1818 5.00194 3.37624L8.7596 5.56822C9.0904 5.76116 9.0904 6.23906 8.7596 6.432L5.00194 8.62401Z"
            fill="currentColor"
        />
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
                [styles.hasSelections]: count > 0,
            })}
            data-test={`${dataTest}-header`}
        >
            <div className={styles.labelWrapper}>
                <div className={styles.labelRow}>
                    <div className={styles.chevron}>
                        {expanded ? <ChevronDown /> : <ChevronRight />}
                    </div>
                    <span
                        className={cx(styles.label, {
                            [styles.hasSelections]: count > 0,
                        })}
                    >
                        {label}
                    </span>
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
        {!disabled && (
            <div
                className={cx(styles.content, {
                    [styles.collapsed]: !expanded,
                })}
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
