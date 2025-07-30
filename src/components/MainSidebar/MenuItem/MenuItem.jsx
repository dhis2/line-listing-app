import { IconChevronRight16 } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './MenuItem.module.css'

const MenuItem = ({
    icon,
    label,
    count,
    onClick,
    disabled,
    selected,
    dataTest,
    subtitle,
}) => (
    <div
        className={cx(styles.container, {
            [styles.selected]: selected,
            [styles.disabled]: disabled,
        })}
        onClick={!disabled ? onClick : null}
        tabIndex="0"
        data-test={dataTest}
    >
        <div className={styles.icon}>{icon}</div>
        <div className={styles.labelWrapper}>
            <span className={styles.label}>{label}</span>
            {subtitle && (
                <span
                    className={styles.subtitle}
                    data-test={`${dataTest}-subtitle`}
                >
                    {subtitle}
                </span>
            )}
        </div>
        {typeof count === 'number' && (
            <div
                className={cx(styles.count, {
                    [styles.dashed]: disabled,
                })}
            >
                {count}
            </div>
        )}
        <div className={styles.chevron}>
            <IconChevronRight16 />
        </div>
    </div>
)

MenuItem.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    count: PropTypes.number,
    dataTest: PropTypes.string,
    disabled: PropTypes.bool,
    selected: PropTypes.bool,
    subtitle: PropTypes.string,
}

export { MenuItem }
