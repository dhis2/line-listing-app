import { Radio } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './InputOption.module.css'

const InputOption = ({
    header,
    description,
    onClick,
    selected,
    dataTest,
    children,
}) => (
    <div
        className={cx(styles.container, { [styles.selected]: selected })}
        onClick={onClick}
        data-test={dataTest}
    >
        <div className={styles.label}>
            <div className={styles.header}>
                <Radio dense checked={selected} />
                <span>{header}</span>
            </div>
            <div className={styles.description}>{description}</div>
            {children}
        </div>
    </div>
)

InputOption.propTypes = {
    description: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node,
    dataTest: PropTypes.string,
}

export { InputOption }
