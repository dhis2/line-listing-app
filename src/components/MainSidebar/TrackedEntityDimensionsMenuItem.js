import i18n from '@dhis2/d2-i18n'
import { IconFolder16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { MenuItem } from './MenuItem/index.js'

export const TrackedEntityDimensionsMenuItem = ({
    selected,
    count,
    onClick,
    name,
}) => (
    <MenuItem
        icon={<IconFolder16 />}
        label={i18n.t(`{{- itemName}} dimensions`, {
            itemName: name,
        })}
        onClick={onClick}
        selected={selected}
        count={count}
        dataTest="tracked-entity-button"
    />
)

TrackedEntityDimensionsMenuItem.propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    count: PropTypes.number,
    selected: PropTypes.bool,
}
