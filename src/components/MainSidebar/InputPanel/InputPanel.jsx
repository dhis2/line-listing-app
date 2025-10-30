import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'
import { sGetUiInput, sGetUiSplitDataCards } from '../../../reducers/ui.js'
import { ProgramSelect } from '../ProgramDimensionsPanel/ProgramSelect.jsx'
import { InputTypeWithSubmenuSelect } from './InputTypeWithSubmenuSelect.jsx'
import { VisualizationTypeSelect } from './VisualizationTypeSelect.jsx'
import styles from './InputPanel.module.css'

export const getLabelForInputType = (type) => {
    switch (type) {
        case OUTPUT_TYPE_EVENT:
            return i18n.t('Events')
        case OUTPUT_TYPE_ENROLLMENT:
            return i18n.t('Enrollments')
        case OUTPUT_TYPE_TRACKED_ENTITY:
            return i18n.t('Tracked entity')
        default:
            throw new Error('No input type specified')
    }
}

export const InputPanel = ({ visible }) => {
    const { serverVersion } = useConfig()
    const selectedInput = useSelector(sGetUiInput)?.type
    const splitDataCards = useSelector(sGetUiSplitDataCards)

    if (!visible) {
        return null
    }

    const renderConditionalDropdowns = () => {
        if (!selectedInput) {
            return null
        }

        switch (selectedInput) {
            case OUTPUT_TYPE_EVENT:
                return <ProgramSelect noBorders={true} />
            case OUTPUT_TYPE_ENROLLMENT:
                return <ProgramSelect noBorders={true} />
            case OUTPUT_TYPE_TRACKED_ENTITY:
                // Show program selection in InputPanel only when in split data cards mode
                return splitDataCards ? (
                    <ProgramSelect noBorders={true} />
                ) : null
            default:
                return null
        }
    }

    return (
        <div className={styles.container} data-test="input-panel">
            <div className={styles.section}>
                <div className={styles.row}>
                    <div className={styles.dropdownWrapper}>
                        <VisualizationTypeSelect dataTest="visualization-type-select" />
                    </div>
                    <div className={styles.dropdownWrapper}>
                        <InputTypeWithSubmenuSelect
                            serverVersion={serverVersion}
                        />
                    </div>
                </div>
            </div>
            {renderConditionalDropdowns()}
        </div>
    )
}

InputPanel.propTypes = {
    visible: PropTypes.bool.isRequired,
}
