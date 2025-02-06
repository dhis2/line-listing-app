import { Tag } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './SingleSelectOptionWithSuffix.module.css'

export const SingleSelectOptionWithSuffix = ({
    label,
    active,
    disabled,
    onClick,
    value,
    dataTest,
    suffix,
}) => (
    <div
        className={cx(styles.option, {
            [styles.disabled]: disabled,
            [styles.active]: active,
        })}
        onClick={(e) => onClick({}, e)}
        data-value={value}
        data-label={label}
        data-test={dataTest}
    >
        {label}
        {suffix && <Tag className={styles.tag}>{suffix.toString()}</Tag>}
    </div>
)

SingleSelectOptionWithSuffix.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    active: PropTypes.bool,
    dataTest: PropTypes.string,
    disabled: PropTypes.bool,
    suffix: PropTypes.number,
    onClick: PropTypes.func,
}
