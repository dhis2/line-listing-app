import { Tooltip, colors, spacers } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

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
            className={cx('button', { selected })}
            disabled={disabled}
        >
            {count && count}
            <Icon color={selected ? colors.teal500 : colors.grey700} />
        </button>
        <style jsx>{`
            .button {
                all: unset;
                cursor: pointer;
                display: inline-flex;
                flex-direction: row;
                gap: ${spacers.dp4};
                align-items: center;
                font-size: 12px;
                line-height: 14px;
                color: ${colors.grey700};
            }

            .button.selected {
                color: ${colors.teal600};
                font-weight: 500;
            }
        `}</style>
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
