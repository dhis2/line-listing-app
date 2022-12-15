import i18n from '@dhis2/d2-i18n'
import { Button, SingleSelect, SingleSelectOption, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    tSetUiStage,
    tClearUiStage,
    tClearUiProgramStageDimensions,
} from '../../../actions/ui.js'
import { sGetUiProgramStageId } from '../../../reducers/ui.js'
import styles from './ProgramSelect.module.css'

const StageSelect = ({ stages }) => {
    const dispatch = useDispatch()
    const selectedStageId = useSelector(sGetUiProgramStageId)
    const onChange = ({ selected: stageId }) => {
        const stage = stages.find(({ id }) => id === stageId)
        dispatch(tSetUiStage(stage))

        if (selectedStageId) {
            dispatch(tClearUiProgramStageDimensions(selectedStageId))
        }
    }
    const canBeCleared = stages.length > 1

    const clearStage = () => {
        dispatch(tClearUiProgramStageDimensions(selectedStageId))
        dispatch(tClearUiStage())
    }

    const select = (
        <SingleSelect
            placeholder={i18n.t('Stage')}
            dense
            selected={selectedStageId}
            onChange={onChange}
            disabled={!!selectedStageId}
            dataTest={'stage-select'}
        >
            {stages.map(({ id, name }) => (
                <SingleSelectOption label={name} key={id} value={id} />
            ))}
        </SingleSelect>
    )

    return (
        <div className={styles.rows}>
            <div className={styles.columns}>
                <div className={styles.stretch}>
                    {!selectedStageId ? (
                        select
                    ) : (
                        <Tooltip
                            content={
                                canBeCleared
                                    ? i18n.t(
                                          'Clear stage first to choose another'
                                      )
                                    : i18n.t('This program only has one stage')
                            }
                        >
                            {select}
                        </Tooltip>
                    )}
                </div>
                {selectedStageId && canBeCleared && (
                    <Button
                        small
                        secondary
                        onClick={clearStage}
                        dataTest={'stage-clear-button'}
                    >
                        {i18n.t('Clear')}
                    </Button>
                )}
            </div>
        </div>
    )
}

StageSelect.propTypes = {
    stages: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export { StageSelect }
