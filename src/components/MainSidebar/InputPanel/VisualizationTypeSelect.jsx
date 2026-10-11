import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption, IconVisualizationLinelist16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const VISUALIZATION_TYPES = [
    { value: 'LINE_LIST', label: i18n.t('Line List') },
    { value: 'PIVOT_TABLE', label: i18n.t('Pivot Table') },
]

const VisualizationTypeSelect = ({ selected, onChange, dataTest }) => {
    return (
        <SingleSelect
            dense
            selected={selected || 'LINE_LIST'}
            onChange={onChange}
            dataTest={dataTest}
            prefix={<IconVisualizationLinelist16 />}
        >
            {VISUALIZATION_TYPES.map(({ value, label }) => (
                <SingleSelectOption
                    key={value}
                    label={label}
                    value={value}
                />
            ))}
        </SingleSelect>
    )
}

VisualizationTypeSelect.propTypes = {
    selected: PropTypes.string,
    onChange: PropTypes.func,
    dataTest: PropTypes.string,
}

export { VisualizationTypeSelect }
