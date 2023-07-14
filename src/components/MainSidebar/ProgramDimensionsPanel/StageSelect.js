import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    tSetUiStage,
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

    return (
        <div className={styles.rows}>
            <div className={styles.columns}>
                <div className={styles.stretch}>
                    <SingleSelect
                        placeholder={i18n.t('Stage')}
                        dense
                        selected={selectedStageId}
                        onChange={onChange}
                        dataTest={'stage-select'}
                    >
                        {stages.map(({ id, name }) => (
                            <SingleSelectOption
                                label={name}
                                key={id}
                                value={id}
                            />
                        ))}
                    </SingleSelect>
                </div>
            </div>
        </div>
    )
}

StageSelect.propTypes = {
    stages: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export { StageSelect }
