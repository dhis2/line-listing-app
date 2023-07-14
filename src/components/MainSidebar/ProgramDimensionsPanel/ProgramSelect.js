import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './ProgramSelect.module.css'
import { StageSelect } from './StageSelect.js'

const ProgramSelect = ({
    programs,
    setSelectedProgramId,
    requiredStageSelection,
    selectedProgram,
}) => {
    const showStageSelect = selectedProgram && requiredStageSelection

    return (
        <div className={styles.rows}>
            <div className={styles.columns}>
                <div className={styles.stretch}>
                    <SingleSelect
                        dense
                        selected={selectedProgram?.id}
                        onChange={({ selected }) =>
                            setSelectedProgramId(selected)
                        }
                        placeholder={i18n.t('Choose a program')}
                        maxHeight="max(60vh, 460px)"
                        dataTest={'program-select'}
                        filterable
                    >
                        {programs.map(({ id, name }) => (
                            <SingleSelectOption
                                key={id}
                                label={name}
                                value={id}
                            />
                        ))}
                    </SingleSelect>
                </div>
            </div>
            {showStageSelect && (
                <StageSelect stages={selectedProgram.programStages} />
            )}
        </div>
    )
}

ProgramSelect.propTypes = {
    programs: PropTypes.array.isRequired,
    setSelectedProgramId: PropTypes.func.isRequired,
    requiredStageSelection: PropTypes.bool,
    selectedProgram: PropTypes.object,
}

export { ProgramSelect }
