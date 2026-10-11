import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption, IconCopy16 } from '@dhis2/ui'
import cx from 'classnames'
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
        <div className={cx(styles.rows, styles.stage)}>
            <div className={styles.columns}>
                <div className={styles.stretch}>
                    <div className={styles.dropdownWrapper}>
                        <SingleSelect
                        dense
                        selected={selectedStageId}
                        onChange={onChange}
                        dataTest="stage-select"
                        filterable
                        noMatchText={i18n.t('No stages found')}
                        placeholder={i18n.t('Choose a stage')}
                        prefix={<IconCopy16 />}
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
        </div>
    )
}

StageSelect.propTypes = {
    stages: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export { StageSelect }
