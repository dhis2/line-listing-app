import {
    SET_VISUALIZATION,
    CLEAR_VISUALIZATION,
} from '../reducers/visualization.js'

export const acSetVisualization = (value) => ({
    type: SET_VISUALIZATION,
    value,
})

export const acClearVisualization = () => ({
    type: CLEAR_VISUALIZATION,
})
