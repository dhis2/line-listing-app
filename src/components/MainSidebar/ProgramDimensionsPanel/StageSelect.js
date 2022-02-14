import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tSetUiStage } from '../../../actions/ui.js'
import { sGetUiProgramStageId } from '../../../reducers/ui.js'

const STAGE_ALL = 'STAGE_ALL'

const StageSelect = ({ optional, stages }) => {
    const dispatch = useDispatch()
    const selectedStageId = useSelector(sGetUiProgramStageId)
    const onChange = ({ selected: stageId }) => {
        const stage = stages.find(({ id }) => id === stageId)
        dispatch(tSetUiStage(stage))
    }

    return (
        <SingleSelect
            prefix={i18n.t('Stage')}
            dense
            selected={selectedStageId}
            onChange={onChange}
        >
            {optional && (
                <SingleSelectOption label={i18n.t('All')} value={STAGE_ALL} />
            )}
            {stages.map(({ id, name }) => (
                <SingleSelectOption label={name} key={id} value={id} />
            ))}
        </SingleSelect>
    )
}

StageSelect.propTypes = {
    stages: PropTypes.arrayOf(PropTypes.object).isRequired,
    optional: PropTypes.bool,
}

export { StageSelect }
