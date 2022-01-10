import { Radio } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './InputOption.module.css'

const InputOption = ({ header, description, onClick, selected }) => (
    <div
        className={cx(styles.container, { [styles.selected]: selected })}
        onClick={onClick}
    >
        <Radio checked={selected} />
        <div className={styles.label}>
            <div className={styles.header}>{header}</div>
            <div className={styles.description}>{description}</div>
        </div>
    </div>
)

InputOption.propTypes = {
    description: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
}

export { InputOption }
