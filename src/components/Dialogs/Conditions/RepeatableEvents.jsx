import i18n from '@dhis2/d2-i18n'
import { Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acRemoveUiRepetition, acSetUiRepetition } from '../../../actions/ui.js'
import {
    getDefaultUiRepetition,
    PROP_MOST_RECENT,
    PROP_OLDEST,
} from '../../../modules/repetition.js'
import { sGetUiRepetitionByDimension } from '../../../reducers/ui.js'
import commonClasses from '../styles/Common.module.css'
import classes from './styles/ConditionsManager.module.css'

const isDefaultRepetition = (repetition) => {
    const {
        [PROP_MOST_RECENT]: defaultMostRecent,
        [PROP_OLDEST]: defaultOldest,
    } = getDefaultUiRepetition()
    return (
        repetition?.[PROP_MOST_RECENT] === defaultMostRecent &&
        repetition?.[PROP_OLDEST] === defaultOldest
    )
}

const RepeatableEvents = ({ dimensionId }) => {
    const dispatch = useDispatch()
    const sRepetition = useSelector((state) =>
        sGetUiRepetitionByDimension(state, dimensionId)
    )
    const [repetition, setRepetition] = useState(
        sRepetition && !isDefaultRepetition(isDefaultRepetition)
            ? sRepetition
            : getDefaultUiRepetition()
    )

    useEffect(() => {
        if (isDefaultRepetition(repetition)) {
            dispatch(acRemoveUiRepetition(dimensionId))
        } else {
            dispatch(acSetUiRepetition({ dimensionId, repetition }))
        }
    }, [repetition])

    const { [PROP_MOST_RECENT]: mostRecent, [PROP_OLDEST]: oldest } = repetition

    const parseInput = (value) => {
        const parsedValue = parseInt(value, 10)
        return parsedValue > 0 ? parsedValue : 0
    }

    const onMostRecentChange = (value) => {
        setRepetition({
            [PROP_MOST_RECENT]: parseInput(value),
            [PROP_OLDEST]: oldest,
        })
    }
    const onOldestChange = (value) => {
        setRepetition({
            [PROP_OLDEST]: parseInput(value),
            [PROP_MOST_RECENT]: mostRecent,
        })
    }

    return (
        <div>
            <p className={commonClasses.paragraph}>
                {i18n.t(
                    'From stages with repeatable events, show values for this data element from:',
                    { nsSeparator: '^^' }
                )}
            </p>
            <div>
                <div className={classes.repeatableWrapper}>
                    <p className={commonClasses.paragraph}>
                        {i18n.t('Most recent events:', {
                            keySeparator: '>',
                            nsSeparator: '^^',
                        })}
                    </p>
                    <Input
                        type="number"
                        dense
                        className={classes.repeatableInput}
                        value={mostRecent.toString()}
                        onChange={({ value }) => onMostRecentChange(value)}
                        min="0"
                        dataTest="most-recent-input"
                    />
                </div>
                <div className={classes.repeatableWrapper}>
                    <p className={commonClasses.paragraph}>
                        {i18n.t('Oldest events:', {
                            keySeparator: '>',
                            nsSeparator: '^^',
                        })}
                    </p>
                    <Input
                        type="number"
                        dense
                        className={classes.repeatableInput}
                        value={oldest.toString()}
                        onChange={({ value }) => onOldestChange(value)}
                        min="0"
                        dataTest="oldest-input"
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
