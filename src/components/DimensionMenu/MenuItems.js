import {
    AXIS_ID_COLUMNS,
    AXIS_ID_FILTERS,
    AXIS_ID_ROWS,
    VIS_TYPE_LINE_LIST,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { MenuDivider, FlyoutMenu, MenuItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { getAxisName } from '../../modules/axis.js'

const getAxisItemLabel = (axisName, isDimensionInLayout) =>
    isDimensionInLayout
        ? i18n.t('Move to {{axisName}}', { axisName })
        : i18n.t('Add to {{axisName}}', { axisName })

const getDividerItem = (key) => <MenuDivider dense key={key} />

const MenuItems = ({
    dimensionId,
    currentAxisId,
    visType,
    axisItemHandler,
    removeItemHandler,
    onClose,
    dataTest,
}) => {
    const menuItems = []

    const isDimensionInLayout = !!currentAxisId

    // add/move to axis item
    const availableAxisIds =
        visType === VIS_TYPE_LINE_LIST
            ? [AXIS_ID_COLUMNS, AXIS_ID_FILTERS]
            : [AXIS_ID_COLUMNS, AXIS_ID_ROWS, AXIS_ID_FILTERS]

    const applicableAxisIds = availableAxisIds.filter(
        (axisId) => axisId !== currentAxisId
    )

    const getRemoveMenuItem = (onClick) => (
        <MenuItem
            key="remove-menu-item"
            onClick={onClick}
            label={i18n.t('Remove')}
            dataTest={`${dataTest}-item-remove-${dimensionId}`}
        />
    )

    menuItems.push(
        ...applicableAxisIds.map((axisId) => (
            <MenuItem
                key={`${dimensionId}-to-${axisId}`}
                onClick={() => {
                    axisItemHandler({
                        dimensionId,
                        axisId,
                    })
                    onClose()
                }}
                label={getAxisItemLabel(
                    getAxisName(axisId),
                    isDimensionInLayout
                )}
                dataTest={`${dataTest}-item-action-${dimensionId}-to-${axisId}`}
            />
        ))
    )

    // remove item
    if (isDimensionInLayout) {
        // divider
        if (applicableAxisIds.length) {
            menuItems.push(getDividerItem('remove-item-divider'))
        }

        menuItems.push(
            getRemoveMenuItem(() => {
                removeItemHandler(dimensionId)
                onClose()
            })
        )
    }

    return (
        <FlyoutMenu dense dataTest={dataTest}>
            {menuItems}
        </FlyoutMenu>
    )
}

MenuItems.propTypes = {
    axisItemHandler: PropTypes.func.isRequired,
    removeItemHandler: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    currentAxisId: PropTypes.string,
    dataTest: PropTypes.string,
    dimensionId: PropTypes.string,
    visType: PropTypes.string,
}

export default MenuItems
