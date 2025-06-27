import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { tSetUiInput } from '../../../actions/ui.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'
import { sGetUiInput } from '../../../reducers/ui.js'
import { ProgramSelect } from '../ProgramDimensionsPanel/ProgramSelect.jsx'
import { TypeSelect } from '../ProgramDimensionsPanel/TypeSelect.jsx'
import { InputOption } from './InputOption.jsx'
import styles from './InputPanel.module.css'

export const getLabelForInputType = (type) => {
    switch (type) {
        case OUTPUT_TYPE_EVENT:
            return i18n.t('Event')
        case OUTPUT_TYPE_ENROLLMENT:
            return i18n.t('Enrollment')
        case OUTPUT_TYPE_TRACKED_ENTITY:
            return i18n.t('Tracked entity')
        default:
            throw new Error('No input type specified')
    }
}

export const InputPanel = ({ visible }) => {
    const dispatch = useDispatch()
    const { serverVersion } = useConfig()
    const selectedInput = useSelector(sGetUiInput)?.type

    if (!visible) {
        return null
    }

    const setSelectedInput = (input) => {
        if (selectedInput !== input) {
            dispatch(tSetUiInput({ type: input }))
        }
    }

    return (
        <div className={styles.container} data-test="input-panel">
            <InputOption
                dataTest="input-event"
                header={getLabelForInputType(OUTPUT_TYPE_EVENT)}
                description={i18n.t(
                    'See individual event data from a Tracker program stage or event program.'
                )}
                onClick={() => setSelectedInput(OUTPUT_TYPE_EVENT)}
                selected={selectedInput === OUTPUT_TYPE_EVENT}
            >
                {selectedInput === OUTPUT_TYPE_EVENT && <ProgramSelect />}
            </InputOption>
            <InputOption
                dataTest="input-enrollment"
                header={getLabelForInputType(OUTPUT_TYPE_ENROLLMENT)}
                description={i18n.t(
                    'See data from multiple program stages in a Tracker program.'
                )}
                onClick={() => setSelectedInput(OUTPUT_TYPE_ENROLLMENT)}
                selected={selectedInput === OUTPUT_TYPE_ENROLLMENT}
            >
                {selectedInput === OUTPUT_TYPE_ENROLLMENT && <ProgramSelect />}
            </InputOption>
            {`${serverVersion.major}.${serverVersion.minor}.${
                serverVersion.patch || 0
            }` >= '2.41.0' && (
                <InputOption
                    dataTest="input-tracked-entity"
                    header={getLabelForInputType(OUTPUT_TYPE_TRACKED_ENTITY)}
                    description={i18n.t(
                        'See individual tracked entities from one or more Tracker programs.'
                    )}
                    onClick={() => setSelectedInput(OUTPUT_TYPE_TRACKED_ENTITY)}
                    selected={selectedInput === OUTPUT_TYPE_TRACKED_ENTITY}
                >
                    {selectedInput === OUTPUT_TYPE_TRACKED_ENTITY && (
                        <TypeSelect />
                    )}
                </InputOption>
            )}
        </div>
    )
}

InputPanel.propTypes = {
    visible: PropTypes.bool.isRequired,
}
