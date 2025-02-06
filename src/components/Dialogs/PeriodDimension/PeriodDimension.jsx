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
import { acSetUiItems } from '../../../actions/ui.js'
import {
    extractDimensionIdParts,
    formatDimensionId,
} from '../../../modules/dimensionId.js'
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
    sGetUiInputType,
} from '../../../reducers/ui.js'
import DimensionModal from '../DimensionModal.jsx'
import styles from './PeriodDimension.module.css'
import { StartEndDate } from './StartEndDate.jsx'

export const OPTION_PRESETS = 'PRESETS'
export const OPTION_START_END_DATES = 'START_END_DATES'

const getStartEndDate = (id) => {
    const { dimensionId: periodId } = extractDimensionIdParts(id)
    const parts = periodId.split('_')
    return parts.length === 2 &&
        !isNaN(Date.parse(parts[0])) &&
        !isNaN(Date.parse(parts[1]))
        ? parts
        : []
}

const isStartEndDate = (id) => getStartEndDate(id).length === 2

const useIsInLayout = (dimensionId) => {
    const allDimensionIds = useSelector(sGetDimensionIdsFromLayout)
    return useMemo(
        () => !!dimensionId && allDimensionIds.includes(dimensionId),
        [dimensionId, allDimensionIds]
    )
}

const useLocalizedStartEndDateFormatter = () => {
    const { currentUser } = useCachedDataQuery()
    const formatter = new Intl.DateTimeFormat(
        currentUser.settings[USER_SETTINGS_UI_LOCALE],
        {
            dateStyle: 'long',
        }
    )
    return (startEndDate) => {
        if (isStartEndDate(startEndDate)) {
            return getStartEndDate(startEndDate)
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
    const selectedIds = useSelector((state) =>
        sGetUiItemsByDimension(state, dimension?.id).map(
            (id) => extractDimensionIdParts(id).dimensionId
        )
    )

    const [entryMethod, setEntryMethod] = useState(
        selectedIds.filter((id) => isStartEndDate(id)).length
            ? OPTION_START_END_DATES
            : OPTION_PRESETS
    )

    const outputType = useSelector(sGetUiInputType)

    const { programId } = extractDimensionIdParts(dimension.id, outputType)

    const updatePeriodDimensionItems = (items) => {
        const { uiItems, metadata } = items.reduce(
            (acc, item) => {
                const id = formatDimensionId({
                    dimensionId: item.id,
                    programId,
                    outputType,
                })
                acc.uiItems.push(id)

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

    const onSegmentedControlChange = ({ value }) => {
        if (value !== entryMethod) {
            setEntryMethod(value)
            updatePeriodDimensionItems([])
        }
    }

    return dimension ? (
        <DimensionModal
            dataTest="period-dimension-modal"
            isInLayout={isInLayout}
            onClose={onClose}
            title={dimension.name}
        >
            <div className={styles.navigation}>
                <SegmentedControl
                    options={[
                        {
                            label: i18n.t('Choose from presets'),
                            value: OPTION_PRESETS,
                        },
                        {
                            label: i18n.t('Define start - end dates'),
                            value: OPTION_START_END_DATES,
                        },
                    ]}
                    selected={entryMethod}
                    onChange={onSegmentedControlChange}
                ></SegmentedControl>
            </div>
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
                        value={getStartEndDate(selectedIds[0] || '')}
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
