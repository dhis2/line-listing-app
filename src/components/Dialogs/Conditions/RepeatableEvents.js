import i18n from '@dhis2/d2-i18n'
import { Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acSetUiRepetition } from '../../../actions/ui.js'
import {
    getDefaultUiRepetition,
    PROP_MOST_RECENT,
    PROP_OLDEST,
} from '../../../modules/ui.js'
import { sGetUiRepetitionByDimension } from '../../../reducers/ui.js'
import commonClasses from '../styles/Common.module.css'
import classes from './styles/ConditionsManager.module.css'

const RepeatableEvents = ({ dimensionId }) => {
    const dispatch = useDispatch()

    const setRepetition = (value) =>
        dispatch(acSetUiRepetition({ dimensionId, repetition: value }))

    const repetition = useSelector((state) =>
        sGetUiRepetitionByDimension(state, dimensionId)
    )

    if (!repetition) {
        setRepetition(getDefaultUiRepetition())
        return null
    }

    const { [PROP_MOST_RECENT]: mostRecent, [PROP_OLDEST]: oldest } = repetition

    const onMostRecentChange = (value) => {
        setRepetition({
            [PROP_MOST_RECENT]: parseInt(value, 10),
            [PROP_OLDEST]: oldest,
        })
    }
    const onOldestChange = (value) => {
        setRepetition({
            [PROP_OLDEST]: parseInt(value, 10),
            [PROP_MOST_RECENT]: mostRecent,
        })
    }

    return (
        <div>
            <p className={commonClasses.paragraph}>
                {i18n.t(
                    'From stages with repeatable events, show values for this data element from:'
                )}
            </p>
            <div>
                <div className={classes.repeatableWrapper}>
                    <p className={commonClasses.paragraph}>
                        {i18n.t('Most recent events: ', {
                            keySeparator: '>',
                            nsSeparator: '|',
                        })}
                    </p>
                    <Input
                        type="number"
                        dense
                        className={classes.repeatableInput}
                        value={mostRecent.toString()}
                        onChange={({ value }) => onMostRecentChange(value)}
                    />
                </div>
                <div className={classes.repeatableWrapper}>
                    <p className={commonClasses.paragraph}>
                        {i18n.t('Oldest events: ', {
                            keySeparator: '>',
                            nsSeparator: '|',
                        })}
                    </p>
                    <Input
                        type="number"
                        dense
                        className={classes.repeatableInput}
                        value={oldest.toString()}
                        onChange={({ value }) => onOldestChange(value)}
                    />
                </div>
            </div>
        </div>
    )
}

RepeatableEvents.propTypes = {
    dimensionId: PropTypes.string.isRequired,
}

export default RepeatableEvents
