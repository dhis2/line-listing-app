import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption, Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { sGetUiInputType } from '../../../reducers/ui.js'
import { INPUT_TYPES } from '../InputPanel/index.js'
import styles from './ProgramDimensionsFilter.module.css'

const TYPES = {
    ALL: 'ALL',
    DATA_ELEMENT: 'DATA_ELEMENT',
    PROGRAM_ATTRIBUTE: 'PROGRAM_ATTRIBUTE',
    PROGRAM_INDICATOR: 'PROGRAM_INDICATOR',
}
const STAGE_ALL = 'STAGE_ALL'

const ProgramDimensionsFilter = ({ program }) => {
    const inputType = useSelector(sGetUiInputType)
    const { programType, programStages } = program
    const hideStageSelect =
        inputType === INPUT_TYPES.EVENT &&
        programType === 'WITHOUT_REGISTRATION'
    const requireStageSelection =
        inputType === INPUT_TYPES.EVENT && programType === 'WITH_REGISTRATION'
    const [searchTerm, setSearchTerm] = useState('')
    const [type, setType] = useState(TYPES.ALL)
    const [stage, setStage] = useState(
        requireStageSelection ? undefined : STAGE_ALL
    )

    return (
        <div className={styles.container}>
            <Input
                value={searchTerm}
                onChange={({ value }) => setSearchTerm(value)}
                dense
                placeholder={i18n.t('Search in program')}
            />
            <SingleSelect
                prefix={i18n.t('Type')}
                selected={type}
                onChange={({ selected }) => setType(selected)}
                dense
            >
                <SingleSelectOption label={i18n.t('All')} value={TYPES.ALL} />
                <SingleSelectOption
                    label={i18n.t('Data element')}
                    value={TYPES.DATA_ELEMENT}
                />
                <SingleSelectOption
                    label={i18n.t('Program attribute')}
                    value={TYPES.PROGRAM_ATTRIBUTE}
                />
                <SingleSelectOption
                    label={i18n.t('Program indicator')}
                    value={TYPES.PROGRAM_INDICATOR}
                />
            </SingleSelect>
            {!hideStageSelect && (
                <SingleSelect
                    prefix={i18n.t('Stage')}
                    dense
                    selected={stage}
                    onChange={({ selected }) => setStage(selected)}
                >
                    {!requireStageSelection && (
                        <SingleSelectOption
                            label={i18n.t('All')}
                            value={STAGE_ALL}
                        />
                    )}
                    {programStages.map(({ id, displayName }) => (
                        <SingleSelectOption
                            label={displayName}
                            key={id}
                            value={id}
                        />
                    ))}
                </SingleSelect>
            )}
        </div>
    )
}

ProgramDimensionsFilter.propTypes = {
    program: PropTypes.object.isRequired,
}

export { ProgramDimensionsFilter }
