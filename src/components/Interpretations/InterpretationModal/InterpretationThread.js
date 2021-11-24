import { IconClock16, colors } from '@dhis2/ui'
import cx from 'classnames'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import { Interpretation } from '../common/index.js'
import { Comment } from './Comment.js'
import { CommentAddForm } from './CommentAddForm.js'

const InterpretationThread = ({
    currentUser,
    fetching,
    interpretation,
    refetchInterpretation,
}) => {
    const focusRef = useRef()

    return (
        <div className={cx('container', { fetching })}>
            <div className={'scrollbox'}>
                <div className={'title'}>
                    <IconClock16 color={colors.grey700} />
                    {moment(interpretation.created).format('LLL')}
                </div>
                <div style={{ color: 'red' }}>Download btn placeholder</div>
                <Interpretation
                    currentUser={currentUser}
                    interpretation={interpretation}
                    reply={() => focusRef.current?.focus()}
                    refresh={refetchInterpretation}
                />
                <div className={'comments'}>
                    {interpretation.comments.map(comment => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            interpretationId={interpretation.id}
                            refresh={refetchInterpretation}
                        />
                    ))}
                </div>
                <CommentAddForm
                    currentUser={currentUser}
                    interpretationId={interpretation.id}
                    onSave={refetchInterpretation}
                    focusRef={focusRef}
                />
            </div>
            <style jsx>{`
                .container {
                    position: relative;
                    overflow: hidden;
                    max-height: calc(100vh - 285px);
                    display: flex;
                    flex-direction: column;
                }

                .container.fetching::before {
                    content: '';
                    position: absolute;
                    inset: 0px;
                    background-color: rgba(255, 255, 255, 0.8);
                }

                .container.fetching::after {
                    content: '';
                    position: absolute;
                    top: calc(50% - 24px);
                    left: calc(50% - 24px);
                    width: 48px;
                    height: 48px;
                    border-width: 6px;
                    border-style: solid;
                    border-color: rgba(110, 122, 138, 0.15)
                        rgba(110, 122, 138, 0.15) rgb(20, 124, 215);
                    border-image: initial;
                    border-radius: 50%;
                    animation: 1s linear 0s infinite normal none running
                        rotation;
                }

                .scrollbox {
                    overflow-y: auto;
                    scroll-behavior: smooth;
                }

                .title {
                    display: flex;
                    align-items: center;
                    gap: var(--spacers-dp8);
                    color: var(--colors-grey900);
                    font-size: 14px;
                    line-height: 18px;
                }

                .comments {
                    padding-left: 16px;
                    display: flex;
                    flex-direction: column;
                    padding-top: var(--spacers-dp4);
                    gap: var(--spacers-dp4);
                }

                @keyframes rotation {
                    0% {
                        transform: rotate(0);
                    }

                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    )
}

InterpretationThread.propTypes = {
    currentUser: PropTypes.object.isRequired,
    fetching: PropTypes.bool.isRequired,
    interpretation: PropTypes.object.isRequired,
    refetchInterpretation: PropTypes.func.isRequired,
}

export { InterpretationThread }
