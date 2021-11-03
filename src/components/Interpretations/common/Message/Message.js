import { Parser as RichTextParser } from '@dhis2/d2-ui-rich-text'
import { UserAvatar } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/Message.module.css'

const Message = ({ children, text, created, id, username, onClick }) => (
    <li className={styles.container} onClick={() => onClick && onClick(id)}>
        <div className={styles.header}>
            <UserAvatar name={username} extrasmall />
            {username}
            <time dateTime={created}>
                {moment(created).format('DD/MM/YY hh:mm')}
            </time>
        </div>
        <div className={styles.content}>
            <RichTextParser>{text}</RichTextParser>
        </div>
        <div className={styles.footer}>{children}</div>
    </li>
)

Message.propTypes = {
    children: PropTypes.node.isRequired,
    created: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    onClick: PropTypes.func,
}

export { Message }
