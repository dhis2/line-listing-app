import {
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_ALL,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
    DIMENSION_TYPE_CATEGORY,
    DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { SingleSelect, Input, Divider } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'
import { sGetUiInputType } from '../../../reducers/ui.js'
import { DimensionIcon } from '../DimensionItem/DimensionIcon.jsx'
import styles from './ProgramDimensionsFilter.module.css'
import { StageFilter } from './StageFilter.jsx'

const SingleSelectOption = ({ label, active, value, icon, onClick }) => (
    <div
        className={cx(styles.option, { [styles.active]: active })}
        data-value={value}
        onClick={(e) => onClick({}, e)}
    >
        {icon && <span className={styles.optionIcon}>{icon}</span>}
        {label}
    </div>
)

SingleSelectOption.propTypes = {
    active: PropTypes.bool,
    icon: PropTypes.node,
    label: PropTypes.string,
    value: PropTypes.string,
    onClick: PropTypes.func,
}

const ProgramDimensionsFilter = ({
    program,
    searchTerm,
    setSearchTerm,
    dimensionType,
    setDimensionType,
    stageFilter,
    setStageFilter,
    showProgramAttribute,
    hasProgramDataDimensions,
}) => {
    const inputType = useSelector(sGetUiInputType)
    
    // Show filter if there are dimensions OR if user has selected a specific dimension type
    // This ensures the filter remains visible even when type filtering results in 0 dimensions
    const shouldShowFilter = hasProgramDataDimensions || dimensionType !== DIMENSION_TYPE_ALL
    
    return (
    <div className={styles.container}>
        {shouldShowFilter && (
            <div className={styles.dropdownWrapper}>
                <SingleSelect
                    prefix={i18n.t('Type')}
                    selected={dimensionType}
                    onChange={({ selected }) => setDimensionType(selected)}
                    dense
                >
            <SingleSelectOption
                label={i18n.t('All types')}
                value={DIMENSION_TYPE_ALL}
            />
            <Divider />
            <SingleSelectOption
                label={i18n.t('Data element')}
                value={DIMENSION_TYPE_DATA_ELEMENT}
                icon={
                    <DimensionIcon
                        dimensionType={DIMENSION_TYPE_DATA_ELEMENT}
                    />
                }
            />
            {showProgramAttribute && (
                <SingleSelectOption
                    label={i18n.t('Program attribute')}
                    value={DIMENSION_TYPE_PROGRAM_ATTRIBUTE}
                    icon={
                        <DimensionIcon
                            dimensionType={DIMENSION_TYPE_PROGRAM_ATTRIBUTE}
                        />
                    }
                />
            )}
            {inputType !== OUTPUT_TYPE_TRACKED_ENTITY && (
                <SingleSelectOption
                    label={i18n.t('Program indicator')}
                    value={DIMENSION_TYPE_PROGRAM_INDICATOR}
                    icon={
                        <DimensionIcon
                            dimensionType={DIMENSION_TYPE_PROGRAM_INDICATOR}
                        />
                    }
                />
            )}
            <SingleSelectOption
                label={i18n.t('Category')}
                value={DIMENSION_TYPE_CATEGORY}
                icon={<DimensionIcon dimensionType={DIMENSION_TYPE_CATEGORY} />}
            />
            <SingleSelectOption
                label={i18n.t('Category option group set')}
                value={DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET}
                icon={
                    <DimensionIcon
                        dimensionType={DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET}
                    />
                }
            />
        </SingleSelect>
            </div>
        )}
        {[OUTPUT_TYPE_ENROLLMENT, OUTPUT_TYPE_TRACKED_ENTITY].includes(
            inputType
        ) &&
            dimensionType === DIMENSION_TYPE_DATA_ELEMENT &&
            (!stageFilter ||
                program?.programStages.some(
                    (stage) => stage.id === stageFilter
                )) && (
                <StageFilter
                    stages={program?.programStages}
                    selected={stageFilter}
                    setSelected={setStageFilter}
                />
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
    setStageFilter: PropTypes.func,
    showProgramAttribute: PropTypes.bool,
    stageFilter: PropTypes.string,
    hasProgramDataDimensions: PropTypes.bool,
}

export { ProgramDimensionsFilter }
