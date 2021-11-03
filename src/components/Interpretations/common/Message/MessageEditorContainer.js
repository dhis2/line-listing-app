import { UserAvatar } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/MessageEditorContainer.module.css'

const MessageEditorContainer = ({ children, currentUser }) => (
    <div className={classes.container}>
        <div className={classes.avatar}>
            <UserAvatar name={currentUser.name} medium />
        </div>
        <div className={classes.editor}>{children}</div>
    </div>
)

MessageEditorContainer.propTypes = {
    currentUser: PropTypes.object.isRequired,
    children: PropTypes.node,
}

export { MessageEditorContainer }
