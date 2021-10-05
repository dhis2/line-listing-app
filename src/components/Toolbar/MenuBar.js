import { FileMenu } from '@dhis2/analytics'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import history from '../../modules/history'
import { sGetCurrent } from '../../reducers/current'
import VisualizationOptionsManager from '../VisualizationOptions/VisualizationOptionsManager'
import classes from './styles/MenuBar.module.css'

const onOpen = id => {
    const path = `/${id}`
    if (history.location.pathname === path) {
        history.replace({ pathname: path, state: { isOpening: true } })
    } else {
        history.push(path)
    }
}
const onNew = () => {
    if (history.location.pathname === '/') {
        history.replace({ pathname: '/', state: { isResetting: true } })
    } else {
        history.push('/')
    }
}
const getOnRename = () => details =>
    console.log('rename not implemented', details)
const getOnSave = () => details => console.log('save not implemented', details)
const getOnSaveAs = () => details =>
    console.log('save as not implemented', details)
const getOnDelete = () => () => console.log('delete not implemented')
const getOnError = () => error => console.error('Error', error)

export const MenuBar = ({ dataTest, current, apiObjectName, ...props }) => {
    const { d2 } = useD2()

    return (
        <div className={classes.menuBar} data-test={dataTest}>
            <FileMenu
                d2={d2}
                fileType={apiObjectName}
                fileObject={current}
                onOpen={onOpen}
                onNew={onNew}
                onRename={getOnRename(props)}
                onSave={getOnSave(props)}
                onSaveAs={getOnSaveAs(props)}
                onDelete={getOnDelete(props)}
                onError={getOnError(props)}
            />
            <VisualizationOptionsManager />
        </div>
    )
}

MenuBar.propTypes = {
    apiObjectName: PropTypes.string,
    current: PropTypes.object,
    dataTest: PropTypes.string,
}

const mapStateToProps = state => ({
    current: sGetCurrent(state),
})

export default connect(mapStateToProps)(MenuBar)
