import i18n from '@dhis2/d2-i18n'
import { Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acSetUiRepetition } from '../../../actions/ui.js'
import { PROP_MOST_RECENT, PROP_OLDEST } from '../../../modules/ui.js'
import { sGetUiRepetitionByDimension } from '../../../reducers/ui.js'
import commonClasses from '../styles/Common.module.css'
import classes from './styles/ConditionsManager.module.css'

const RepeatableEvents = ({ dimensionId }) => {
    const dispatch = useDispatch()

    // TODO: if there's no repetition on component mount then call the setReptition with the default value

    const { [PROP_MOST_RECENT]: mostRecent, [PROP_OLDEST]: oldest } =
        useSelector((state) => sGetUiRepetitionByDimension(state, dimensionId))

    const setReptetition = (repetition) =>
        dispatch(acSetUiRepetition({ dimensionId, repetition }))

    const onMostRecentChange = (value) => {
        setReptetition({
            [PROP_MOST_RECENT]: parseInt(value, 10),
            [PROP_OLDEST]: oldest,
        })
    }
    const onOldestChange = (value) => {
        setReptetition({
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
                        value={mostRecent}
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
                        value={oldest}
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
