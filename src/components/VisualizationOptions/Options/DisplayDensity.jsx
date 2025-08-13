import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    DISPLAY_DENSITY_COMFORTABLE,
    DISPLAY_DENSITY_NORMAL,
    DISPLAY_DENSITY_COMPACT,
    OPTION_DISPLAY_DENSITY,
} from '../../../modules/options.js'
import { default as SelectBaseOption } from './SelectBaseOption.jsx'

const DisplayDensity = () => (
    <SelectBaseOption
        label={i18n.t('Display density')}
        option={{
            name: OPTION_DISPLAY_DENSITY,
            items: [
                {
                    value: DISPLAY_DENSITY_COMFORTABLE,
                    label: i18n.t('Comfortable'),
                },
                { value: DISPLAY_DENSITY_NORMAL, label: i18n.t('Normal') },
                { value: DISPLAY_DENSITY_COMPACT, label: i18n.t('Compact') },
            ],
        }}
        dataTest="display-density"
    />
)

export default DisplayDensity
