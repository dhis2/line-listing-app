export {
    selectProgramDimensions,
    INPUT_EVENT,
    INPUT_ENROLLMENT,
} from './selectProgramDimensions.js'
export { selectPeriod, FIXED, RELATIVE } from './selectPeriod.js'

const getPreviousYearStr = () => (new Date().getFullYear() - 1).toString()

export { getPreviousYearStr }
