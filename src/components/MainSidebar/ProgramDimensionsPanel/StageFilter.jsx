import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const STAGE_ALL = 'STAGE_ALL'

const StageFilter = ({ stages, selected, setSelected }) => {
    const onChange = ({ selected: stageId }) => {
        if (stageId === STAGE_ALL) {
            setSelected()
        } else {
            setSelected(stageId)
        }
    }

    return (
        <SingleSelect
            prefix={i18n.t('Stage')}
            dense
            selected={selected || STAGE_ALL}
            onChange={onChange}
            dataTest="stage-select"
        >
            <SingleSelectOption label={i18n.t('All')} value={STAGE_ALL} />
            {stages.map(({ id, name }) => (
                <SingleSelectOption label={name} key={id} value={id} />
            ))}
        </SingleSelect>
    )
}

StageFilter.propTypes = {
    stages: PropTypes.arrayOf(PropTypes.object).isRequired,
    selected: PropTypes.string,
    setSelected: PropTypes.func,
}

export { StageFilter }
