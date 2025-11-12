import i18n from '@dhis2/d2-i18n'
import {
    FlyoutMenu,
    MenuItem,
    IconVisualizationLinelist16,
    Popper,
    Layer,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { ToolbarMenuDropdownTrigger } from './ToolbarMenuDropdownTrigger.jsx'
import styles from './ToolbarMenuDropdownTrigger.module.css'

const VISUALIZATION_TYPES = [
    { value: 'LINE_LIST', label: i18n.t('Line List') },
    { value: 'PIVOT_TABLE', label: i18n.t('Pivot Table') },
]

const VisualizationTypeSelect = ({ selected, onChange, dataTest }) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const anchorRef = useRef(null)
    const selectedValue = selected || 'LINE_LIST'
    const selectedLabel =
        VISUALIZATION_TYPES.find((type) => type.value === selectedValue)
            ?.label || i18n.t('Line List')

    const handleMenuItemClick = (value) => {
        if (onChange) {
            onChange({ selected: value })
        }
        setMenuOpen(false)
    }

    return (
        <>
            <div ref={anchorRef} className={styles.wrapper}>
                <ToolbarMenuDropdownTrigger
                    icon={<IconVisualizationLinelist16 color="#6C7787" />}
                    label={selectedLabel}
                    onClick={() => setMenuOpen(!menuOpen)}
                    dataTest={dataTest}
                    open={menuOpen}
                />
            </div>
            {menuOpen && (
                <Layer onBackdropClick={() => setMenuOpen(false)}>
                    <Popper reference={anchorRef} placement="bottom-start">
                        <FlyoutMenu dense>
                            {VISUALIZATION_TYPES.map(({ value, label }) => (
                                <MenuItem
                                    key={value}
                                    label={label}
                                    onClick={() => handleMenuItemClick(value)}
                                    active={value === selectedValue}
                                />
                            ))}
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
        </>
    )
}

VisualizationTypeSelect.propTypes = {
    selected: PropTypes.string,
    onChange: PropTypes.func,
    dataTest: PropTypes.string,
}

export { VisualizationTypeSelect }
