import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    IconChevronDown24,
    IconChevronUp24,
    colors,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { InterpretationForm } from './InterpretationForm'
import { InterpretationList } from './InterpretationList'
import classes from './styles/InterpretationsUnit.module.css'

const interpretationsQuery = {
    interpretations: {
        resource: 'interpretations',
        params: ({ type, id }) => ({
            fields: [
                'id',
                'user[displayName]',
                'created',
                'text',
                'comments[id]',
                'likes',
                'likedBy[id]',
            ],
            filter: `${type}.id:eq:${id}`,
        }),
    },
}

export const InterpretationsUnit = ({
    currentUser,
    type,
    id,
    onInterpretationClick,
}) => {
    const [isExpanded, setIsExpanded] = useState(true)

    const { data, loading, refetch } = useDataQuery(interpretationsQuery, {
        lazy: true,
    })

    useEffect(() => {
        if (id) {
            refetch({ type, id })
        }
    }, [type, id])

    const onCompleteAction = () => {
        refetch({ type, id })
    }

    return (
        <div
            className={cx(classes.container, {
                [classes.expanded]: isExpanded,
            })}
        >
            <div
                className={classes.header}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className={classes.title}>
                    {i18n.t('Interpretations')}
                </span>
                {isExpanded ? (
                    <IconChevronUp24 color={colors.grey700} />
                ) : (
                    <IconChevronDown24 color={colors.grey700} />
                )}
            </div>
            {isExpanded && (
                <>
                    {loading && (
                        <div className={classes.loader}>
                            <CircularLoader small />
                        </div>
                    )}
                    {data && (
                        <>
                            <InterpretationList
                                currentUser={currentUser}
                                interpretations={
                                    data.interpretations.interpretations
                                }
                                onInterpretationClick={onInterpretationClick}
                                refresh={onCompleteAction}
                            />
                            <InterpretationForm
                                currentUser={currentUser}
                                type={type}
                                id={id}
                                onSave={onCompleteAction}
                            />
                        </>
                    )}
                </>
            )}
        </div>
    )
}

InterpretationsUnit.defaultProps = {
    onInterpretationClick: Function.prototype,
}

InterpretationsUnit.propTypes = {
    currentUser: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onInterpretationClick: PropTypes.func,
}
