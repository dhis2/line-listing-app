import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tSetUiInput } from '../../../actions/ui.js'
import {
    OUTPUT_TYPE_EVENT,
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'
import { sGetUiInput } from '../../../reducers/ui.js'

const inputTypeOptions = [
    {
        value: OUTPUT_TYPE_EVENT,
        label: i18n.t('Events'),
        description: i18n.t(
            'See individual event data from a Tracker program stage or event program.'
        ),
    },
    {
        value: OUTPUT_TYPE_ENROLLMENT,
        label: i18n.t('Enrollment'),
        description: i18n.t(
            'See data from multiple program stages in a Tracker program.'
        ),
    },
    {
        value: OUTPUT_TYPE_TRACKED_ENTITY,
        label: i18n.t('Tracked entity'),
        description: i18n.t(
            'See individual tracked entities from one or more Tracker programs.'
        ),
    },
]

const InputTypeSelect = ({ serverVersion }) => {
    const dispatch = useDispatch()
    const selectedInput = useSelector(sGetUiInput)?.type

    const setSelectedInput = (inputType) => {
        if (selectedInput !== inputType) {
            dispatch(tSetUiInput({ type: inputType }))
        }
    }

    // Filter options based on server version
    const availableOptions = inputTypeOptions.filter((option) => {
        if (option.value === OUTPUT_TYPE_TRACKED_ENTITY) {
            return (
                `${serverVersion.major}.${serverVersion.minor}.${
                    serverVersion.patch || 0
                }` >= '2.41.0'
            )
        }
        return true
    })

    return (
        <SingleSelect
            dense
            selected={selectedInput || ''}
            onChange={({ selected }) => setSelectedInput(selected)}
            placeholder={i18n.t('Choose input type')}
            dataTest="input-type-select"
            filterable
            noMatchText={i18n.t('No input types found')}
        >
            {availableOptions.map(({ value, label }) => (
                <SingleSelectOption key={value} label={label} value={value} />
            ))}
        </SingleSelect>
    )
}

InputTypeSelect.propTypes = {
    serverVersion: PropTypes.shape({
        major: PropTypes.number.isRequired,
        minor: PropTypes.number.isRequired,
        patch: PropTypes.number,
    }).isRequired,
}

export { InputTypeSelect }
