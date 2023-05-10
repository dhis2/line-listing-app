import React from 'react'
import { useDispatch } from 'react-redux'
import { tSetCurrentFromUi } from '../../actions/current.js'
import { UpdateButton as UiUpdateButton } from '../../analyticsComponents/index.js'

export const UpdateButton = () => {
    const dispatch = useDispatch()

    const onClick = () => {
        dispatch(tSetCurrentFromUi())
    }

    /* TODO: under certain conditions we probably want to
     * disable this button and/or set a loading state */
    return <UiUpdateButton onClick={onClick} />
}
