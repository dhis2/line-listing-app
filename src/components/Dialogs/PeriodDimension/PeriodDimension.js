import { PeriodDimension as BasePeriodDimension } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { SegmentedControl } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { tSetCurrentFromUi } from '../../../actions/current.js'
import { acAddMetadata } from '../../../actions/metadata.js'
import {
    sGetDimensionIdsFromLayout,
    sGetUiItemsByDimension,
} from '../../../reducers/ui.js'
import DimensionModal from '../DimensionModal.js'
import styles from './PeriodDimension.module.css'
import { StartEndDate } from './StartEndDate.js'

export const OPTION_PRESETS = 'PRESETS'
export const OPTION_START_END_DATES = 'START_END_DATES'
const segmentedControlOptions = [
    { label: i18n.t('Choose from presets'), value: OPTION_PRESETS },
    {
        label: i18n.t('Define start - end dates'),
        value: OPTION_START_END_DATES,
    },
]

export const PeriodDimension = ({
    addMetadata,
    dimension,
    isInLayout,
    selectedIds,
    onClose,
    onUpdate,
}) => {
    const [entryMethod, setEntryMethod] = useState(OPTION_PRESETS)
    const [startEndDate, setStartEndDate] = useState('')
    const selectedPeriods = selectedIds.map((id) => ({ id, name: id }))

    // console.log(
    //     addMetadata,
    //     dimension,
    //     isInLayout,
    //     selectedIds,
    //     setUiItems,
    //     onClose,
    //     onUpdate
    // )
    const primaryOnClick = () => console.log('clicka')

    return dimension ? (
        <DimensionModal
            dataTest={'period-dimension-modal'}
            isInLayout={isInLayout}
            onClose={onClose}
            onUpdate={primaryOnClick}
            title={dimension.name}
        >
            <SegmentedControl
                options={segmentedControlOptions}
                selected={entryMethod}
                onChange={({ value }) => setEntryMethod(value)}
            ></SegmentedControl>
            <div className={styles.entry}>
                {entryMethod === OPTION_PRESETS && (
                    <BasePeriodDimension
                        selectedPeriods={selectedPeriods}
                        onSelect={(payload) => console.log(payload)}
                    />
                )}
                {entryMethod === OPTION_START_END_DATES && (
                    <StartEndDate
                        value={startEndDate}
                        setValue={setStartEndDate}
                    />
                )}
            </div>
        </DimensionModal>
    ) : null
}

SegmentedControl.propTypes = {
    /** An option to select; should match the `value` property of the option to be selected */
    selected: PropTypes.string.isRequired,
    /** Called with the signature `({ value: string }, event)` */
    onChange: PropTypes.func.isRequired,
}

PeriodDimension.propTypes = {
    addMetadata: PropTypes.func.isRequired,
    dimension: PropTypes.object.isRequired,
    isInLayout: PropTypes.bool.isRequired,
    selectedIds: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
    isInLayout: sGetDimensionIdsFromLayout(state).includes(
        ownProps.dimension?.id
    ),
    selectedIds: sGetUiItemsByDimension(state, ownProps.dimension?.id) || [],
})

export default connect(mapStateToProps, {
    onUpdate: tSetCurrentFromUi,
    addMetadata: acAddMetadata,
})(PeriodDimension)
