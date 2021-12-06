import { Checkbox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acSetUiOptions } from '../../../actions/ui'
import { sGetUiOptions } from '../../../reducers/ui'
import { tabSectionOption } from '../styles/VisualizationOptions.style.js'

export const CheckboxBaseOption = ({
    option,
    label,
    value,
    onChange,
    inverted,
    dataTest,
}) => (
    <div className={tabSectionOption.className}>
        <Checkbox
            checked={inverted ? !value : value}
            label={label}
            name={option.name}
            onChange={({ checked }) => onChange(inverted ? !checked : checked)}
            dense
            dataTest={dataTest}
        />
    </div>
)

CheckboxBaseOption.propTypes = {
    dataTest: PropTypes.string,
    inverted: PropTypes.bool,
    label: PropTypes.string,
    option: PropTypes.object,
    value: PropTypes.bool,
    onChange: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => ({
    value: sGetUiOptions(state)[ownProps.option.name],
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    onChange: (value) =>
        dispatch(acSetUiOptions({ [ownProps.option.name]: value })),
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckboxBaseOption)
