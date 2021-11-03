import React, { forwardRef } from 'react'
import styles from './styles/MessageInput.module.css'

const MessageInput = forwardRef((props, ref) => (
    <input ref={ref} className={styles.input} {...props} />
))

MessageInput.displayName = 'MessageInput'

export { MessageInput }
