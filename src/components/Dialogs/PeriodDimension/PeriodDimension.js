import {
    PeriodDimension as BasePeriodDimension,
    useCachedDataQuery,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { SegmentedControl } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
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

const useMetadataNameGetter = () => {
    const store = useStore()

    return (id) => {
        const { metadata } = store.getState()
        return metadata[id]?.name
    }
}

export const PeriodDimension = ({ dimension, onClose }) => {
    const formatStartEndDate = useLocalizedStartEndDateFormatter()
    const getNameFromMetadata = useMetadataNameGetter()
    const dispatch = useDispatch()
    const isInLayout = useIsInLayout(dimension?.id)
    const selectedIds =
        useSelector((state) => sGetUiItemsByDimension(state, dimension?.id)) ||
        []
    const [entryMethod, setEntryMethod] = useState(
        selectedIds.filter((id) => isStartEndDate(id)).length
            ? OPTION_START_END_DATES
            : OPTION_PRESETS
    )
    const [presets, setPresets] = useState(() =>
        selectedIds
            .filter((id) => !isStartEndDate(id))
            .map((id) => ({ id, name: getNameFromMetadata(id) }))
    )

    const [startEndDate, setStartEndDate] = useState(
        () => selectedIds.find((id) => isStartEndDate(id)) || ''
    )

    useEffect(() => {
        if (presets) {
            updatePeriodDimensionItems(presets)
        }
    }, [presets])

    useEffect(() => {
        updatePeriodDimensionItems(startEndDate ? [{ id: startEndDate }] : [])
    }, [startEndDate])

    const updatePeriodDimensionItems = (items) => {
        const { uiItems, metadata } = items.reduce(
            (acc, item) => {
                acc.uiItems.push(item.id)

                if (isStartEndDate(item.id)) {
                    acc.metadata[item.id] = {
                        id: item.id,
                        name: formatStartEndDate(item.id),
                    }
                } else {
                    acc.metadata[item.id] = item
                }

                return acc
            },
            { uiItems: [], metadata: {} }
        )

        dispatch(
            acSetUiItems(
                { dimensionId: dimension.id, itemIds: uiItems },
                metadata
            )
        )
    }

    const primaryOnClick = () => {
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
