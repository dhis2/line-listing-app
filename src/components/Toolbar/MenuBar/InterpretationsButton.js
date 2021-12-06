import i18n from '@dhis2/d2-i18n'
import { IconChevronRight24, IconChevronLeft24 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acToggleUiRightSidebar } from '../../../actions/ui.js'
import { sGetCurrent } from '../../../reducers/current.js'
import { sGetUiShowRightSidebar } from '../../../reducers/ui.js'
import MenuButton from './MenuButton.js'
import styles from './styles/InterpretationsButton.module.css'

export const InterpretationsButton = ({ showRightSidebar, id, onClick }) => (
    <MenuButton disabled={!id} onClick={onClick}>
        <div className={styles.iconWrapper}>
            {showRightSidebar ? <IconChevronRight24 /> : <IconChevronLeft24 />}
        </div>
        {i18n.t('Interpretations')}
    </MenuButton>
)

InterpretationsButton.propTypes = {
    id: PropTypes.string,
    showRightSidebar: PropTypes.bool,
    onClick: PropTypes.func,
}

const mapStateToProps = (state) => ({
    showRightSidebar: sGetUiShowRightSidebar(state),
    id: sGetCurrent(state)?.id,
})

const mapDispatchToProps = {
    onClick: acToggleUiRightSidebar,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InterpretationsButton)
