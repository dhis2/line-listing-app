import { Tooltip, colors } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/MessageIconButton.module.css'

const MessageIconButton = ({
    tooltipContent,
    disabled,
    onClick,
    selected,
    count,
    iconComponent: Icon,
}) => (
    <Tooltip closeDelay={200} content={tooltipContent}>
        <button
            onClick={onClick}
            className={cx(styles.actionButton, {
                [styles.selected]: selected,
            })}
            disabled={disabled}
        >
            {count && count}
            <Icon color={selected ? colors.teal500 : colors.grey700} />
        </button>
    </Tooltip>
)

MessageIconButton.propTypes = {
    iconComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
        .isRequired,
    tooltipContent: PropTypes.string.isRequired,
    count: PropTypes.number,
    disabled: PropTypes.bool,
    selected: PropTypes.bool,
    onClick: PropTypes.func,
}

export { MessageIconButton }
