export {
    addProgramDimensions,
    INPUT_EVENT,
    INPUT_ENROLLMENT,
} from './addProgramDimensions.js'
export { choosePeriod, FIXED, RELATIVE } from './choosePeriod.js'

const getPreviousYearStr = () => (new Date().getFullYear() - 1).toString()

export { getPreviousYearStr }
