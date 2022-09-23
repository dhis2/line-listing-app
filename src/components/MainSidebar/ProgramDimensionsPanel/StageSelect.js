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

const STAGE_ALL = 'STAGE_ALL'

const StageSelect = ({ locked, optional, stages }) => {
    const dispatch = useDispatch()
    const selectedStageId = useSelector(sGetUiProgramStageId)
    const onChange = ({ selected: stageId }) => {
        if (stageId === STAGE_ALL) {
            dispatch(tClearUiStage())
        } else {
            const stage = stages.find(({ id }) => id === stageId)
            dispatch(tSetUiStage(stage))
        }

        if (!optional && selectedStageId) {
            dispatch(tClearUiProgramStageDimensions(selectedStageId))
        }
    }
    const includeShowAllOption = optional && stages.length > 1
    const selected =
        selectedStageId || (includeShowAllOption ? STAGE_ALL : undefined)

    const clearStage = () => {
        dispatch(tClearUiProgramStageDimensions(selectedStageId))
        dispatch(tClearUiStage())
    }

    const select = (
        <SingleSelect
            prefix={locked ? undefined : i18n.t('Stage')}
            placeholder={locked ? i18n.t('Stage') : undefined}
            dense
            selected={selected}
            onChange={onChange}
            disabled={locked && !!selected}
        >
            {includeShowAllOption && (
                <SingleSelectOption label={i18n.t('All')} value={STAGE_ALL} />
            )}
            {stages.map(({ id, name }) => (
                <SingleSelectOption label={name} key={id} value={id} />
            ))}
        </SingleSelect>
    )

    return locked ? (
        <div className={styles.rows}>
            <div className={styles.columns}>
                <div className={styles.stretch}>
                    {!selected ? (
                        select
                    ) : (
                        <Tooltip
                            content={i18n.t(
                                'Clear stage first to choose another'
                            )}
                        >
                            {select}
                        </Tooltip>
                    )}
                </div>
                {selected && (
                    <Button small secondary onClick={clearStage}>
                        {i18n.t('Clear')}
                    </Button>
                )}
            </div>
        </div>
    ) : (
        select
    )
}

StageSelect.propTypes = {
    stages: PropTypes.arrayOf(PropTypes.object).isRequired,
    locked: PropTypes.bool,
    optional: PropTypes.bool,
}

export { StageSelect }
