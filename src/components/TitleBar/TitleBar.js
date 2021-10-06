import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { sGetCurrent } from '../../reducers/current'

export const TitleBar = ({ current }) =>
    current ? <span>{current.name}</span> : null

TitleBar.propTypes = {
    current: PropTypes.object,
}

const mapStateToProps = state => ({
    current: sGetCurrent(state),
})

export default connect(mapStateToProps)(TitleBar)
