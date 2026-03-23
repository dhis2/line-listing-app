import { IconUndo16 } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
    acRestoreUiConversionSnapshot,
    acClearUiConversionSnapshot,
} from '../../actions/ui.js'
import styles from './styles/UndoConversionButton.module.css'

const DURATION_MS = 10000

const UndoConversionButton = ({ snapshot }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(acClearUiConversionSnapshot())
        }, DURATION_MS)
        return () => clearTimeout(timer)
    }, [dispatch])

    const handleUndo = () => {
        dispatch(acRestoreUiConversionSnapshot(snapshot))
    }

    return (
        <button
            className={styles.undoButton}
            onClick={handleUndo}
            type="button"
        >
            <span className={styles.countdown} aria-hidden="true" />
            <span className={styles.label}>
                <IconUndo16 />
                {i18n.t('Undo')}
            </span>
        </button>
    )
}

export default UndoConversionButton
