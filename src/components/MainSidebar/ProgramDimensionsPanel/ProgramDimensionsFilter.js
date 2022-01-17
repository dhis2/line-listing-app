import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption, Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import { sGetUiInputType } from '../../../reducers/ui.js'
import { INPUT_TYPES } from '../InputPanel/index.js'
import styles from './ProgramDimensionsFilter.module.css'
import { StageSelect } from './StageSelect.js'

const DIMENSION_TYPES = {
    ALL: 'ALL',
    DATA_ELEMENT: 'DATA_ELEMENT',
    PROGRAM_ATTRIBUTE: 'PROGRAM_ATTRIBUTE',
    PROGRAM_INDICATOR: 'PROGRAM_INDICATOR',
}

const ProgramDimensionsFilter = ({
    program,
    searchTerm,
    setSearchTerm,
    dimensionType,
    setDimensionType,
}) => {
    const inputType = useSelector(sGetUiInputType)
    const showStageSelect =
        inputType === INPUT_TYPES.ENROLLMENT &&
        dimensionType === DIMENSION_TYPES.DATA_ELEMENT

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
                selected={dimensionType}
                onChange={({ selected }) => setDimensionType(selected)}
                dense
            >
                <SingleSelectOption
                    label={i18n.t('All')}
                    value={DIMENSION_TYPES.ALL}
                />
                <SingleSelectOption
                    label={i18n.t('Data element')}
                    value={DIMENSION_TYPES.DATA_ELEMENT}
                />
                <SingleSelectOption
                    label={i18n.t('Program attribute')}
                    value={DIMENSION_TYPES.PROGRAM_ATTRIBUTE}
                />
                <SingleSelectOption
                    label={i18n.t('Program indicator')}
                    value={DIMENSION_TYPES.PROGRAM_INDICATOR}
                />
            </SingleSelect>
            {showStageSelect && (
                <StageSelect stages={program.programStages} optional />
            )}
        </div>
    )
}

ProgramDimensionsFilter.propTypes = {
    program: PropTypes.object.isRequired,
    dimensionType: PropTypes.string,
    searchTerm: PropTypes.string,
    setDimensionType: PropTypes.func,
    setSearchTerm: PropTypes.func,
}

export { ProgramDimensionsFilter, DIMENSION_TYPES }
