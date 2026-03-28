import i18n from '@dhis2/d2-i18n'
import { IconFilter16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './ProgramDimensionsFilter.module.css'

const STAGE_ALL = 'STAGE_ALL'

const StageFilter = ({ stages, selected, setSelected }) => {
    const [showDropdown, setShowDropdown] = useState(false)

    const handleFilterClick = () => {
        setShowDropdown(!showDropdown)
    }

    const handleStageSelect = (stageId) => {
        if (stageId === STAGE_ALL) {
            setSelected()
        } else {
            setSelected(stageId)
        }
        setShowDropdown(false)
    }

    const handleRemoveFilter = (e) => {
        e.stopPropagation()
        setSelected()
        setShowDropdown(false)
    }

    const getSelectedStageName = () => {
        if (!selected) return null
        const stage = stages.find((s) => s.id === selected)
        return stage?.name
    }

    const isFilterActive = !!selected && selected !== STAGE_ALL

    return (
        <div className={styles.filterWrapper}>
            <div className={styles.filterButtonContainer}>
                <button
                    className={`${styles.filterButton} ${
                        isFilterActive ? styles.filterButtonActive : ''
                    }`}
                    onClick={handleFilterClick}
                    data-test="stage-filter-button"
                >
                    <span className={styles.filterIcon}>
                        <IconFilter16 />
                    </span>
                    {isFilterActive ? (
                        <>
                            <span className={styles.filterLabel}>
                                {getSelectedStageName()}
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
                            {i18n.t('Filter by stage')}
                        </span>
                    )}
                </button>

                {showDropdown && (
                    <div className={styles.filterDropdown}>
                        <button
                            className={styles.filterOption}
                            onClick={() => handleStageSelect(STAGE_ALL)}
                        >
                            {i18n.t('All stages')}
                        </button>
                        {stages.map(({ id, name }) => (
                            <button
                                key={id}
                                className={styles.filterOption}
                                onClick={() => handleStageSelect(id)}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

StageFilter.propTypes = {
    stages: PropTypes.arrayOf(PropTypes.object).isRequired,
    selected: PropTypes.string,
    setSelected: PropTypes.func,
}

export { StageFilter }
