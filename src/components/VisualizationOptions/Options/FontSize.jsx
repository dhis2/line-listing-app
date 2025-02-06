import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    OPTION_FONT_SIZE,
    FONT_SIZE_LARGE,
    FONT_SIZE_NORMAL,
    FONT_SIZE_SMALL,
} from '../../../modules/options.js'
import SelectBaseOption from './SelectBaseOption.jsx'

const FontSize = () => (
    <SelectBaseOption
        label={i18n.t('Font size')}
        option={{
            name: OPTION_FONT_SIZE,
            items: [
                { value: FONT_SIZE_LARGE, label: i18n.t('Large') },
                { value: FONT_SIZE_NORMAL, label: i18n.t('Normal') },
                { value: FONT_SIZE_SMALL, label: i18n.t('Small') },
            ],
        }}
        dataTest="font-size"
    />
)

export default FontSize
