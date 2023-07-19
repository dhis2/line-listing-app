import 'jest-enzyme'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// This is just to keep the test output uncluttered
const ACTIONS_LOG_PATTERN = /::(set-output|debug|error|notice).*/
const processStdoutWrite = process.stdout.write.bind(process.stdout)
process.stdout.write = (str, encoding, cb) =>
    ACTIONS_LOG_PATTERN.test(str)
        ? undefined
        : processStdoutWrite(str, encoding, cb)

Enzyme.configure({ adapter: new Adapter() })
