import {
    AboutAOUnit,
    InterpretationsUnit,
    useCachedDataQuery,
} from '@dhis2/analytics'
import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import history from '../../modules/history.js'
import { isAoWithTimeDimension } from '../../modules/timeDimensions.js'
import { sGetCurrent } from '../../reducers/current.js'
import { sGetLoadError } from '../../reducers/loader.js'
import classes from './styles/DetailsPanel.module.css'

const navigateToOpenModal = (interpretationId, initialFocus) => {
    history.push(
        {
            pathName: history.location.pathname,
            search: `?${stringify({ interpretationId, initialFocus })}`,
        },
        { isModalOpening: true }
    )
}

const DetailsPanel = ({
    visualization,
    aboutAOUnitRenderId,
    interpretationsUnitRenderId,
    disabled,
}) => {
    const { currentUser } = useCachedDataQuery()
    const hasTimeDimension = useMemo(
        () => isAoWithTimeDimension(visualization),
        [visualization]
    )

    return (
        <div className={classes.panel} data-test="details-panel">
            <AboutAOUnit
                type="eventVisualization"
                id={visualization.id}
                renderId={aboutAOUnitRenderId}
            />
            <InterpretationsUnit
                type="eventVisualization"
                visualizationHasTimeDimension={hasTimeDimension}
                id={visualization.id}
                currentUser={currentUser}
                onInterpretationClick={(interpretationId) =>
                    navigateToOpenModal(interpretationId)
                }
                onReplyIconClick={(interpretationId) =>
                    navigateToOpenModal(interpretationId, true)
                }
                disabled={disabled}
                renderId={interpretationsUnitRenderId}
            />
        </div>
    )
}

DetailsPanel.propTypes = {
    visualization: PropTypes.object.isRequired,
    aboutAOUnitRenderId: PropTypes.number,
    disabled: PropTypes.bool,
    interpretationsUnitRenderId: PropTypes.number,
}

const mapStateToProps = (state) => ({
    visualization: sGetCurrent(state),
    disabled: !!sGetLoadError(state),
})

export default connect(mapStateToProps)(DetailsPanel)
