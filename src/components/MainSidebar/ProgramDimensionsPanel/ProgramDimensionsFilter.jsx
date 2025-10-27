import {
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_ALL,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
    DIMENSION_TYPE_CATEGORY,
    DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
    OUTPUT_TYPE_ENROLLMENT,
    OUTPUT_TYPE_TRACKED_ENTITY,
} from '../../../modules/visualization.js'
import { sGetUiInputType } from '../../../reducers/ui.js'
import styles from './ProgramDimensionsFilter.module.css'
import { StageFilter } from './StageFilter.jsx'
import { IconFilter16 } from '@dhis2/ui'

// Helper function to get the display label for a dimension type
const getDimensionTypeLabel = (dimensionType) => {
    switch (dimensionType) {
        case DIMENSION_TYPE_DATA_ELEMENT:
            return i18n.t('Data elements')
        case DIMENSION_TYPE_PROGRAM_ATTRIBUTE:
            return i18n.t('Program attributes')
        case DIMENSION_TYPE_PROGRAM_INDICATOR:
            return i18n.t('Program indicators')
        case DIMENSION_TYPE_CATEGORY:
            return i18n.t('Categories')
        case DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET:
            return i18n.t('Category option group sets')
        default:
            return ''
    }
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
    const [showDropdown, setShowDropdown] = useState(false)

    // Show filter if there are dimensions OR if user has selected a specific dimension type
    // This ensures the filter remains visible even when type filtering results in 0 dimensions
    const shouldShowFilter =
        hasProgramDataDimensions || dimensionType !== DIMENSION_TYPE_ALL

    const handleFilterClick = () => {
        setShowDropdown(!showDropdown)
    }

    const handleFilterSelect = (selectedType) => {
        setDimensionType(selectedType)
        setShowDropdown(false)
    }

    const handleRemoveFilter = (e) => {
        e.stopPropagation()
        setDimensionType(DIMENSION_TYPE_ALL)
        setShowDropdown(false)
    }

    const isFilterActive = dimensionType !== DIMENSION_TYPE_ALL

    return (
        <div className={styles.container}>
            {shouldShowFilter && (
                <div className={styles.filterWrapper}>
                    <div className={styles.filterButtonContainer}>
                        <button
                            className={`${styles.filterButton} ${
                                isFilterActive ? styles.filterButtonActive : ''
                            }`}
                            onClick={handleFilterClick}
                        >
                            <span className={styles.filterIcon}>
                                <IconFilter16 />
                            </span>
                            {isFilterActive ? (
                                <>
                                    <span className={styles.filterLabel}>
                                        {getDimensionTypeLabel(dimensionType)}
                                    </span>
                                    <button
                                        className={styles.removeButton}
                                        onClick={handleRemoveFilter}
                                        aria-label={i18n.t('Remove filter')}
                                    >
                                        ×
                                    </button>
                                </>
                            ) : (
                                <span className={styles.filterLabel}>
                                    {i18n.t('Filter data type')}
                                </span>
                            )}
                        </button>

                        {showDropdown && (
                            <div className={styles.filterDropdown}>
                                <button
                                    className={styles.filterOption}
                                    onClick={() =>
                                        handleFilterSelect(DIMENSION_TYPE_ALL)
                                    }
                                >
                                    {i18n.t('All types')}
                                </button>
                                <button
                                    className={styles.filterOption}
                                    onClick={() =>
                                        handleFilterSelect(
                                            DIMENSION_TYPE_DATA_ELEMENT
                                        )
                                    }
                                >
                                    {i18n.t('Data element')}
                                </button>
                                {showProgramAttribute && (
                                    <button
                                        className={styles.filterOption}
                                        onClick={() =>
                                            handleFilterSelect(
                                                DIMENSION_TYPE_PROGRAM_ATTRIBUTE
                                            )
                                        }
                                    >
                                        {i18n.t('Program attribute')}
                                    </button>
                                )}
                                {inputType !== OUTPUT_TYPE_TRACKED_ENTITY && (
                                    <button
                                        className={styles.filterOption}
                                        onClick={() =>
                                            handleFilterSelect(
                                                DIMENSION_TYPE_PROGRAM_INDICATOR
                                            )
                                        }
                                    >
                                        {i18n.t('Program indicator')}
                                    </button>
                                )}
                                <button
                                    className={styles.filterOption}
                                    onClick={() =>
                                        handleFilterSelect(
                                            DIMENSION_TYPE_CATEGORY
                                        )
                                    }
                                >
                                    {i18n.t('Category')}
                                </button>
                                <button
                                    className={styles.filterOption}
                                    onClick={() =>
                                        handleFilterSelect(
                                            DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET
                                        )
                                    }
                                >
                                    {i18n.t('Category option group set')}
                                </button>
                            </div>
                        )}
                    </div>
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
