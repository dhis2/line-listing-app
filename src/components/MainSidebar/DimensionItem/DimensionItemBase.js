import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { DimensionIcon } from './DimensionIcon.js'
import styles from './DimensionItemBase.module.css'

// Presentational component used by dnd - do not add redux or dnd functionality

const DimensionItemBase = ({
    dragging,
    name,
    dimensionType,
    selected,
    disabled,
    stageName,
    contextMenu,
    onClick,
}) => (
    <div
        className={cx(styles.dimensionItem, {
            [styles.selected]: selected,
            [styles.disabled]: disabled,
            [styles.dragging]: dragging,
        })}
    >
        <div className={styles.iconAndLabelWrapper} onClick={onClick}>
            <div className={styles.icon}>
                <DimensionIcon dimensionType={dimensionType} />
            </div>

            <div className={styles.label}>
                <span className={styles.primary}>{name}</span>
                {stageName && (
                    <span className={styles.secondary}>{stageName}</span>
                )}
            </div>
        </div>

        {contextMenu && contextMenu}
    </div>
)

DimensionItemBase.propTypes = {
    name: PropTypes.string.isRequired,
    contextMenu: PropTypes.node,
    dimensionType: PropTypes.string,
    disabled: PropTypes.bool,
    dragging: PropTypes.bool,
    selected: PropTypes.bool,
    stageName: PropTypes.string,
    onClick: PropTypes.func,
}

export { DimensionItemBase }
