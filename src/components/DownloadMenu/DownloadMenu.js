import i18n from '@dhis2/d2-i18n'
import { FlyoutMenu, MenuItem, MenuSectionHeader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    DOWNLOAD_TYPE_TABLE,
    FILE_FORMAT_HTML_CSS,
    FILE_FORMAT_CSV,
    FILE_FORMAT_XLS,
    FILE_FORMAT_JSON,
    FILE_FORMAT_XML,
} from './constants.js'
import { PlainDataSourceSubMenu } from './PlainDataSourceSubMenu.js'

const DownloadMenu = ({ download }) => (
    <FlyoutMenu>
        <MenuSectionHeader label={i18n.t('HTML')} />
        <MenuItem
            label={i18n.t('HTML+CSS (.html+css)')}
            onClick={() => download(DOWNLOAD_TYPE_TABLE, FILE_FORMAT_HTML_CSS)}
        />
        <MenuSectionHeader label={i18n.t('Plain data source')} />
        <PlainDataSourceSubMenu
            download={download}
            label={i18n.t('JSON')}
            format={FILE_FORMAT_JSON}
        />
        <PlainDataSourceSubMenu
            download={download}
            label={i18n.t('XML')}
            format={FILE_FORMAT_XML}
        />
        <PlainDataSourceSubMenu
            download={download}
            label={i18n.t('Microsoft Excel')}
            format={FILE_FORMAT_XLS}
        />
        <PlainDataSourceSubMenu
            download={download}
            label={i18n.t('CSV')}
            format={FILE_FORMAT_CSV}
        />
    </FlyoutMenu>
)

DownloadMenu.propTypes = {
    download: PropTypes.func.isRequired,
}

export { DownloadMenu }
