import {
    PeriodDimension as BasePeriodDimension,
    useCachedDataQuery,
    DAILY,
    WEEKLY,
    WEEKLYWED,
    WEEKLYTHU,
    WEEKLYSAT,
    WEEKLYSUN,
    BIWEEKLY,
    MONTHLY,
    BIMONTHLY,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { SegmentedControl } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { tSetCurrentFromUi } from '../../../actions/current.js'
import { acSetUiItems } from '../../../actions/ui.js'
import {
    SYSTEM_SETTINGS_HIDE_DAILY_PERIODS,
    SYSTEM_SETTINGS_HIDE_WEEKLY_PERIODS,
    SYSTEM_SETTINGS_HIDE_BIWEEKLY_PERIODS,
    SYSTEM_SETTINGS_HIDE_MONTHLY_PERIODS,
    SYSTEM_SETTINGS_HIDE_BIMONTHLY_PERIODS,
} from '../../../modules/systemSettings.js'
import { USER_SETTINGS_UI_LOCALE } from '../../../modules/userSettings.js'
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
    const formatter = new Intl.DateTimeFormat(
        userSettings[USER_SETTINGS_UI_LOCALE],
        {
            dateStyle: 'long',
        }
    )
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

const useExcludedPeriods = () => {
    const { systemSettings } = useCachedDataQuery()
    const types = []
    if (systemSettings[SYSTEM_SETTINGS_HIDE_DAILY_PERIODS]) {
        types.push(DAILY)
    }
    if (systemSettings[SYSTEM_SETTINGS_HIDE_WEEKLY_PERIODS]) {
        types.push(WEEKLY, WEEKLYWED, WEEKLYTHU, WEEKLYSAT, WEEKLYSUN)
    }
    if (systemSettings[SYSTEM_SETTINGS_HIDE_BIWEEKLY_PERIODS]) {
        types.push(BIWEEKLY)
    }
    if (systemSettings[SYSTEM_SETTINGS_HIDE_MONTHLY_PERIODS]) {
        types.push(MONTHLY)
    }
    if (systemSettings[SYSTEM_SETTINGS_HIDE_BIMONTHLY_PERIODS]) {
        types.push(BIMONTHLY)
    }
    return types
}

export const PeriodDimension = ({ dimension, onClose }) => {
    const formatStartEndDate = useLocalizedStartEndDateFormatter()
    const getNameFromMetadata = useMetadataNameGetter()
    const dispatch = useDispatch()
    const isInLayout = useIsInLayout(dimension?.id)
    const excludedPeriodTypes = useExcludedPeriods()
    const selectedIds =
        useSelector((state) => sGetUiItemsByDimension(state, dimension?.id)) ||
        []
    const [entryMethod, setEntryMethod] = useState(
        selectedIds.filter((id) => isStartEndDate(id)).length
            ? OPTION_START_END_DATES
            : OPTION_PRESETS
    )

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

    const onSegmentedControlChange = ({ value }) => {
        setEntryMethod(value)
        updatePeriodDimensionItems([])
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
                onChange={onSegmentedControlChange}
            ></SegmentedControl>
            <div className={styles.entry}>
                {entryMethod === OPTION_PRESETS && (
                    <BasePeriodDimension
                        selectedPeriods={selectedIds.map((id) => ({
                            id,
                            name: getNameFromMetadata(id),
                        }))}
                        onSelect={({ items }) =>
                            updatePeriodDimensionItems(items)
                        }
                        excludedPeriodTypes={excludedPeriodTypes}
                    />
                )}
                {entryMethod === OPTION_START_END_DATES && (
                    <StartEndDate
                        value={selectedIds[0] || ''}
                        setValue={(value) => {
                            if (!value && selectedIds.length) {
                                updatePeriodDimensionItems([])
                            } else if (value && value !== selectedIds[0]) {
                                updatePeriodDimensionItems([{ id: value }])
                            }
                        }}
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
