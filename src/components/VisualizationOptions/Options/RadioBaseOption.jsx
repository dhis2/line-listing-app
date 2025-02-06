import { Field, Radio } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acSetUiOptions } from '../../../actions/ui.js'
import { sGetUiOptions } from '../../../reducers/ui.js'

const RadioBaseOption = ({ name, items, value, onChange, dataTest }) => (
    <Field name={name} dense>
        {items.map(({ id, label }) => (
            <Radio
                key={id}
                label={label}
                value={id}
                checked={value === id}
                onChange={({ value }) => onChange(value)}
                dense
                dataTest={`${dataTest}-option-${id}`}
            />
        ))}
    </Field>
)

RadioBaseOption.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.string,
        })
    ).isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => ({
    value: sGetUiOptions(state)[ownProps.name],
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    onChange: (value) => dispatch(acSetUiOptions({ [ownProps.name]: value })),
})

export default connect(mapStateToProps, mapDispatchToProps)(RadioBaseOption)
