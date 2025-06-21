import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { OPTION_SHOW_LEGEND_KEY } from '../../../modules/options.js'
import CheckboxBaseOption from './CheckboxBaseOption.jsx'

const ShowLegendKey = () => (
    <CheckboxBaseOption
        label={i18n.t('Show legend key')}
        option={{
            name: OPTION_SHOW_LEGEND_KEY,
        }}
        dataTest="option-legend-key"
    />
)

export default ShowLegendKey
