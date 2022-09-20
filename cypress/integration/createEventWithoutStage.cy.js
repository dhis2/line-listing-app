import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import { AEFI_PROGRAM, TEST_REL_PE_LAST_12_MONTHS } from '../data/index.js'
import { selectEventProgram } from '../helpers/dimensions.js'
import { clickMenubarUpdateButton } from '../helpers/menubar.js'
import { selectRelativePeriod } from '../helpers/period.js'
import { expectTableToBeVisible } from '../helpers/table.js'
import { EXTENDED_TIMEOUT } from '../support/util.js'

const program = AEFI_PROGRAM
const periodLabel = program[DIMENSION_ID_EVENT_DATE]

describe('event without stage', () => {
    it('creates an event line list', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        selectEventProgram({ programName: program.programName })

        selectRelativePeriod({
            label: periodLabel,
            period: TEST_REL_PE_LAST_12_MONTHS,
        })

        clickMenubarUpdateButton()

        expectTableToBeVisible()
    })
})
