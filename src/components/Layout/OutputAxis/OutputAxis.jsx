import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { tSetUiOutput } from '../../../actions/ui.js'
import { AXIS_ID_OUTPUT } from '../../../modules/axis.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../../../modules/programTypes.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'
import {
    sGetUiDataSourceType,
    sGetUiDataSourceProgramType,
    sGetUiOutputType,
} from '../../../reducers/ui.js'
import styles from '../DefaultLayout/styles/DefaultAxis.module.css'

const getOutputOptions = (dataSourceType, programType) => {
    const options = []

    if (dataSourceType === 'TRACKED_ENTITY_TYPE') {
        // Tracked entity types only support tracked entity output
        options.push({
            value: OUTPUT_TYPE_TRACKED_ENTITY,
            label: i18n.t('Tracked entities'),
        })
    } else if (dataSourceType === 'PROGRAM') {
        if (programType === PROGRAM_TYPE_WITH_REGISTRATION) {
            // Tracker programs support all three output types
            options.push({
                value: OUTPUT_TYPE_EVENT,
                label: i18n.t('Events'),
            })
            options.push({
                value: OUTPUT_TYPE_ENROLLMENT,
                label: i18n.t('Enrollments'),
            })
            options.push({
                value: OUTPUT_TYPE_TRACKED_ENTITY,
                label: i18n.t('Tracked entities'),
            })
        } else {
            // Event programs only support event output
            options.push({
                value: OUTPUT_TYPE_EVENT,
                label: i18n.t('Events'),
            })
        }
    }

    return options
}

const OutputAxis = ({ className }) => {
    const dispatch = useDispatch()
    const dataSourceType = useSelector(sGetUiDataSourceType)
    const programType = useSelector(sGetUiDataSourceProgramType)
    const selectedOutput = useSelector(sGetUiOutputType)

    const outputOptions = getOutputOptions(dataSourceType, programType)

    // Auto-select first option if current selection is not valid
    useEffect(() => {
        if (outputOptions.length > 0) {
            const isCurrentValid = outputOptions.some(
                (opt) => opt.value === selectedOutput
            )
            if (!isCurrentValid) {
                dispatch(tSetUiOutput(outputOptions[0].value))
            }
        }
    }, [dataSourceType, programType, outputOptions, selectedOutput, dispatch])

    const handleOutputChange = ({ selected }) => {
        dispatch(tSetUiOutput(selected))
    }

    // Don't render if no data source is selected
    if (!dataSourceType || outputOptions.length === 0) {
        return null
    }

    return (
        <div
            id={AXIS_ID_OUTPUT}
            className={cx(styles.axisContainer, className)}
        >
            <div className={styles.label}>
                <span>{i18n.t('Output')}</span>
            </div>
            <div className={styles.content} data-test="output-axis">
                <SingleSelect
                    dense
                    selected={selectedOutput}
                    onChange={handleOutputChange}
                    placeholder={i18n.t('Select output type')}
                    dataTest="output-select"
                    disabled={outputOptions.length === 1}
                >
                    {outputOptions.map(({ value, label }) => (
                        <SingleSelectOption
                            key={value}
                            label={label}
                            value={value}
                        />
                    ))}
                </SingleSelect>
            </div>
        </div>
    )
}

OutputAxis.propTypes = {
    className: PropTypes.string,
}

export default OutputAxis
