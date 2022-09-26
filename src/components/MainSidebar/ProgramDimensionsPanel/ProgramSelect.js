import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption, Button, Tooltip } from '@dhis2/ui'
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
    /*
     * TODO: the logic for disabling the select and showing the clear
     * button needs to be changed later on. Currently this happens when
     * programId is present but it should actually happen once at least one
     * dimension item is selected
     */
    const showStageSelect = selectedProgram && requiredStageSelection
    const select = (
        <SingleSelect
            dense
            selected={selectedProgram?.id}
            disabled={!!selectedProgram}
            onChange={({ selected }) => setSelectedProgramId(selected)}
            placeholder={i18n.t('Choose a program')}
            maxHeight="max(60vh, 460px)"
            dataTest={'program-select'}
        >
            {programs.map(({ id, name }) => (
                <SingleSelectOption key={id} label={name} value={id} />
            ))}
        </SingleSelect>
    )

    return (
        <div className={styles.rows}>
            <div className={styles.columns}>
                <div className={styles.stretch}>
                    {!selectedProgram ? (
                        select
                    ) : (
                        <Tooltip
                            content={i18n.t(
                                'Clear program first to choose another'
                            )}
                        >
                            {select}
                        </Tooltip>
                    )}
                </div>
                {selectedProgram && (
                    <Button
                        small
                        secondary
                        onClick={() => setSelectedProgramId(undefined)}
                        dataTest={'program-clear-button'}
                    >
                        {i18n.t('Clear')}
                    </Button>
                )}
            </div>
            {showStageSelect && (
                <StageSelect stages={selectedProgram.programStages} locked />
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
