import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption, Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import {
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_ALL,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
} from '../../../modules/dimensionConstants.js'
import { PROGRAM_TYPE_WITH_REGISTRATION } from '../../../modules/programTypes.js'
import { OUTPUT_TYPE_ENROLLMENT } from '../../../modules/visualization.js'
import { sGetUiInputType } from '../../../reducers/ui.js'
import styles from './ProgramDimensionsFilter.module.css'
import { StageSelect } from './StageSelect.js'

const ProgramDimensionsFilter = ({
    program,
    searchTerm,
    setSearchTerm,
    dimensionType,
    setDimensionType,
}) => {
    const inputType = useSelector(sGetUiInputType)
    const showStageSelect =
        inputType === OUTPUT_TYPE_ENROLLMENT &&
        dimensionType === DIMENSION_TYPE_DATA_ELEMENT

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
                    value={DIMENSION_TYPE_ALL}
                />
                <SingleSelectOption
                    label={i18n.t('Data element')}
                    value={DIMENSION_TYPE_DATA_ELEMENT}
                />
                {program.programType === PROGRAM_TYPE_WITH_REGISTRATION && (
                    <SingleSelectOption
                        label={i18n.t('Program attribute')}
                        value={DIMENSION_TYPE_PROGRAM_ATTRIBUTE}
                    />
                )}
                <SingleSelectOption
                    label={i18n.t('Program indicator')}
                    value={DIMENSION_TYPE_PROGRAM_INDICATOR}
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

export { ProgramDimensionsFilter }
