import { IconChevronDown16, IconChevronRight16, IconMore16 } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './CardSection.module.css'

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
}) => (
    <div
        className={cx(styles.card, {
            [styles.expanded]: expanded,
            [styles.disabled]: disabled,
            [styles.empty]: isEmpty,
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
                        {expanded ? <IconChevronDown16 /> : <IconChevronRight16 />}
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
        {!expanded && !disabled && (
            <div className={styles.moreRow}>
                <div className={styles.moreIcon}>
                    <IconMore16 />
                </div>
            </div>
        )}
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
    onClick: PropTypes.func.isRequired,
    subtitle: PropTypes.string,
    isEmpty: PropTypes.bool,
}

export { CardSection }

