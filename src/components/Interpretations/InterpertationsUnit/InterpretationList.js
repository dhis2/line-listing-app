import { IconCalendar24, colors } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { Interpretation } from './Interpretation'
import classes from './styles/InterpretationList.module.css'

export const InterpretationList = ({
    currentUser,
    interpretations,
    onInterpretationClick,
    refresh,
}) => {
    const interpretationsByDate = interpretations.reduce(
        (groupedInterpretations, interpretation) => {
            const date = interpretation.created.split('T')[0]

            if (date in groupedInterpretations) {
                groupedInterpretations[date].push(interpretation)
            } else {
                groupedInterpretations[date] = [interpretation]
            }

            return groupedInterpretations
        },
        {}
    )

    const sortByDateProp = (a, b) => {
        const dateA = a.created
        const dateB = b.created

        if (dateA < dateB) {
            return -1
        }
        if (dateA > dateB) {
            return 1
        }
        return 0
    }

    return (
        <ol className={classes.interpretationGroups}>
            {Object.keys(interpretationsByDate)
                .sort()
                .reverse()
                .map(date => (
                    <li key={date}>
                        <div className={classes.dateSection}>
                            <IconCalendar24 color={colors.grey600} />
                            <time
                                dateTime={date}
                                className={classes.dateHeader}
                            >
                                {moment(date).format('ll')}
                            </time>
                        </div>
                        <ol className={classes.interpretationList}>
                            {interpretationsByDate[date]
                                .sort(sortByDateProp)
                                .map(interpretation => (
                                    <Interpretation
                                        key={interpretation.id}
                                        interpretation={interpretation}
                                        currentUser={currentUser}
                                        onClick={onInterpretationClick}
                                        refresh={refresh}
                                    />
                                ))}
                        </ol>
                    </li>
                ))}
        </ol>
    )
}

InterpretationList.propTypes = {
    currentUser: PropTypes.object.isRequired,
    interpretations: PropTypes.array.isRequired,
    refresh: PropTypes.func.isRequired,
    onInterpretationClick: PropTypes.func.isRequired,
}
