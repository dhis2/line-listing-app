import { AboutAOUnit } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import history from '../../modules/history'
import { sGetCurrent } from '../../reducers/current'
import { sGetUser } from '../../reducers/user'
import { InterpretationsUnit } from '../Interpretations/InterpretationsUnit/index.js'
import classes from './styles/DetailsPanel.module.css'

export const DetailsPanel = ({
    currentUser,
    interpretationsUnitRef,
    visualization,
}) => (
    <div className={classes.panel}>
        <AboutAOUnit type="eventReports" id={visualization.id} />
        <InterpretationsUnit
            ref={interpretationsUnitRef}
            type="eventReport"
            id={visualization.id}
            currentUser={currentUser}
            onInterpretationClick={interpretationId =>
                history.push(
                    `/${visualization.id}?interpretationId=${interpretationId}`
                )
            }
            onReplyIconClick={interpretationId =>
                history.push(
                    `/${visualization.id}?interpretationId=${interpretationId}&initialFocus=true`
                )
            }
        />
    </div>
)

DetailsPanel.propTypes = {
    currentUser: PropTypes.object.isRequired,
    interpretationsUnitRef: PropTypes.object.isRequired,
    visualization: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    currentUser: sGetUser(state),
    visualization: sGetCurrent(state),
})

export default connect(mapStateToProps)(DetailsPanel)
