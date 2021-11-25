import i18n from '@dhis2/d2-i18n'
import { Button, IconInfo16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import NumericCondition from './NumericCondition'
import classes from './styles/ConditionsManager.module.css'

const ConditionsManager = ({}) => {
    const [conditions, setConditions] = useState([])

    const addCondition = () => setConditions([...conditions, ''])

    const removeCondition = id =>
        setConditions(conditions.filter((_, index) => index !== id))

    const setCondition = (id, value) =>
        setConditions(
            conditions.map((condition, index) =>
                index === id ? value : condition
            )
        )

    return (
        <>
            <div>
                <p className={classes.paragraph}>
                    {i18n.t(
                        'Show items that meet the following conditions for this data item:'
                    )}
                </p>
            </div>
            <div className={classes.mainSection}>
                {!conditions.length ? (
                    <p className={classes.paragraph}>
                        <span className={classes.infoIcon}>
                            <IconInfo16 />
                        </span>
                        {i18n.t(
                            'No conditions yet, so all values will be included. Add a condition to filter results.'
                        )}
                    </p>
                ) : (
                    conditions.map((condition, index) => (
                        <div key={index}>
                            <NumericCondition
                                condition={condition}
                                onChange={value => setCondition(index, value)}
                                onRemove={() => removeCondition(index)}
                            />
                            {conditions.length > 1 &&
                                index < conditions.length - 1 && (
                                    <span className={classes.separator}>
                                        {i18n.t('and')}
                                    </span>
                                )}
                        </div>
                    ))
                )}
                <Button
                    type="button"
                    small
                    onClick={addCondition}
                    dataTest={'conditions-manager-add-condition'}
                    className={classes.addConditionButton}
                >
                    {conditions.length
                        ? i18n.t('Add another condition')
                        : i18n.t('Add a condition')}
                </Button>
            </div>
        </>
    )
}

ConditionsManager.propTypes = {
    //dimensionName: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
    //layout: sGetUiLayout(state),
})

const mapDispatchToProps = dispatch => ({
    //onAddDimensions: map => dispatch(acAddUiLayoutDimensions(map)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConditionsManager)
