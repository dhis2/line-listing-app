import {
    PeriodDimension as BasePeriodDimension,
    useCachedDataQuery,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { SegmentedControl } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tSetCurrentFromUi } from '../../../actions/current.js'
import { acSetUiItems } from '../../../actions/ui.js'
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

const isStartEndDate = (id) => {
    const parts = id.split('_')
    return (
        parts.length === 2 &&
        !isNaN(Date.parse(parts[0])) &&
        !isNaN(Date.parse(parts[1]))
    )
}

const useIsInLayout = (dimensionId) => {
    const allDimensionIds = useSelector(sGetDimensionIdsFromLayout)
    return useMemo(
        () => !!dimensionId && allDimensionIds.includes(dimensionId),
        [dimensionId, allDimensionIds]
    )
}

const useLocalizedStartEndDateFormatter = () => {
    const { userSettings } = useCachedDataQuery()
    const locale = userSettings.uiLocale
    const formatter = new Intl.DateTimeFormat(locale, {
        dateStyle: 'long',
    })
    return (startEndDate) => {
        if (isStartEndDate(startEndDate)) {
            return startEndDate
                .split('_')
                .map((dateStr) => formatter.format(new Date(dateStr)))
                .join(' - ')
        } else {
            return ''
        }
    }
}

export const PeriodDimension = ({ dimension, onClose }) => {
    const formatStartEndDate = useLocalizedStartEndDateFormatter()
    const dispatch = useDispatch()
    const isInLayout = useIsInLayout(dimension?.id)
    const selectedIds =
        useSelector((state) => sGetUiItemsByDimension(state, dimension?.id)) ||
        []
    const [entryMethod, setEntryMethod] = useState(OPTION_PRESETS)
    const [presets, setPresets] = useState(() =>
        selectedIds
            .filter((id) => !isStartEndDate(id))
            /*
             * TODO: it should be possible to fetch the names from the metadata
             * store once the backend starts returning period dimension metadata
             */
            .map((id) => ({ id, name: id }))
    )

    const [startEndDate, setStartEndDate] = useState(
        () => selectedIds.find((id) => isStartEndDate(id)) || ''
    )

    const primaryOnClick = () => {
        const metadata = presets.reduce((acc, preset) => {
            acc[preset.id] = preset
            return acc
        }, {})
        const uiItems = {
            dimensionId: dimension.id,
            itemIds: presets.map(({ id }) => id),
        }

        if (isStartEndDate(startEndDate)) {
            metadata[startEndDate] = {
                id: startEndDate,
                name: formatStartEndDate(startEndDate),
            }
            uiItems.itemIds.push(startEndDate)
        }

        dispatch(acSetUiItems(uiItems, metadata))
        dispatch(tSetCurrentFromUi())
        onClose()
    }

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
                        selectedPeriods={presets}
                        onSelect={({ items }) => setPresets(items)}
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

PeriodDimension.propTypes = {
    dimension: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
}
