import { HoverMenuListItem } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { MenuItem, MenuSectionHeader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    DOWNLOAD_TYPE_PLAIN,
    ID_SCHEME_UID,
    ID_SCHEME_CODE,
    ID_SCHEME_NAME,
} from './constants.js'

export const PlainDataSourceSubMenu = ({
    download,
    hoverable,
    format,
    label,
    ...menuItemProps
}) => {
    const MenuItemComponent = hoverable ? HoverMenuListItem : MenuItem

    return (
        <MenuItemComponent label={label} {...menuItemProps}>
            <MenuSectionHeader
                label={i18n.t('Metadata ID scheme')}
                hideDivider
                dense={hoverable}
            />
            <MenuItemComponent
                label={i18n.t('ID')}
                onClick={() =>
                    download(DOWNLOAD_TYPE_PLAIN, format, ID_SCHEME_UID)
                }
            />
            <MenuItemComponent
                label={i18n.t('Code')}
                onClick={() =>
                    download(DOWNLOAD_TYPE_PLAIN, format, ID_SCHEME_CODE)
                }
            />
            <MenuItemComponent
                label={i18n.t('Name')}
                onClick={() =>
                    download(DOWNLOAD_TYPE_PLAIN, format, ID_SCHEME_NAME)
                }
            />
        </MenuItemComponent>
    )
}

PlainDataSourceSubMenu.propTypes = {
    download: PropTypes.func.isRequired,
    format: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    hoverable: PropTypes.bool,
}
