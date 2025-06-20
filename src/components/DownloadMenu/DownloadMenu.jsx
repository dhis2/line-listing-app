import { HoverMenuList, HoverMenuListItem } from '@dhis2/analytics'
import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { FlyoutMenu, MenuItem, MenuSectionHeader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    DOWNLOAD_TYPE_TABLE,
    FILE_FORMAT_HTML_CSS,
    FILE_FORMAT_CSV,
    FILE_FORMAT_XLS,
    FILE_FORMAT_XLSX,
    FILE_FORMAT_JSON,
    FILE_FORMAT_XML,
} from './constants.js'
import { PlainDataSourceSubMenu } from './PlainDataSourceSubMenu.jsx'

const DownloadMenu = ({ download, hoverable }) => {
    const config = useConfig()
    const MenuComponent = hoverable ? HoverMenuList : FlyoutMenu
    const MenuItemComponent = hoverable ? HoverMenuListItem : MenuItem

    return (
        <MenuComponent>
            <MenuSectionHeader
                label={i18n.t('HTML')}
                hideDivider
                dense={hoverable}
            />
            <MenuItemComponent
                label={i18n.t('HTML+CSS (.html+css)')}
                onClick={() =>
                    download(DOWNLOAD_TYPE_TABLE, FILE_FORMAT_HTML_CSS)
                }
                className="push-analytics-download-as-html-css-menu-item"
            />
            <MenuSectionHeader
                label={i18n.t('Plain data source')}
                dense={hoverable}
            />
            <PlainDataSourceSubMenu
                hoverable={hoverable}
                download={download}
                label={i18n.t('JSON')}
                format={FILE_FORMAT_JSON}
            />
            <PlainDataSourceSubMenu
                hoverable={hoverable}
                download={download}
                label={i18n.t('XML')}
                format={FILE_FORMAT_XML}
            />
            <PlainDataSourceSubMenu
                hoverable={hoverable}
                download={download}
                label={i18n.t('Microsoft Excel')}
                format={
                    // VERSION-TOGGLE: remove when 42 is lowest supported version
                    config.serverVersion.minor >= 42
                        ? FILE_FORMAT_XLSX
                        : FILE_FORMAT_XLS
                }
            />
            <PlainDataSourceSubMenu
                hoverable={hoverable}
                download={download}
                label={i18n.t('CSV')}
                format={FILE_FORMAT_CSV}
            />
        </MenuComponent>
    )
}

DownloadMenu.propTypes = {
    download: PropTypes.func.isRequired,
    hoverable: PropTypes.bool,
}

export { DownloadMenu }
